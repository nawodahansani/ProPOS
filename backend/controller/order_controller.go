package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/nawodahansani/pos-backend/dto"
	"github.com/nawodahansani/pos-backend/service"
)

type OrderController struct {
	svc service.OrderService
}

func NewOrderController(s service.OrderService) *OrderController {
	return &OrderController{svc: s}
}

// func (c *OrderController) RegisterRoutes(rg *gin.RouterGroup) {
// 	rg.POST("", c.CreateOrder)
// 	rg.GET("/:id", c.GetOrder)
// 	rg.GET("", c.ListOrders)
// }

func (c *OrderController) CreateOrder(ctx *gin.Context) {
	var input dto.CreateOrderDTO
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, dto.ResponseDTO{"error", "invalid input", err.Error()})
		return
	}
	o, err := c.svc.CreateOrder(input)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, dto.ResponseDTO{"error", "create order failed", err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, dto.ResponseDTO{"success", "order created", o})
}

func (c *OrderController) GetOrder(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, _ := strconv.Atoi(idStr)
	o, err := c.svc.GetOrder(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, dto.ResponseDTO{"error", "not found", err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, dto.ResponseDTO{"success", "ok", o})
}

func (c *OrderController) ListOrders(ctx *gin.Context) {
	list, err := c.svc.ListOrders()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.ResponseDTO{"error", "list failed", err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, dto.ResponseDTO{"success", "ok", list})
}
