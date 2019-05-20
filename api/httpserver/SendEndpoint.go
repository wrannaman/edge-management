package httpserver

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/wrannaman/edge-management/api/mqttserver"
)

// SendEndpointQuery ...
type SendEndpointQuery struct {
	Topic   string `form:"topic"`
	Message string `form:"message"`
}

// SendEndpoint me
func SendEndpoint(c *gin.Context) {
	var params SendEndpointQuery
	if c.ShouldBindQuery(&params) == nil {
		log.Println("topic", params.Topic, "message", params.Message)
		mqttserver.Publish(params.Topic, params.Message)
	}
	c.JSON(200, gin.H{
		"message": "sent",
	})
}
