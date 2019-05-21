package user

import (
	"github.com/gin-gonic/gin"
	"github.com/wrannaman/edge-management/api/postgres"
	"github.com/wrannaman/edge-management/api/postgres/models"
)

// GetUser me
func GetUser(c *gin.Context) {
	userID := c.GetInt64("userID")

	var users []models.User
	userSelect := &models.User{ID: userID}

	_ = postgres.Connection.Model(&users).Select(userSelect)

	c.JSON(200, gin.H{
		"user": userSelect,
	})

}
