package dto

type OrderItemDTO struct {
	ProductID uint `json:"product_id" binding:"required"`
	Quantity  int  `json:"quantity" binding:"required"`
}

type CreateOrderDTO struct {
	CustomerID uint           `json:"customer_id" binding:"required"`
	Items      []OrderItemDTO `json:"items" binding:"required"`
}
