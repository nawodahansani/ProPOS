package repository

import "github.com/nawodahansani/pos-backend/model"

type CustomerRepository interface {
	GetByID(id uint) (*model.Customer, error)
	Create(c *model.Customer) error
	List() ([]model.Customer, error)
	Update(c *model.Customer) error       
	Delete(id uint) error  
}
