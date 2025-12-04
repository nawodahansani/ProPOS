package impl

import (
	"github.com/nawodahansani/pos-backend/model"
	"github.com/nawodahansani/pos-backend/repository"
	"gorm.io/gorm"
)

type customerRepoImpl struct {
	db *gorm.DB
}

func NewCustomerRepoImpl(db *gorm.DB) repository.CustomerRepository {
	return &customerRepoImpl{db: db}
}

func (r *customerRepoImpl) GetByID(id uint) (*model.Customer, error) {
	var c model.Customer
	if err := r.db.First(&c, id).Error; err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *customerRepoImpl) Create(c *model.Customer) error {
	return r.db.Create(c).Error
}

func (r *customerRepoImpl) List() ([]model.Customer, error) {
	var list []model.Customer
	if err := r.db.Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *customerRepoImpl) Update(c *model.Customer) error {
	// Save updates to customer
	return r.db.Save(c).Error
}

func (r *customerRepoImpl) Delete(id uint) error {
	// Delete customer by ID
	return r.db.Delete(&model.Customer{}, id).Error
}


