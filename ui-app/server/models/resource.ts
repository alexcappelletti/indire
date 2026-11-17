import { model, models, Schema } from 'mongoose';

const resourceSchema = new Schema(
	{
		title: { type: String, required: true, trim: true },
		author: { type: String, required: true, trim: true },
		kind: { type: String, enum: ['pdf'], default: 'pdf', required: true },
		filename: { type: String, required: true, trim: true },
		folderPath: { type: String, required: true, trim: true },
		mimeType: { type: String, enum: ['application/pdf'], default: 'application/pdf', required: true },
		sizeBytes: { type: Number, required: true, min: 1 },
		gridFsFileId: { type: Schema.Types.ObjectId, required: true, index: true },
		relevance: { type: Number, min: 0, max: 100, default: 0 },
		isPublished: { type: Boolean, default: false, index: true },
	},
	{ timestamps: true },
);

resourceSchema.index({ isPublished: 1, createdAt: -1 });

export const ResourceModel = models.Resource || model('Resource', resourceSchema);
