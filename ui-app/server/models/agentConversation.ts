import mongoose from 'mongoose';

const agentConversationSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true, trim: true, unique: true, index: true },
		conversationId: { type: String, required: true, trim: true },
		lastResponseId: { type: String, trim: true },
	},
	{ timestamps: true, collection: 'agentConversations' },
);

export const AgentConversationModel =
	mongoose.models.AgentConversation ||
	mongoose.model('AgentConversation', agentConversationSchema);
