import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/userTypes';

const userSchema = new Schema<IUser>({
    _id: { type: Schema.Types.ObjectId, required: true },
    translationIds: { type: [Schema.Types.ObjectId], ref: 'Translation'},
    //revenueCatUserId: { type: String, unique: true }, // RevenueCat user identifier
    //originalAppUserId: { type: String }, // Original app user ID from RevenueCat
    //subscriptionStatus: { type: String, enum: ['active', 'inactive', 'grace_period', 'cancelled'], default: 'inactive' },
    //revenueCatProductId: { type: String }, // What product they bought (e.g., "standard_monthly")
    //entitlementId: { type: String }, // What features they get (e.g., "premium_features")
    //offeringId: { type: String }, // Which offering they saw (e.g., "current")
    //expirationDate: { type: Date }, // When subscription expires
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, unique: true, lowercase: true, trim: true, sparse: true},
    pushToken: { type: String},
    notificationEnabled: { type: Boolean, default: true },
    preferredMode: { type: String, enum: ['professional', 'personal', 'casual'], default: 'personal' },
    contextTraining: { type: [String]},
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    isVerified: { type: Boolean, required: true, default: false },
    //trialStatus: { type: String, enum: ['active', 'expired', 'not_started'], default: 'not_started' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true // this another method to created createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);

export default User;
