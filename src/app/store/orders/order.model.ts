import { Game } from "../game.model";

export interface Order {
  id: string;
  addressLine1: string;
  addressLine2: string;
  postCode: string;
  city: string;
  country: string;
  items: OrderItem[];
  totalPrice: number;
  userId: string;
}

export interface OrderItem {
  gameId: string;
  quantity: number;
  subTotalPrice: number;
}

export interface OrderDetails extends Order {
  items: OrderItemDetails[];
}

export interface OrderItemDetails extends OrderItem {
  gameDetails: Game;
}
