package repository

import "github.com/nawodahansani/pos-backend/model"

type ProductRepository interface {
	GetByID(id uint) (*model.Product, error)
	Create(p *model.Product) error
	Update(p *model.Product) error
	List() ([]model.Product, error)
	ReduceStock(productID uint, qty int) error
	Delete(id uint) error 
}
