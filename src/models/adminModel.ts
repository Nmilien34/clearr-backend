import mongoose, { Schema } from 'mongoose';

const adminSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'superadmin'], required: true },
    permissions: { type: [String], default: [] }, // Admin-specific permissions
}, {
    timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
