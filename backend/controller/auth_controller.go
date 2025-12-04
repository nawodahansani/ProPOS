package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nawodahansani/pos-backend/dto"
	"github.com/nawodahansani/pos-backend/service"
)

type AuthController struct {
	authService service.AuthService
}

func NewAuthController(authService service.AuthService) *AuthController {
	return &AuthController{authService: authService}
}

// Register handles user registration
func (c *AuthController) Register(ctx *gin.Context) {
	var req dto.RegisterRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, dto.AuthResponse{
			Status:  "error",
			Message: "Invalid request data",
			Data:    err.Error(),
		})
		return
	}

	user, err := c.authService.Register(req)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, dto.AuthResponse{
			Status:  "error",
			Message: err.Error(),
			Data:    nil,
		})
		return
	}

	ctx.JSON(http.StatusCreated, dto.AuthResponse{
		Status:  "success",
		Message: "User registered successfully",
		Data:    dto.LoginResponse{User: user, Token: user.Token},
	})
}

// Login handles user authentication
func (c *AuthController) Login(ctx *gin.Context) {
	var req dto.LoginRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, dto.AuthResponse{
			Status:  "error",
			Message: "Invalid request data",
			Data:    err.Error(),
		})
		return
	}

	user, err := c.authService.Login(req)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, dto.AuthResponse{
			Status:  "error",
			Message: err.Error(),
			Data:    nil,
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.AuthResponse{
		Status:  "success",
		Message: "Login successful",
		Data:    dto.LoginResponse{User: user, Token: user.Token},
	})
}

// GetProfile returns current user profile
func (c *AuthController) GetProfile(ctx *gin.Context) {
	userID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, dto.AuthResponse{
			Status:  "error",
			Message: "Unauthorized",
			Data:    nil,
		})
		return
	}

	user, err := c.authService.GetUserByID(userID.(uint))
	if err != nil {
		ctx.JSON(http.StatusNotFound, dto.AuthResponse{
			Status:  "error",
			Message: "User not found",
			Data:    nil,
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.AuthResponse{
		Status:  "success",
		Message: "Profile retrieved successfully",
		Data:    user,
	})
}