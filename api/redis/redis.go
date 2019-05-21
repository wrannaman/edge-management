package redis

import (
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/go-redis/redis"
	"github.com/wrannaman/edge-management/api/configs"
)

// RedisClient ...
var RedisClient *redis.Client

// Initialize ...
func Initialize() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     configs.Configs.RedisConfig.Host + ":" + strconv.Itoa(configs.Configs.RedisConfig.Port),
		Password: configs.Configs.RedisConfig.Password,
		DB:       0,
	})
	_, err := RedisClient.Ping().Result()
	if err != nil {
		panic(err)
	}
	log.Println("Redis    OKAY")
	fmt.Printf("RedisClient %v\n", RedisClient)

}

// Get ...
func Get(key string) (string, error) {
	val, err := RedisClient.Get("@sugar-edge-" + key).Result()
	if err != nil && err != redis.Nil {
		panic(err)
	}
	return val, err
}

// Set ...
func Set(key string, value string) {
	fmt.Printf("SET RedisClient %v\n", RedisClient)
	err := RedisClient.Set("@sugar-edge-"+key, value, 0).Err()
	if err != nil {
		panic(err)
	}
}

// SetTTL ...
func SetTTL(key string, value string, expires int) {
	_, err := RedisClient.SetNX("@sugar-edge-"+key, value, time.Duration(expires)*time.Second).Result()
	if err != nil {
		panic(err)
	}
}
