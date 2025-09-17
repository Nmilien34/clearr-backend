import { Schema } from "mongoose";

export interface IMode {
    _id: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId; // Reference to user who created this mode
    name: string; // Name of the mode (e.g., "Professional", "Family Chat", "Team Meetings")
    description: string; // Description of what this mode does
    isDefault: boolean; // Whether this is the user's default mode
    isActive: boolean; // Whether this mode is active (for soft delete)
    createdAt: Date;
    updatedAt: Date;
}

export interface IModePrompt {
    _id: Schema.Types.ObjectId;
    modeId: Schema.Types.ObjectId; // Reference to the mode
    prompt: string; // The actual prompt that influences the AI translation
    isActive: boolean; // Whether this prompt is active
    createdAt: Date;
    updatedAt: Date;
}