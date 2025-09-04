import { Schema } from "mongoose";

export interface IUser {
    _id: Schema.Types.ObjectId
    translationIds: Schema.Types.ObjectId[]; // this is the ids of the translations that the user has done
    //revenueCatUserId: string; // this is what revenue cat gives us to identify the user
    //originalAppUserId: string; // we provide this to revenue cat to identify the user so make sure you understand revenucatUserID vs originalAppUserID
    //subscriptionStatus: 'active' | 'inactive' | 'grace_period' | 'cancelled'; // active, inactive, grace_period, etc.
    //revenueCatProductId: string; // this here is pretty much to locate the subscription plan
    //entitlementId: string; // What features they get (e.g., "premium_features")
    //offeringId: string; // Which offering they saw (e.g., "current")
    //expirationDate: Date; // When subscription expires
    fullName: string;
    phoneNumber: string; //phone number is very important since there won't be no password and phone auth will be the only way to login
    email?: string; // email is optional since there won't be no password and phone auth will be the only way to login
    pushToken?: string; // this is the push token that the user has for push notifications
    notificationEnabled: boolean; // this is the notification enabled that the user has for push notifications
    preferredMode: 'professional' | 'personal' | 'casual'; // this is the preferred mode that the user has for translation
    isActive: boolean;
    isDeleted: boolean;
    isVerified: boolean;
    //trialStatus: 'active' | 'expired' | 'not_started';
    createdAt: Date;
    updatedAt: Date;
    contextTraining: string[]; // this is the context training that the user has done
}