package httpserver

import (
	"fmt"
	"strings"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/wrannaman/edge-management/api/configs"
)

// User demo
type User struct {
	Email         string
	EmailVerified string
	Expires       string
}

// AttachUser middleware to get user
func AttachUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		authArray := c.Request.Header["Authorization"]
		auth := ""
		if len(authArray) == 0 {
			c.Next()
		} else {
			auth = strings.TrimSpace(strings.Replace(authArray[0], "Bearer ", "", -1))
			token, err := jwt.Parse(auth, func(token *jwt.Token) (interface{}, error) {
				// Don't forget to validate the alg is what you expect:
				if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
					return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
				}
				// Unpack key from PEM encoded PKCS8
				return jwt.ParseRSAPublicKeyFromPEM(configs.Configs.Pem)
			})
			if err != nil {
				fmt.Println("Token is not valid:", token)
				panic(err)
			}

			var user User
			claims := token.Claims.(jwt.MapClaims)

			user.Email = fmt.Sprintf("%v", claims["email"])
			user.EmailVerified = fmt.Sprintf("%v", claims["email_verified"])
			user.Expires = fmt.Sprintf("%v", claims["exp"])
			fmt.Printf("user %v\n", user)

			// Set the user
			c.Set("user", user)

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
