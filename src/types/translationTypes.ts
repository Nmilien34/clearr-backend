export interface ITranslation {
    _id: any;
    userId: any; // Reference to user
    date: Date;
    mode: 'professional' | 'personal' | 'casual';
    translationInput: string;
    translationOutput: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}