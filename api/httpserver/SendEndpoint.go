package httpserver

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/wrannaman/edge-management/api/mqttserver"
)

type Query struct {
	Topic   string `form:"topic"`
	Message string `form:"message"`
}

// SendEndpoint
func SendEndpoint(c *gin.Context) {
	var params Query
	if c.ShouldBindQuery(&params) == nil {
		log.Println("topic", params.Topic, "message", params.Message)
		mqttserver.Publish(params.Topic, params.Message)
	}
	c.JSON(200, gin.H{
		"message": "sent",
	})
}
