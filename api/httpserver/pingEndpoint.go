package httpserver

import "github.com/gin-gonic/gin"

// PingEndpoint
func PingEndpoint(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "pong",
	})
}
