import type {
	MetacognitiveOverviewItem,
	MetacognitivePath,
} from '../types/metacognition.ts';

function formatStepTitles(
	steps: MetacognitivePath['steps'],
	predicate: (step: MetacognitivePath['steps'][number]) => boolean,
) {
	return steps
		.filter(predicate)
		.map((step) => step.title.toLocaleLowerCase())
		.join(', ');
}

export function deriveMetacognitivePath(path: MetacognitivePath): MetacognitivePath {
	const completedSteps = path.steps.filter(
		(step) => step.state === 'completed',
	).length;
	const stepsToExplore = Math.max(path.steps.length - completedSteps, 0);
	const currentStep = path.steps.find((step) => step.state === 'current');
	const completedTitles = formatStepTitles(
		path.steps,
		(step) => step.state === 'completed',
	);
	const remainingTitles = formatStepTitles(
		path.steps,
		(step) => step.state !== 'completed',
	);
	const questionItem = path.overview.find(
		(item) => item.state === 'question',
	);

	const overview: MetacognitiveOverviewItem[] = [
		{
			label: `Dimensioni esplorate: ${completedSteps}`,
			detail: completedTitles ? `(${completedTitles})` : '(nessuna)',
			state: 'completed',
		},
		{
			label: `Da approfondire: ${stepsToExplore}`,
			detail: remainingTitles ? `(${remainingTitles})` : '(nessuna)',
			state: 'pending',
		},
		{
			label: questionItem?.label ?? 'Domanda ancora aperta',
			detail:
				questionItem?.detail ??
				path.progress.openQuestion,
			state: 'question',
		},
	];

	return {
		...path,
		progress: {
			...path.progress,
			completedSteps,
			stepsToExplore,
			currentStepState: currentStep?.state ?? 'upcoming',
		},
		overview,
	};
}
