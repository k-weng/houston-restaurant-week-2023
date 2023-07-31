import { Restaurant } from '@/models';
import { RestaurantTable } from './restaurant-table';

const getRestaurants = async (): Promise<Restaurant[]> => {
  const content = await fetch('https://raw.githubusercontent.com/k-weng/houston-restaurant-week-2023/main/data/restaurants.json');
  return content.json()
}

export default async function Home() {
  const restaurants = await getRestaurants();
  const allCuisines = [...new Set(restaurants.reduce((cuisines, restaurant) => cuisines.concat(restaurant.cuisines), [] as string[]))];
  allCuisines.sort();
  const allNeighborhoods = [...new Set(restaurants.reduce((neighborhoods, restaurant) => neighborhoods.concat(restaurant.neighborhoods), [] as string[]))];
  allNeighborhoods.sort();
  return (
    <div className="container mx-auto py-10">
      <RestaurantTable restaurants={restaurants} cuisines={allCuisines} neighborhoods={allNeighborhoods}/>
    </div>
  );
}
