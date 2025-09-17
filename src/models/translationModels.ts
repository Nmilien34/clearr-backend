import mongoose, { Schema } from 'mongoose';
import { ITranslation } from '../types/translationTypes';

const translationSchema = new Schema<ITranslation>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true, default: Date.now },
    mode: { type: String, enum: ['professional', 'personal', 'casual'], required: true },
    translationInput: { type: String, required: true },
    translationOutput: { type: [String], required: true },
    isActive: { type: Boolean, required: true, default: true },
}, {
    timestamps: true
});

const Translation = mongoose.model<ITranslation>('Translation', translationSchema);
    

export default Translation;
