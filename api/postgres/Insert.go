package postgres

import (
	"strconv"

	"github.com/go-pg/pg"
	"github.com/wrannaman/edge-management/api/configs"
)

// Insert ...
func Insert(model interface{}) error {
	Connection := pg.Connect(&pg.Options{
		User:     configs.Configs.PostgresConfig.Username,
		Password: configs.Configs.PostgresConfig.Password,
		Addr:     configs.Configs.PostgresConfig.Host + ":" + strconv.Itoa(configs.Configs.PostgresConfig.Port),
		Database: configs.Configs.PostgresConfig.Database,
	})
	defer Connection.Close()

	err := Connection.Insert(model)
	if err != nil && err != pg.ErrNoRows {
		panic(err)
	}
	return err
}
