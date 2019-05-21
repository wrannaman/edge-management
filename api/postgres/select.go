package postgres

import (
	"fmt"

	"github.com/go-pg/pg"
)

// Select ...
func Select(model interface{}) error {
	fmt.Printf("Insert %v\n", Connection)

	// Connection := pg.Connect(&pg.Options{
	// 	User:     configs.Configs.PostgresConfig.Username,
	// 	Password: configs.Configs.PostgresConfig.Password,
	// 	Addr:     configs.Configs.PostgresConfig.Host + ":" + strconv.Itoa(configs.Configs.PostgresConfig.Port),
	// 	Database: configs.Configs.PostgresConfig.Database,
	// })
	// defer Connection.Close()

	err := Connection.Select(model)
	if err != nil && err != pg.ErrNoRows {
		panic(err)
	}
	return err
}
