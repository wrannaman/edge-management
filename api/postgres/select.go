package postgres

import (
	"github.com/go-pg/pg"
)

// Select ...
func Select(model interface{}) error {
	err := Connection.Select(model)
	if err != nil && err != pg.ErrNoRows {
		panic(err)
	}
	return err
}
