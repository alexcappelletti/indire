import mongoose from 'mongoose';

const authorizedUserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true,
			index: true,
		},
		name: { type: String, trim: true },
		isActive: { type: Boolean, default: true, index: true },
	},
	{ timestamps: true, collection: 'authorizedUsers' },
);

export const AuthorizedUserModel =
	mongoose.models.AuthorizedUser || mongoose.model('AuthorizedUser', authorizedUserSchema);
