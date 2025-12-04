package service

import (
	"errors"
	"fmt"

	"github.com/nawodahansani/pos-backend/dto"
	"github.com/nawodahansani/pos-backend/model"
	"github.com/nawodahansani/pos-backend/repository"
	impl "github.com/nawodahansani/pos-backend/repository/impl"
	"gorm.io/gorm"
)

type OrderService interface {
	CreateOrder(input dto.CreateOrderDTO) (*model.Order, error)
	GetOrder(id uint) (*model.Order, error)
	ListOrders() ([]model.Order, error)
}

type orderServiceImpl struct {
	db        *gorm.DB
	orderRepo repository.OrderRepository
	prodRepo  repository.ProductRepository
	custRepo  repository.CustomerRepository
	// orderImpl   impl.OrderRepoImpl
	// prodImpl    impl.ProductRepoImpl
	// custImpl    impl.CustomerRepoImpl
}

func NewOrderService(db *gorm.DB, or repository.OrderRepository, pr repository.ProductRepository, cr repository.CustomerRepository) OrderService {
	return &orderServiceImpl{
		db:        db,
		orderRepo: or,
		prodRepo:  pr,
		custRepo:  cr,
	}
}

func (s *orderServiceImpl) CreateOrder(input dto.CreateOrderDTO) (*model.Order, error) {
	// validate customer exists
	if _, err := s.custRepo.GetByID(input.CustomerID); err != nil {
		return nil, fmt.Errorf("customer not found: %w", err)
	}

	var createdOrder *model.Order

	err := s.db.Transaction(func(tx *gorm.DB) error {
		// use repos backed by tx
		//txProdRepo := repository.NewProductRepo(tx)
		//txOrderRepo := repository.NewOrderRepo(tx)
		txProdRepo := impl.NewProductRepoImpl(tx)
		txOrderRepo := impl.NewOrderRepoImpl(tx)


		order := model.Order{
			CustomerID: input.CustomerID,
		}

		total := 0.0
		for _, it := range input.Items {
			p, err := txProdRepo.GetByID(it.ProductID)
			if err != nil {
				return fmt.Errorf("product %d not found: %w", it.ProductID, err)
			}
			if p.Stock < it.Quantity {
				return errors.New("insufficient stock for product")
			}
			if err := txProdRepo.ReduceStock(it.ProductID, it.Quantity); err != nil {
				return err
			}
			line := float64(it.Quantity) * p.Price
			total += line
			order.Items = append(order.Items, model.OrderItem{
				ProductID: it.ProductID,
				Quantity:  it.Quantity,
				Price:     p.Price,
			})
		}

		order.Total = total

		if err := txOrderRepo.CreateOrder(&order); err != nil {
			return err
		}

		createdOrder = &order
		return nil
	})

	if err != nil {
		return nil, err
	}

	return createdOrder, nil
}

func (s *orderServiceImpl) GetOrder(id uint) (*model.Order, error) {
	return s.orderRepo.GetByID(id)
}

func (s *orderServiceImpl) ListOrders() ([]model.Order, error) {
	return s.orderRepo.List()
}

