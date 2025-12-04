package repository

import "github.com/nawodahansani/pos-backend/model"

type OrderRepository interface {
	CreateOrder(order *model.Order) error
	GetByID(id uint) (*model.Order, error)
	List() ([]model.Order, error)
}
