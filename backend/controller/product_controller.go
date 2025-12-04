package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nawodahansani/pos-backend/dto"
	"github.com/nawodahansani/pos-backend/service"
	"strconv"
)

type ProductController struct {
	svc service.ProductService
}

func NewProductController(s service.ProductService) *ProductController {
	return &ProductController{svc: s}
}

func (c *ProductController) RegisterRoutes(rg *gin.RouterGroup) {
	rg.POST("", c.CreateProduct)
	rg.GET("", c.List)
	rg.GET("/:id", c.GetByID)
	rg.PUT("/:id", c.UpdateProduct)    
	rg.DELETE("/:id", c.DeleteProduct)
}

func (c *ProductController) CreateProduct(ctx *gin.Context) {
	var input dto.CreateProductDTO
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, dto.ResponseDTO{"error", "invalid input", err.Error()})
		return
	}
	p, err := c.svc.CreateProduct(input)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.ResponseDTO{"error", "create failed", err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, dto.ResponseDTO{"success", "created", p})
}

func (c *ProductController) List(ctx *gin.Context) {
	list, err := c.svc.List()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.ResponseDTO{"error", "list failed", err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, dto.ResponseDTO{"success", "ok", list})
}

func (c *ProductController) GetByID(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, _ := strconv.Atoi(idStr)
	p, err := c.svc.GetByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, dto.ResponseDTO{"error", "not found", err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, dto.ResponseDTO{"success", "ok", p})
}

func (c *ProductController) UpdateProduct(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, dto.ResponseDTO{"error", "invalid id", err.Error()})
		return
	}

	var input dto.CreateProductDTO
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, dto.ResponseDTO{"error", "invalid input", err.Error()})
		return
	}

	updatedProd, err := c.svc.UpdateProduct(uint(id), input)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.ResponseDTO{"error", "update failed", err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, dto.ResponseDTO{"success", "updated", updatedProd})
}

func (c *ProductController) DeleteProduct(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, dto.ResponseDTO{"error", "invalid id", err.Error()})
		return
	}

	if err := c.svc.DeleteProduct(uint(id)); err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.ResponseDTO{"error", "delete failed", err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, dto.ResponseDTO{"success", "deleted", nil})
}