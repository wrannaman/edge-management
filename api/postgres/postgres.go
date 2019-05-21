package postgres

import (
	"fmt"
	"log"
	"strconv"

	"github.com/go-pg/pg"
	"github.com/go-pg/pg/orm"
	"github.com/wrannaman/edge-management/api/configs"
	"github.com/wrannaman/edge-management/api/postgres/models"
)

// Connection ...
var Connection *pg.DB

// type Story struct {
// 	Id       int64
// 	Title    string
// 	AuthorId int64
// 	Author   *User
// }
//
// func (s Story) String() string {
// 	return fmt.Sprintf("Story<%d %s %s>", s.Id, s.Title, s.Author)
// }

// Initialize ...
func Initialize() {
	Connection := pg.Connect(&pg.Options{
		User:     configs.Configs.PostgresConfig.Username,
		Password: configs.Configs.PostgresConfig.Password,
		Addr:     configs.Configs.PostgresConfig.Host + ":" + strconv.Itoa(configs.Configs.PostgresConfig.Port),
		Database: configs.Configs.PostgresConfig.Database,
	})
	// defer Connection.Close()

	err := createSchema(Connection)
	if err != nil {
		panic(err)
	}

	log.Println("Postgres OKAY")
	// user1 := &User{
	// 	Name:  "admin",
	// 	Email: []string{"admin1@admin", "admin2@admin"},
	// }
	// err = Connection.Insert(user1)
	// if err != nil {
	// 	panic(err)
	// }
	//
	// err = Connection.Insert(&User{
	// 	Name:  "root",
	// 	Email: []string{"root1@root", "root2@root"},
	// })
	// if err != nil {
	// 	panic(err)
	// }

	user := &models.User{Email: "andrewpierno@gmail.com"}
	err = Connection.Select(user)

	if err != nil && err != pg.ErrNoRows {
		panic(err)
	}
	fmt.Printf("user %v\n", user)
	fmt.Printf("postgres Connection %v\n", Connection)

	//
	// // Select all users.
	// var users []User
	// err = Connection.Model(&users).Select()
	// if err != nil {
	// 	panic(err)
	// }
	//
	// // Select story and associated author in one query.
	// story := new(Story)
	// err = Connection.Model(story).
	// 	Relation("Author").
	// 	Where("story.id = ?", story1.Id).
	// 	Select()
	// if err != nil {
	// 	panic(err)
	// }
	//
	// fmt.Println(user)
	// fmt.Println(users)
	// fmt.Println(story)
	// Output: User<1 admin [admin1@admin admin2@admin]>
	// [User<1 admin [admin1@admin admin2@admin]> User<2 root [root1@root root2@root]>]
	// Story<1 Cool story User<1 admin [admin1@admin admin2@admin]>>
}

func createSchema(db *pg.DB) error {
	for _, model := range []interface{}{
		(*models.User)(nil),
		//(*Story)(nil)
	} {
		err := db.CreateTable(model, &orm.CreateTableOptions{
			// Temp: true,
			IfNotExists: true,
		})
		if err != nil {
			return err
		}
	}
	return nil
}
