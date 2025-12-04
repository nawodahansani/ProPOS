package repository

import "github.com/nawodahansani/pos-backend/model"

type UserRepository interface {
	Create(user model.User) (model.User, error)
	FindByEmail(email string) (model.User, error)
	FindByID(id uint) (model.User, error)
}