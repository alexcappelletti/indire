import mongoose from 'mongoose';

const learningStepSchema = new mongoose.Schema(
	{
		number: { type: Number, required: true },
		title: { type: String, required: true, trim: true },
		mapLabel: { type: String, required: true },
		state: { type: String, enum: ['completed', 'current', 'upcoming'], required: true },
	},
	{ _id: false },
);

const metacognitivePathSchema = new mongoose.Schema(
	{
		steps: { type: [learningStepSchema], required: true },
		progress: {
			completedSteps: { type: Number, required: true, min: 0 },
			stepsToExplore: { type: Number, required: true, min: 0 },
			openQuestion: { type: String, required: true },
			currentStepState: {
				type: String,
				enum: ['completed', 'current', 'upcoming'],
				required: true,
			},
		},
		summary: {
			text: { type: String, required: true },
			updatedAt: { type: String, required: true },
		},
		overview: [
			{
				_id: false,
				label: { type: String, required: true },
				detail: { type: String, required: true },
				state: { type: String, enum: ['completed', 'pending', 'question'], required: true },
			},
		],
	},
	{ _id: false },
);

const userMetacognitivePathSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true, trim: true, unique: true, index: true },
		path: { type: metacognitivePathSchema, required: true },
	},
	{ timestamps: true, collection: 'userMetacognitivePaths' },
);

export const UserMetacognitivePathModel =
	mongoose.models.UserMetacognitivePath ||
	mongoose.model('UserMetacognitivePath', userMetacognitivePathSchema);
