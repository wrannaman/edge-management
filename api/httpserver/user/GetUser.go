package user

import (
	"github.com/gin-gonic/gin"
	"github.com/wrannaman/edge-management/api/postgres"
	"github.com/wrannaman/edge-management/api/postgres/models"
)

// GetUser godoc
// @Summary Get currently logged in user
// @Description auth token parsed to get user
// @Accept  json
// @Produce  json
// @Success 200 {object} model.User
// @Header 200 {string} Authorization "Bearer ...qwerty"
// @Failure 400 {object} httputil.HTTPError
// @Failure 404 {object} httputil.HTTPError
// @Failure 500 {object} httputil.HTTPError
// @Router /user [get]
func GetUser(c *gin.Context) {
	userID := c.GetInt64("userID")

	var users []models.User
	userSelect := &models.User{ID: userID}

	_ = postgres.Connection.Model(&users).Select(userSelect)

	c.JSON(200, gin.H{
		"user": userSelect,
	})

}
