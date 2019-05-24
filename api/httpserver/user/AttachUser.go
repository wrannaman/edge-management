package user

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis"
	"github.com/wrannaman/edge-management/api/configs"
	"github.com/wrannaman/edge-management/api/edgeutils"
	"github.com/wrannaman/edge-management/api/postgres"
	"github.com/wrannaman/edge-management/api/postgres/models"
	"github.com/wrannaman/edge-management/api/redisclient"
)

// AuthTokenUser demo
type AuthTokenUser struct {
	Email         string
	EmailVerified string
	Expires       string
}

// AttachUser godoc
func AttachUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		r := c.Copy().Request
		authArray := r.Header["Authorization"]
		auth := ""

		if len(authArray) == 0 {
			c.Next()
		} else {
			auth = strings.TrimSpace(strings.Replace(authArray[0], "Bearer ", "", -1))
			jwt.TimeFunc = func() time.Time {
				return time.Now().Add(time.Duration(60) * time.Second)
			}
			token, err := jwt.Parse(auth, func(token *jwt.Token) (interface{}, error) {
				// Don't forget to validate the alg is what you expect:
				if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
					return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
				}
				// Unpack key from PEM encoded PKCS8
				return jwt.ParseRSAPublicKeyFromPEM(configs.Configs.Pem)
			})
			edgeutils.CheckError(err)

			// var authUser AuthTokenUser
			claims := token.Claims.(jwt.MapClaims)

			// Select user by Email
			email := fmt.Sprintf("%v", claims["email"])

			// Redis key
			key := "user-" + email
			userSelect := &models.User{Email: email}

			redisRawValue, err := redisclient.Get(key)

			if err != nil && err != redis.Nil {
				edgeutils.CheckError(err)
			} else if len(redisRawValue) > 0 {
				b := []byte(redisRawValue)
				err = json.Unmarshal(b, userSelect)
				edgeutils.CheckError(err)
			}

			// if we already have a user, set the
			if userSelect.ID == 0 {
				_ = postgres.Connection.Select(models.User{Email: userSelect.Email})

				if userSelect.ID == 0 {
					userSelect.Role = "admin"
					_ = postgres.Insert(userSelect)
				}

				// set user in redis
				b, _ := json.Marshal(&userSelect)
				redisclient.Set(key, string(b))
			}

			c.Set("userID", userSelect.ID)
			c.Set("userEmail", userSelect.Email)

			// before request
			c.Next()

			// // after request
			// latency := time.Since(t)
			// log.Print(latency)
			//
			// // access the status we are sending
			// status := c.Writer.Status()
			// log.Println(status)
		}
	}
}
