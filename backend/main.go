package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/nawodahansani/pos-backend/config"
	"github.com/nawodahansani/pos-backend/controller"
	"github.com/nawodahansani/pos-backend/model"
	"github.com/nawodahansani/pos-backend/repository/impl"
	"github.com/nawodahansani/pos-backend/service"
)

func main() {
	config.LoadEnv()
	if err := config.ConnectDB(); err != nil {
		log.Fatalf("failed to connect db: %v", err)
	}

	db := config.DB

	// Auto migrate (safe for dev)
	if err := db.AutoMigrate(&model.Customer{}, &model.Product{}, &model.Order{}, &model.OrderItem{}); err != nil {
		log.Fatalf("migrate err: %v", err)
	}

	// repositories/impl
	//prodRepo := repository.NewProductRepo(db)
	prodRepo := impl.NewProductRepoImpl(db)
	custRepo := impl.NewCustomerRepoImpl(db)
	orderRepo := impl.NewOrderRepoImpl(db)

	// services
	prodSvc := service.NewProductService(db, prodRepo)
	custSvc := service.NewCustomerService(db, custRepo)
	orderSvc := service.NewOrderService(db, orderRepo, prodRepo, custRepo)

	// controllers
	prodCtrl := controller.NewProductController(prodSvc)
	custCtrl := controller.NewCustomerController(custSvc)
	orderCtrl := controller.NewOrderController(orderSvc)

	r := gin.Default()

	// enable CORS (dev)
	//r.Use(cors.Default())
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
    	AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    	AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
    	AllowCredentials: true,
    	ExposeHeaders:    []string{"Content-Length"},
	}))

	api := r.Group("/api")
	prodCtrl.RegisterRoutes(api.Group("/products"))
	custCtrl.RegisterRoutes(api.Group("/customers"))
	orderCtrl.RegisterRoutes(api.Group("/orders"))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("Server run on :" + port)
	r.Run(":" + port)
}

