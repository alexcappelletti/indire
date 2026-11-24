import OpenAI from 'openai';
import type { H3Event } from 'h3';
import type { ConversationMessage } from '#shared/types/conversation';
import type { ReferenceFile } from '#shared/types/api';
import { AgentConversationModel } from '../models/agentConversation';
import { ResourceModel } from '../models/resource';
import { ensureMongoConnection } from '../utils/mongoClient';

type CreateMessageInput = {
	message: string;
	userId: string;
	conversationId?: string;
};

type AgentMessageResult = {
	message: ConversationMessage;
	conversationId: string;
	responseId: string;
	referenceFiles: ReferenceFile[];
};

function getAgentClient(event: H3Event) {
	const config = useRuntimeConfig(event);
	if (!config.agentApiKey) {
		throw createError({
			statusCode: 503,
			statusMessage: 'OPENAI_API_KEY non configurata',
		});
	}

	return new OpenAI({ apiKey: config.agentApiKey });
}

async function resolveConversationId(
	event: H3Event,
	client: OpenAI,
	userId: string,
	requestedConversationId?: string,
) {
	await ensureMongoConnection(event);
	const storedConversation = await AgentConversationModel.findOne({ userId }).lean();

	if (requestedConversationId) {
		if (!storedConversation || storedConversation.conversationId !== requestedConversationId) {
			throw createError({
				statusCode: 409,
				statusMessage: 'La conversazione non appartiene all’utente corrente',
			});
		}
		return requestedConversationId;
	}

	if (storedConversation?.conversationId) return storedConversation.conversationId;

	const conversation = await client.conversations.create({
		metadata: {
			user_id: userId,
		},
	});
	return conversation.id;
}

export async function createAgentMessage(
	event: H3Event,
	input: CreateMessageInput,
): Promise<AgentMessageResult> {
	const config = useRuntimeConfig(event);
	if (!config.agentModel) {
		throw createError({
			statusCode: 503,
			statusMessage: 'OPENAI_MODEL non configurato',
		});
	}

	const client = getAgentClient(event);
	const conversationId = await resolveConversationId(
		event,
		client,
		input.userId,
		input.conversationId,
	);
	const req_prompt = config.agentPromptId
		? {
			id: config.agentPromptId, 
			version: '4',
		}
		: undefined;
	// const instructions = [config.agentSystemPrompt, config.agentSkillPrompt]
	// 	.filter(Boolean)
	// 	.join('\n\n');
	const tools = config.agentVectorStoreId
		? [{ type: 'file_search' as const, vector_store_ids: [config.agentVectorStoreId] }]
		: undefined;


	console.log('reg_promt', JSON.stringify(req_prompt))
	console.log("tools", JSON.stringify(tools));
		
	const response = await client.responses.create({
		model: config.agentModel,
		conversation: conversationId,
		store: true,
		// instructions:
		// 	instructions ||
		// 		'Sei un agente riflessivo. Rispondi in italiano e accompagna l\'utente con domande utili e rispettose.',
		prompt: req_prompt,
		input: [{ role: 'user', content: input.message }],
		tools,
		include: ['file_search_call.results'],
	});

	const text = response.output_text?.trim();
	if (!text) {
		throw createError({
			statusCode: 502,
			statusMessage: 'OpenAI ha restituito una risposta vuota',
		});
	}

	type SearchResult = {
		filename?: string;
		score?: number;
		text?: string;
		attributes?: Record<string, string | number | boolean> | null;
	};

	const searchResults: SearchResult[] = response.output.flatMap((item) =>
		item.type === 'file_search_call' ? (item.results ?? []) : [],
	);

	console.log('[agent] OpenAI file_search results', searchResults.map((result) => ({
		fileId: result.file_id,
		filename: result.filename,
		score: result.score,
		attributes: result.attributes,
	})));

	// Temporaneamente non usiamo le annotazioni file_citation del messaggio:
	// i riferimenti del pannello devono provenire esclusivamente dai risultati
	// restituiti dalla chiamata file_search.
	// const citedFiles: SearchResult[] = response.output.flatMap((item) => {
	// 	if (item.type !== 'message') return [];
	// 
	// 	return item.content.flatMap((content) => {
	// 		if (content.type !== 'output_text') return [];
	// 
	// 		return content.annotations
	// 			.filter((annotation) => annotation.type === 'file_citation')
	// 			.map((annotation) => ({ filename: annotation.filename }));
	// 	});
	// });
	const filenames = [...new Set(
		searchResults
			.map((result) => result.filename)
			.filter((filename): filename is string => Boolean(filename)),
	)];
	const resources = filenames.length
		? await ResourceModel.find({ filename: { $in: filenames } })
			.select({ title: 1, filename: 1 })
			.lean()
		: [];
	const resourceByFilename = new Map(resources.map((resource) => [resource.filename, resource]));

	const referenceFiles = searchResults.reduce<ReferenceFile[]>((files, result) => {
		if (!result.filename) return files;
		const existing = files.find((file) => file.filename === result.filename);
		// Le annotazioni file_citation non espongono lo score. Manteniamo -1
		// internamente per distinguerlo da un punteggio reale pari a zero.
		const relevance =
			typeof result.score === 'number'
				? Math.round(result.score * 100)
				: -1;
		if (existing) {
			existing.relevance = Math.max(existing.relevance, relevance);
			if (!existing.highlight && result.text?.trim()) {
				existing.highlight = result.text.trim();
			}
			return files;
		}
		const resource = resourceByFilename.get(result.filename);
		const metadataTitle = result.attributes?.title;
		files.push({
			relevance,
			title: resource?.title || (typeof metadataTitle === 'string' ? metadataTitle : result.filename),
			filename: result.filename,
			highlight: result.text?.trim() || '',
		});
		return files;
	}, []);
	referenceFiles.sort((a, b) => b.relevance - a.relevance);

	// Se OpenAI ha restituito solo file_citation, non è disponibile uno score
	// numerico. Usiamo allora una stima basata sull'ordine dei risultati.
	referenceFiles.forEach((file, index) => {
		if (file.relevance < 0) {
			file.relevance = Math.max(1, 100 - index * 10);
		}
	});

	console.log('[agent] reference files found', {
		responseId: response.id,
		conversationId,
		count: referenceFiles.length,
		files: referenceFiles.map((file, index) => ({
			index,
			filename: file.filename,
			title: file.title,
			relevance: file.relevance,
		})),
	});

	await AgentConversationModel.updateOne(
		{ userId: input.userId },
		{
			$set: {
				conversationId,
				lastResponseId: response.id,
			},
		},
		{ upsert: true },
	);

	return {
		message: {
			role: 'agent',
			text,
			time: new Date().toISOString(),
		},
		conversationId,
		responseId: response.id,
		referenceFiles,
	};
}
