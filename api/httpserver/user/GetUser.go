package user

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/wrannaman/edge-management/api/postgres/models"
)

// GetUserQuery ..
type GetUserQuery struct {
	Topic   string `form:"topic"`
	Message string `form:"message"`
}

// GetUser me
func GetUser(c *gin.Context) {
	var params GetUserQuery
	var user models.User
	if c.ShouldBindQuery(&params) == nil {
		// log.Println("topic", params.Topic, "message", params.Message)
		// mqttserver.Publish(params.Topic, params.Message)
		midUser, _ := c.Get("user")
		fmt.Printf("midUser %v\n", midUser)
	}
	c.JSON(200, gin.H{
		"user": user,
	})
}
