package device

import (
	"github.com/gin-gonic/gin"
	"github.com/wrannaman/edge-management/api/postgres"
	"github.com/wrannaman/edge-management/api/postgres/models"
)

// GetDevices me
func GetDevices(c *gin.Context) {
	// userID := c.GetInt64("userID")
	// var device models.Device
	// err := c.BindJSON(&device)
	// edgeutils.CheckError(err)

	var devices []models.Device
	var filter models.DeviceFilter
	filter.Pager.NewPager(FromURLValues(c.Request.URL.Query()))

	// r := c.Copy().Request
	// filter = urlvalues.NewPager(r.URL.Query())

	// devices := &models.Device{ID: userID}

	// _ = postgres.Connection.Model(&devices).Apply(filter.Filter).Select()
	_ = postgres.Connection.Model(&devices).Select()

	c.JSON(200, gin.H{
		"devices": devices,
	})

}
