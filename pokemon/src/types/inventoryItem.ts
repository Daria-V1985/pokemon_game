export interface InventoryItem {
  id: number;
  name: string;
  type: 'berry' | 'pokeball';
  image: string;
  price: number;
  slot: number;
}