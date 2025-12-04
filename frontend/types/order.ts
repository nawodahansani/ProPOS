export interface OrderItem {  //OrderItemDTO
  product_id: number;
  quantity: number;
}

export interface Order {
  id: number;
  customer_id: number;
  items: OrderItem[];
  total: number;
  created_at: string;
}

export interface CreateOrderDTO {
  customer_id: number;
  items: OrderItem[];   //OrderItemDTO[]
}
