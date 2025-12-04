package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/nawodahansani/pos-backend/config"
	"github.com/nawodahansani/pos-backend/controller"
	"github.com/nawodahansani/pos-backend/repository/impl"
	"github.com/nawodahansani/pos-backend/service"
	"github.com/nawodahansani/pos-backend/middleware"
)

func main() {
	config.LoadEnv()
	if err := config.ConnectDB(); err != nil {
		log.Fatalf("failed to connect db: %v", err)
	}
	
	db := config.DB

	// Auto migrate all models
	if err := config.ResetAndMigrateDB(db); err != nil {
    	log.Fatalf("Migration error: %v", err)
	}

	// repositories/impl
	//prodRepo := repository.NewProductRepo(db)
	prodRepo := impl.NewProductRepoImpl(db)
	custRepo := impl.NewCustomerRepoImpl(db)
	orderRepo := impl.NewOrderRepoImpl(db)
	userRepo := impl.NewUserRepository(db)

	// services
	jwtService := service.NewJWTService() // Add JWT service
	authService := service.NewAuthService(userRepo, jwtService) // Add auth service
	prodSvc := service.NewProductService(db, prodRepo)
	custSvc := service.NewCustomerService(db, custRepo)
	orderSvc := service.NewOrderService(db, orderRepo, prodRepo, custRepo)

	// controllers
	authCtrl := controller.NewAuthController(authService) // Add auth controller
	prodCtrl := controller.NewProductController(prodSvc)
	custCtrl := controller.NewCustomerController(custSvc)
	orderCtrl := controller.NewOrderController(orderSvc)

	r := gin.Default()

	// enable CORS (dev)
	//r.Use(cors.Default())
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
    	AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
    	AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
    	AllowCredentials: true,
    	ExposeHeaders:    []string{"Content-Length"},
	}))

	api := r.Group("/api")

	// Public routes (no auth required)
	api.POST("/register", authCtrl.Register)
	api.POST("/login", authCtrl.Login)
	
	// Protected routes (require authentication)
	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware(jwtService))
	{
		// Auth routes
		protected.GET("/profile", authCtrl.GetProfile)

		// Product routes
		protected.GET("/products", prodCtrl.List)
		protected.GET("/products/:id", prodCtrl.GetByID)
		protected.POST("/products", prodCtrl.CreateProduct)
		protected.PUT("/products/:id", prodCtrl.UpdateProduct)
		protected.DELETE("/products/:id", prodCtrl.DeleteProduct)

		// Customer routes
		protected.GET("/customers", custCtrl.List)
		protected.GET("/customers/:id", custCtrl.GetByID)
		protected.POST("/customers", custCtrl.Create)
		protected.PUT("/customers/:id", custCtrl.Update)
		protected.DELETE("/customers/:id", custCtrl.Delete)

		// Order routes
		protected.GET("/orders", orderCtrl.ListOrders)
		protected.GET("/orders/:id", orderCtrl.GetOrder)
		protected.POST("/orders", orderCtrl.CreateOrder)
	}

	// Health check route
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "success",
			"message": "POS System API is running",
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("Server run on :" + port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

