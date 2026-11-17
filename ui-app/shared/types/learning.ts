export type LearningStepState = 'completed' | 'current' | 'upcoming';

export type LearningStep = {
	number: number;
	title: string;
	mapLabel: string;
	state: LearningStepState;
};
