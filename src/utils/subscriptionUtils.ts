//this a place holder for the subscription features and prices
// COMMENTED OUT FOR MVP - SUBSCRIPTION FEATURES WILL BE ADDED POST-MVP

/*
export const getSubscriptionFeatures = (revenueCatProductId?: string) => {
    const features = {
        // Free (default)
        default: {
            translationsPerMonth: 50,
            modes: ['professional', 'personal', 'casual'],
            models: ['gpt-4']
        },
        // Standard plans
        'standard_monthly': {
            translationsPerMonth: 1000,
            modes: ['professional', 'personal', 'casual'],
            models: ['gpt-4']
        },
        'standard_annual': {
            translationsPerMonth: 1000,
            modes: ['professional', 'personal', 'casual'],
            models: ['gpt-4']
        },
        // Premium plans
        'premium_monthly': {
            translationsPerMonth: 10000,
            modes: ['professional', 'personal', 'casual'],
            models: ['gpt-4', 'gpt-4-turbo']
        },
        'premium_annual': {
            translationsPerMonth: 10000,
            modes: ['professional', 'personal', 'casual'],
            models: ['gpt-4', 'gpt-4-turbo']
        }
    } as const;

    // Use the parameter to return specific features
    if (revenueCatProductId && features[revenueCatProductId as keyof typeof features]) {
        return features[revenueCatProductId as keyof typeof features];
    }
    
    // Return default features if no valid product ID
    return features.default;
};

export const getSubscriptionPrice = (revenueCatProductId?: string): number => {
    const prices = {
        'standard_monthly': 9.99,
        'standard_annual': 99.99,
        'premium_monthly': 19.99,
        'premium_annual': 199.99
    } as const;
    
    // Fix: Use type assertion to tell TypeScript this is a valid key
    if (revenueCatProductId && prices[revenueCatProductId as keyof typeof prices]) {
        return prices[revenueCatProductId as keyof typeof prices];
    }
    return 0;
}
*/


