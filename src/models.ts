export interface Restaurant {
    id: string;
    name: string;
    url: string;
    cuisines: string[];
    location: {
        address: string;
        coordinates: [number, number]
    };
    neighborhoods: string[];
    dinner: RestaurantMenu | null;
    lunch: RestaurantMenu | null;
    brunch: RestaurantMenu | null;
}

export interface RestaurantMenu {
    price: number;
    courses: RestaurantCourse[];
    note: string | null;
}

export interface RestaurantCourse {
    name: string;
    choices: RestaurantChoice[]
}

export interface RestaurantChoice {
    name: string;
    description: string;
}