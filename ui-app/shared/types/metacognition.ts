import type {
	LearningStep,
	LearningStepState,
} from '#shared/types/learning';

export type ReflectionSummary = {
	text: string;
	updatedAt: string;
};

export type MetacognitiveOverviewItem = {
	label: string;
	detail: string;
	state: 'completed' | 'pending' | 'question';
};

export type MetacognitiveProgress = {
	completedSteps: number;
	stepsToExplore: number;
	openQuestion: string;
	currentStepState: LearningStepState;
};

export type MetacognitivePath = {
	steps: LearningStep[];
	progress: MetacognitiveProgress;
	summary: ReflectionSummary;
	overview: MetacognitiveOverviewItem[];
};
