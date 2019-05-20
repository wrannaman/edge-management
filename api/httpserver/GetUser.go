package httpserver

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/wrannaman/edge-management/api/mqttserver"
)

// GetUserQuery ..
type GetUserQuery struct {
	Topic   string `form:"topic"`
	Message string `form:"message"`
}

// GetUser me
func GetUser(c *gin.Context) {
	var params GetUserQuery
	if c.ShouldBindQuery(&params) == nil {
		log.Println("topic", params.Topic, "message", params.Message)
		mqttserver.Publish(params.Topic, params.Message)
	}
	c.JSON(200, gin.H{
		"message": "sent",
	})
}
