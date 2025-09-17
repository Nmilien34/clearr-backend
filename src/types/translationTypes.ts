import { Schema } from "mongoose";

export interface ITranslation {
    _id: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId; // Reference to user
    date: Date;
    mode: 'professional' | 'personal' | 'casual';
    translationInput: string;
    translationOutput: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}