package service

import (
	"github.com/nawodahansani/pos-backend/dto"
	"github.com/nawodahansani/pos-backend/model"
	"github.com/nawodahansani/pos-backend/repository"
	"gorm.io/gorm"
)

type CustomerService interface {
	CreateCustomer(input dto.CreateCustomerDTO) (*model.Customer, error)
	GetByID(id uint) (*model.Customer, error)
	List() ([]model.Customer, error)
	UpdateCustomer(id uint, input dto.CreateCustomerDTO) (*model.Customer, error)
	DeleteCustomer(id uint) error
}

type customerServiceImpl struct {
	db       *gorm.DB
	custRepo repository.CustomerRepository
}

func NewCustomerService(db *gorm.DB, cr repository.CustomerRepository) CustomerService {
	return &customerServiceImpl{db: db, custRepo: cr}
}

func (s *customerServiceImpl) CreateCustomer(input dto.CreateCustomerDTO) (*model.Customer, error) {
	c := model.Customer{
		Name:  input.Name,
		Email: input.Email,
		Phone: input.Phone,
	}
	if err := s.custRepo.Create(&c); err != nil {
		return nil, err
	}
	return &c, nil
}

func (s *customerServiceImpl) GetByID(id uint) (*model.Customer, error) {
	return s.custRepo.GetByID(id)
}

func (s *customerServiceImpl) List() ([]model.Customer, error) {
	return s.custRepo.List()
}

func (s *customerServiceImpl) UpdateCustomer(id uint, input dto.CreateCustomerDTO) (*model.Customer, error) {
	// Get existing customer first
	customer, err := s.custRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Update fields
	customer.Name = input.Name
	customer.Email = input.Email
	customer.Phone = input.Phone

	if err := s.custRepo.Update(customer); err != nil {
		return nil, err
	}

	return customer, nil
}

func (s *customerServiceImpl) DeleteCustomer(id uint) error {
	return s.custRepo.Delete(id)
}
