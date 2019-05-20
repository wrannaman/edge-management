package httpserver

import "github.com/gin-gonic/gin"

// StartServer me!
func StartServer() {
	// gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	r.Use(gin.Recovery())

	// Unauthorized
	r.GET("/ping", PingEndpoint)

	// Authorized
	authorized := r.Group("/")
	authorized.Use(gin.BasicAuth(gin.Accounts{
		"admin":  "password",
		"austin": "1234",
		"lena":   "hello2",
		"manu":   "4321",
	}))
	{
		authorized.GET("/login", PingEndpoint)
		authorized.GET("/send", SendEndpoint)
		// authorized.POST("/submit", submitEndpoint)
		// authorized.POST("/read", readEndpoint)
		//
		// // nested group
		// testing := authorized.Group("testing")
		// testing.GET("/analytics", analyticsEndpoint)
	}
	//r.Run() // listen and serve on 0.0.0.0:8080
	r.Run(":8080")
}
