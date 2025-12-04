package impl

import (
	"github.com/nawodahansani/pos-backend/model"
	"github.com/nawodahansani/pos-backend/repository"
	"gorm.io/gorm"
)

type orderRepoImpl struct {
	db *gorm.DB
}

func NewOrderRepoImpl(db *gorm.DB) repository.OrderRepository {
	return &orderRepoImpl{db: db}
}

func (r *orderRepoImpl) CreateOrder(order *model.Order) error {
	return r.db.Create(order).Error
}

func (r *orderRepoImpl) GetByID(id uint) (*model.Order, error) {
	var o model.Order
	if err := r.db.Preload("Items").First(&o, id).Error; err != nil {
		return nil, err
	}
	return &o, nil
}

func (r *orderRepoImpl) List() ([]model.Order, error) {
	var list []model.Order
	if err := r.db.Preload("Items").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

