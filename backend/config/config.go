package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
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

// package config

// import (
// 	"fmt"
// 	"os"
// 	"sync"

// 	"github.com/joho/godotenv"
// 	"gorm.io/driver/postgres"
// 	"gorm.io/gorm"
// )

// var (
// 	db   *gorm.DB
// 	once sync.Once
// )

// // LoadEnv loads environment variables from .env file
// func LoadEnv() {
// 	_ = godotenv.Load()
// }

// // GetDB returns the singleton DB instance
// func GetDB() *gorm.DB {
// 	once.Do(func() {
// 		db = connectDB()
// 	})
// 	return db
// }

// // connectDB initializes the DB connection
// func connectDB() *gorm.DB {
// 	host := getEnv("DB_HOST", "localhost")
// 	port := getEnv("DB_PORT", "5432")
// 	user := getEnv("DB_USER", "postgres")
// 	pass := getEnv("DB_PASSWORD", "nawoda@2002")
// 	name := getEnv("DB_NAME", "posdb")

// 	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
// 		host, user, pass, name, port)

// 	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
// 	if err != nil {
// 		panic(fmt.Sprintf("Failed to connect to database: %v", err))
// 	}

// 	return database
// }

// // getEnv returns the environment variable or fallback value
// func getEnv(key, fallback string) string {
// 	if v := os.Getenv(key); v != "" {
// 		return v
// 	}
// 	return fallback
// }
