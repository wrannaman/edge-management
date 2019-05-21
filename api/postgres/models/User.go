package models

import "fmt"

// User ..
type User struct {
	ID    int64  `sql:",pk"`
	Name  string ``
	Email string `sql:"notnull,unique"`
}

func (u User) String() string {
	return fmt.Sprintf("User<%d %s %v>", u.ID, u.Name, u.Email)
}
