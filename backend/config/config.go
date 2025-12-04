package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"github.com/nawodahansani/pos-backend/model"
)

var DB *gorm.DB

func LoadEnv() {
	_ = godotenv.Load()
}

func ConnectDB() error {
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "5432")
	user := getEnv("DB_USER", "postgres")
	pass := getEnv("DB_PASSWORD", "nawoda@2002")
	name := getEnv("DB_NAME", "posdb")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host, user, pass, name, port)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}
	DB = db
	return nil
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func ResetAndMigrateDB(db *gorm.DB) error {
	// Drop tables in correct order (due to foreign keys)
	db.Exec("DROP TABLE IF EXISTS order_items CASCADE")
	db.Exec("DROP TABLE IF EXISTS orders CASCADE")
	db.Exec("DROP TABLE IF EXISTS customers CASCADE")
	db.Exec("DROP TABLE IF EXISTS products CASCADE")
	db.Exec("DROP TABLE IF EXISTS users CASCADE")
	
	// Now migrate fresh
	return MigrateDB(db)
}

// Add this new function for migrations
func MigrateDB(db *gorm.DB) error {
	// Disable constraint checks temporarily
	db.Exec("SET CONSTRAINTS ALL DEFERRED")

	// Import all your models here
	err := db.AutoMigrate(
		&model.User{},
		&model.Customer{}, 
		&model.Product{}, 
		&model.Order{}, 
		&model.OrderItem{},
	)
	if err != nil {
		return err
	}
	
	// Re-enable constraints
	db.Exec("SET CONSTRAINTS ALL IMMEDIATE")
	return nil
}