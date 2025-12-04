package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/nawodahansani/pos-backend/dto"
	"github.com/nawodahansani/pos-backend/service"
)

type CustomerController struct {
	svc service.CustomerService
}

func NewCustomerController(s service.CustomerService) *CustomerController {
	return &CustomerController{svc: s}
}

func (c *CustomerController) RegisterRoutes(rg *gin.RouterGroup) {
	rg.POST("", c.Create)
	rg.GET("", c.List)
	rg.GET("/:id", c.GetByID)
	rg.PUT("/:id", c.Update)   
	rg.DELETE("/:id", c.Delete)
}

func (c *CustomerController) Create(ctx *gin.Context) {
	var input dto.CreateCustomerDTO
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, dto.ResponseDTO{"error", "invalid input", err.Error()})
		return
	}
	cust, err := c.svc.CreateCustomer(input)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.ResponseDTO{"error", "create failed", err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, dto.ResponseDTO{"success", "created", cust})
}

func (c *CustomerController) List(ctx *gin.Context) {
	list, err := c.svc.List()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.ResponseDTO{"error", "list failed", err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, dto.ResponseDTO{"success", "ok", list})
}

func (c *CustomerController) GetByID(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, _ := strconv.Atoi(idStr)
	cust, err := c.svc.GetByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, dto.ResponseDTO{"error", "not found", err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, dto.ResponseDTO{"success", "ok", cust})
}

func (c *CustomerController) Update(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, dto.ResponseDTO{"error", "invalid id", err.Error()})
		return
	}

	var input dto.CreateCustomerDTO
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, dto.ResponseDTO{"error", "invalid input", err.Error()})
		return
	}

	updatedCust, err := c.svc.UpdateCustomer(uint(id), input)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.ResponseDTO{"error", "update failed", err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, dto.ResponseDTO{"success", "updated", updatedCust})
}

func (c *CustomerController) Delete(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, dto.ResponseDTO{"error", "invalid id", err.Error()})
		return
	}

	if err := c.svc.DeleteCustomer(uint(id)); err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.ResponseDTO{"error", "delete failed", err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, dto.ResponseDTO{"success", "deleted", nil})
}
