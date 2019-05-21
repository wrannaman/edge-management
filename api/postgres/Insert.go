package postgres

import (
	"github.com/go-pg/pg"
)

// Insert ...
func Insert(model interface{}) error {
	err := Connection.Insert(model)
	if err != nil && err != pg.ErrNoRows {
		panic(err)
	}
	return err
}
