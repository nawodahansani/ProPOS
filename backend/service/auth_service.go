package service

import (
	"errors"
	"github.com/nawodahansani/pos-backend/dto"
	"github.com/nawodahansani/pos-backend/model"
	"github.com/nawodahansani/pos-backend/repository"

	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	Register(userDto dto.RegisterRequest) (model.UserResponse, error)
	Login(loginDto dto.LoginRequest) (model.UserResponse, error)
	GetUserByID(id uint) (model.UserResponse, error)
}

type authService struct {
	userRepo repository.UserRepository
	jwtService JWTService
}

func NewAuthService(userRepo repository.UserRepository, jwtService JWTService) AuthService {
	return &authService{
		userRepo:   userRepo,
		jwtService: jwtService,
	}
}

func (s *authService) Register(userDto dto.RegisterRequest) (model.UserResponse, error) {
	// Check if user already exists
	existingUser, err := s.userRepo.FindByEmail(userDto.Email)
	if err == nil && existingUser.ID != 0 {
		return model.UserResponse{}, errors.New("user already exists with this email")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(userDto.Password), bcrypt.DefaultCost)
	if err != nil {
		return model.UserResponse{}, err
	}

	// Create user
	user := model.User{
		FirstName: userDto.FirstName,
		LastName:  userDto.LastName,
		Email:     userDto.Email,
		Password:  string(hashedPassword),
		Role:      "user",
	}

	createdUser, err := s.userRepo.Create(user)
	if err != nil {
		return model.UserResponse{}, err
	}

	// Generate JWT token
	token, err := s.jwtService.GenerateToken(createdUser.ID, createdUser.Email, createdUser.Role)
	if err != nil {
		return model.UserResponse{}, err
	}

	// Prepare response
	response := model.UserResponse{
		ID:        createdUser.ID,
		FirstName: createdUser.FirstName,
		LastName:  createdUser.LastName,
		Email:     createdUser.Email,
		Role:      createdUser.Role,
		CreatedAt: createdUser.CreatedAt,
		Token:     token,
	}

	return response, nil
}

func (s *authService) Login(loginDto dto.LoginRequest) (model.UserResponse, error) {
	// Find user by email
	user, err := s.userRepo.FindByEmail(loginDto.Email)
	if err != nil || user.ID == 0 {
		return model.UserResponse{}, errors.New("invalid credentials")
	}

	// Verify password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginDto.Password))
	if err != nil {
		return model.UserResponse{}, errors.New("invalid credentials")
	}

	// Generate JWT token
	token, err := s.jwtService.GenerateToken(user.ID, user.Email, user.Role)
	if err != nil {
		return model.UserResponse{}, err
	}

	// Prepare response
	response := model.UserResponse{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Email:     user.Email,
		Role:      user.Role,
		CreatedAt: user.CreatedAt,
		Token:     token,
	}

	return response, nil
}

func (s *authService) GetUserByID(id uint) (model.UserResponse, error) {
	user, err := s.userRepo.FindByID(id)
	if err != nil {
		return model.UserResponse{}, err
	}

	response := model.UserResponse{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Email:     user.Email,
		Role:      user.Role,
		CreatedAt: user.CreatedAt,
	}

	return response, nil
}