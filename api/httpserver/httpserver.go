package httpserver

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/wrannaman/edge-management/api/httpserver/user"
)

// Access Control Helper function.
func shouldAccess(wantedGroups []string, groups []interface{}) bool {
	/* Fill depending on your needs */
	return true
}

// StartServer me!
func StartServer() {
	// gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	r.Use(gin.Recovery())

	// cors
	r.Use(cors.New(cors.Config{
		// AllowOrigins:     []string{"https://foo.com"},
		AllowAllOrigins:  true,
		AllowMethods:     []string{"PUT", "PATCH", "OPTIONS", "GET", "POST"},
		AllowHeaders:     []string{"Origin", "authorization", "Authorization", "Content-Type", "content-type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		// AllowOriginFunc: func(origin string) bool {
		// 	return origin == "https://github.com"
		// },
		MaxAge: 12 * time.Hour,
	}))

	r.Use(user.AttachUser())

	// Unauthorized
	r.GET("/ping", PingEndpoint)
	r.GET("/v1/user", user.GetUser)

	// Authorized
	// authorized := r.Group("/")
	// authorized.Use(gin.BasicAuth(gin.Accounts{
	// 	"admin":  "password",
	// 	"austin": "1234",
	// 	"lena":   "hello2",
	// 	"manu":   "4321",
	// }))
	// {
	// 	authorized.GET("/login", PingEndpoint)
	// 	authorized.GET("/send", SendEndpoint)
	// 	// authorized.POST("/submit", submitEndpoint)
	// 	// authorized.POST("/read", readEndpoint)
	// 	//
	// 	// // nested group
	// 	// testing := authorized.Group("testing")
	// 	// testing.GET("/analytics", analyticsEndpoint)
	// }
	//r.Run() // listen and serve on 0.0.0.0:8080
	r.Run(":8080")
}
