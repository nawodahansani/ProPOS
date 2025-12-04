package service

import (
	"github.com/nawodahansani/pos-backend/dto"
	"github.com/nawodahansani/pos-backend/model"
	"github.com/nawodahansani/pos-backend/repository"
	"gorm.io/gorm"
)

type ProductService interface {
	CreateProduct(input dto.CreateProductDTO) (*model.Product, error)
	List() ([]model.Product, error)
	GetByID(id uint) (*model.Product, error)
	UpdateProduct(id uint, input dto.CreateProductDTO) (*model.Product, error)  // added
	DeleteProduct(id uint) error  
}

type productServiceImpl struct {
	db       *gorm.DB
	prodRepo repository.ProductRepository
}

func NewProductService(db *gorm.DB, pr repository.ProductRepository) ProductService {
	return &productServiceImpl{db: db, prodRepo: pr}
}

func (s *productServiceImpl) CreateProduct(input dto.CreateProductDTO) (*model.Product, error) {
	p := model.Product{
		Name:  input.Name,
		Price: input.Price,
		Stock: input.Stock,
	}
	if err := s.prodRepo.Create(&p); err != nil {
		return nil, err
	}
	return &p, nil
}

func (s *productServiceImpl) List() ([]model.Product, error) {
	return s.prodRepo.List()
}

func (s *productServiceImpl) GetByID(id uint) (*model.Product, error) {
	return s.prodRepo.GetByID(id)
}

func (s *productServiceImpl) UpdateProduct(id uint, input dto.CreateProductDTO) (*model.Product, error) {
	product, err := s.prodRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	product.Name = input.Name
	product.Price = input.Price
	product.Stock = input.Stock

	if err := s.prodRepo.Update(product); err != nil {
		return nil, err
	}

	return product, nil
}

func (s *productServiceImpl) DeleteProduct(id uint) error {
	return s.prodRepo.Delete(id)
}
