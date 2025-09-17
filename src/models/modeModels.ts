import mongoose, { Schema } from 'mongoose';
import { IMode, IModePrompt } from '../types/modeTypes';

const modeSchema = new Schema<IMode>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, maxlength: 50 },
    description: { type: String, required: true, trim: true, maxlength: 200 },
    isDefault: { type: Boolean, required: true, default: false },
    isActive: { type: Boolean, required: true, default: true },
}, {
    timestamps: true
});

// Ensure user can't have multiple default modes
modeSchema.index({ userId: 1, isDefault: 1 }, {
    unique: true,
    partialFilterExpression: { isDefault: true, isActive: true }
});

const Mode = mongoose.model<IMode>('Mode', modeSchema);

const modePromptSchema = new Schema<IModePrompt>({
    modeId: { type: Schema.Types.ObjectId, ref: 'Mode', required: true },
    prompt: { type: String, required: true, trim: true, maxlength: 2000 },
    isActive: { type: Boolean, required: true, default: true },
}, {
    timestamps: true
});

const ModePrompt = mongoose.model<IModePrompt>('ModePrompt', modePromptSchema);

export { Mode, ModePrompt };
export default Mode;