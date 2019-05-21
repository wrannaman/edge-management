package redis

import (
	"log"
	"strconv"
	"time"

	"github.com/go-redis/redis"
	"github.com/wrannaman/edge-management/api/configs"
)

// RedisClient ...
var RedisClient redis.Client

// Initialize ...
func Initialize() {
	RedisClient := redis.NewClient(&redis.Options{
		Addr:     configs.Configs.RedisConfig.Host + ":" + strconv.Itoa(configs.Configs.RedisConfig.Port),
		Password: configs.Configs.RedisConfig.Password,
		DB:       0,
	})

	_, err := RedisClient.Ping().Result()
	if err != nil {
		panic(err)
	}
	log.Println("Redis    OKAY")
}

// Get ...
func Get(key string) string {
	val, err := RedisClient.Get(key).Result()
	if err != nil && err != redis.Nil {
		panic(err)
	}
	return val
}

// Set ...
func Set(key string, value string) {
	err := RedisClient.Set(key, value, 0).Err()
	if err != nil {
		panic(err)
	}
}

// SetTLS ...
func SetTLS(key string, value string, expires int) {
	_, err := RedisClient.SetNX(key, value, time.Duration(expires)*time.Second).Result()
	if err != nil {
		panic(err)
	}
}
