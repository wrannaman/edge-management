package models

import (
	"fmt"

	"github.com/go-pg/pg/orm"
	"github.com/go-pg/pg/urlvalues"
)

// Filter godoc
func (f *DeviceFilter) Filter(q *orm.Query) (*orm.Query, error) {
	if f.ID > 0 {
		q = q.Where("b.ID = ?", f.ID)
	}

	f.Pager.MaxLimit = 100     // default max limit is 1000
	f.Pager.MaxOffset = 100000 // default max offset is 1000000

	// f.Pager.GetPage() == 2
	// f.Pager.GetLimit() == 50
	// f.Pager.GetOffset() == 50

	q = q.Apply(f.Pager.Pagination)

	return q, nil
}

// DeviceFilter godoc
type DeviceFilter struct {
	urlvalues.Pager
	ID   int64  `sql:",pk" json:"ID" form:"ID"`
	Name string `json:"name" form:"name"`
	Apps []App  `sql:",notnull" json:"apps" form:"apps"`
	UUID string `json:"uuid" form:"uuid"`
}

// Device godoc
type Device struct {
	ID   int64  `sql:",pk" json:"ID" form:"ID"`
	Name string `json:"name" form:"name"`
	Apps []App  `sql:",notnull" json:"apps" form:"apps"`
	UUID string `json:"uuid" form:"uuid"`
}

func (u Device) String() string {
	return fmt.Sprintf("Device<ID %d Name %s Apps %v UUID %s >", u.ID, u.Name, u.Apps, u.UUID)
}
