package impl

import (
	"errors"

	"github.com/nawodahansani/pos-backend/model"
	"github.com/nawodahansani/pos-backend/repository"
	"gorm.io/gorm"
)

type productRepoImpl struct {
	db *gorm.DB
}

func NewProductRepoImpl(db *gorm.DB) repository.ProductRepository {
	return &productRepoImpl{db: db}
}

func (r *productRepoImpl) GetByID(id uint) (*model.Product, error) {
	var p model.Product
	if err := r.db.First(&p, id).Error; err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *productRepoImpl) Create(p *model.Product) error {
	return r.db.Create(p).Error
}

func (r *productRepoImpl) Update(p *model.Product) error {
	return r.db.Save(p).Error
}

func (r *productRepoImpl) List() ([]model.Product, error) {
	var products []model.Product
	if err := r.db.Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (r *productRepoImpl) ReduceStock(productID uint, qty int) error {
	res := r.db.Model(&model.Product{}).
		Where("id = ? AND stock >= ?", productID, qty).
		Update("stock", gorm.Expr("stock - ?", qty))
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return errors.New("insufficient stock")
	}
	return nil
}

func (r *productRepoImpl) Delete(id uint) error {
	return r.db.Delete(&model.Product{}, id).Error
}
