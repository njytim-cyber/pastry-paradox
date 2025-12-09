
/**
 * Macaron Types Definition
 * 10 distinct flavors with unique buffs and colors.
 */

export const MACARON_TYPES = [
    {
        id: 'rose',
        name: 'Rose Macaron',
        color: '#FFC0CB', // Pink
        filling: '#FF69B4',
        description: 'Floral Essence! x7 Production for 30s',
        buff: { type: 'production_multiplier', value: 7, duration: 30 }
    },
    {
        id: 'lemon',
        name: 'Lemon Macaron',
        color: '#FFFACD', // LemonChiffon
        filling: '#FFFF00', // Yellow
        description: 'Zesty! x77 Click Power for 30s',
        buff: { type: 'click_multiplier', value: 77, duration: 30 }
    },
    {
        id: 'pistachio',
        name: 'Pistachio Macaron',
        color: '#90EE90', // LightGreen
        filling: '#228B22', // ForestGreen
        description: 'Lucky Nut! Instant 15m of Production',
        buff: { type: 'instant_production', value: 15 * 60 } // seconds
    },
    {
        id: 'blueberry',
        name: 'Blueberry Macaron',
        color: '#ADD8E6', // LightBlue
        filling: '#0000FF', // Blue
        description: 'Berry Blast! Instant 5m Time Warp',
        buff: { type: 'time_warp', value: 5 * 60 }
    },
    {
        id: 'lavender',
        name: 'Lavender Macaron',
        color: '#E6E6FA', // Lavender
        filling: '#8A2BE2', // BlueViolet
        description: 'Calming! x2 Production for 60s',
        buff: { type: 'production_multiplier', value: 2, duration: 60 }
    },
    {
        id: 'salted_caramel',
        name: 'Salted Caramel Macaron',
        color: '#F4A460', // SandyBrown
        filling: '#D2691E', // Chocolate
        description: 'Salty Sweet! 50% Price Discount for 30s',
        buff: { type: 'discount', value: 0.5, duration: 30 }
    },
    {
        id: 'red_velvet',
        name: 'Red Velvet Macaron',
        color: '#DC143C', // Crimson
        filling: '#FFFAFA', // Snow (Cream Cheese)
        description: 'Rich! Instant 30m of Production',
        buff: { type: 'instant_production', value: 30 * 60 }
    },
    {
        id: 'vanilla',
        name: 'Vanilla Macaron',
        color: '#F5F5DC', // Beige
        filling: '#FFFFFF', // White
        description: 'SUGAR RUSH! x777 Production for 7s',
        buff: { type: 'production_multiplier', value: 777, duration: 7 }
    },
    {
        id: 'chocolate',
        name: 'Chocolate Macaron',
        color: '#D2691E', // Chocolate
        filling: '#8B4513', // SaddleBrown
        description: 'Decadent! x77 Global Multiplier for 15s',
        buff: { type: 'global_multiplier', value: 77, duration: 15 }
    },
    {
        id: 'dark_chocolate',
        name: 'Dark Chocolate Macaron',
        color: '#2F4F4F', // DarkSlateGray
        filling: '#000000', // Black
        description: 'Midnight Snack! x2 Global Multiplier for 2m',
        buff: { type: 'global_multiplier', value: 2, duration: 120 }
    }
];

export const getRandomMacaron = () => {
    return MACARON_TYPES[Math.floor(Math.random() * MACARON_TYPES.length)];
};
