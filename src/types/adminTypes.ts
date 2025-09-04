import { Schema } from "mongoose";

export interface IAdmin {
    _id: Schema.Types.ObjectId;
    fullName: string;
    email: string;
    password: string;
    role: 'admin' | 'superadmin';
    permissions: string[]; // Admin-specific permissions
    isActive: boolean;
    isDeleted: boolean;
}
