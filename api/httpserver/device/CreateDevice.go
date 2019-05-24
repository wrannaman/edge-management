package device

import (
	"github.com/gin-gonic/gin"
	"github.com/wrannaman/edge-management/api/edgeutils"
	"github.com/wrannaman/edge-management/api/postgres"
	"github.com/wrannaman/edge-management/api/postgres/models"
)

// CreateDevice godoc
// @Summary Get currently logged in user
// @Description auth token parsed to get user
// @Accept  json
// @Produce  json
// @Success 200 {object} model.User
// @Header 200 {string} Authorization "Bearer ...qwerty"
// @Failure 400 {object} httputil.HTTPError
// @Failure 404 {object} httputil.HTTPError
// @Failure 500 {object} httputil.HTTPError
// @Router /device [post]
func CreateDevice(c *gin.Context) {
	var device models.Device
	err := c.BindJSON(&device)
	edgeutils.CheckError(err)
	err = postgres.Connection.Insert(&device)
	edgeutils.CheckError(err)
	c.JSON(200, gin.H{
		"device": device,
	})
}
