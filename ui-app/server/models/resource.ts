import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		author: { type: String, required: true, trim: true },
		kind: { type: String, enum: ['pdf'], default: 'pdf', required: true },
		filename: { type: String, required: true, trim: true },
		folderPath: { type: String, required: true, trim: true },
		mimeType: { type: String, enum: ['application/pdf'], default: 'application/pdf', required: true },
		sizeBytes: { type: Number, required: true, min: 1 },
		gridFsFileId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
		relevance: { type: Number, min: 0, max: 100, default: 0 },
		isPublished: { type: Boolean, default: false, index: true },
	},
	{ timestamps: true, collection: 'resourceBucket' },
);

resourceSchema.index({ isPublished: 1, createdAt: -1 });

export const ResourceModel = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);
