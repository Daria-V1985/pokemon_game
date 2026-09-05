import { Shop } from "@/types/shop";

export const mockShopItems: Shop[] = [
  {
    id: 1,
    title: 'Оран-ягода',
    text: 'Восстанавливает немного здоровья вашему покемону.',
    image: 'http://localhost:8080/image/small-fruit-1.png',
    buy: 100,
    type: 'berry'
  },
  {
    id: 2,
    title: 'Ультрабол',
    text: 'Высокоэффективный покебол с повышенным шансом поимки.',
    image: 'http://localhost:8080/image/egg-1.png',
    buy: 500,
    type: 'pokeball'
  },
  {
    id: 3,
    title: 'Мастербол',
    text: 'Лучший покебол. Позволяет поймать любого покемона со 100% шансом.',
    image: 'http://localhost:8080/image/egg-2.png',
    buy: 5000,
    type: 'pokeball'
  }
];