package models

import (
	"fmt"
)

// App ..
type App struct {
	ID     int64  `sql:",pk" json:"ID" form:"ID"`
	Name   string `json:"name" form:"name"`
	Config string `sql:",notnull" json:"config" form:"config"`
}

func (u App) String() string {
	return fmt.Sprintf("App<%d %s %v >", u.ID, u.Name, u.Config)
}
