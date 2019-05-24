package models

import "fmt"

// User ..
type User struct {
	ID    int64  `sql:",pk" json:"ID" form:"ID"`
	Name  string `json:"name" form:"name"`
	Email string `sql:",notnull,unique" json:"email" form:"email"`
	Role  string `sql:",notnull" json:"role" form:"Role"`
}

func (u User) String() string {
	return fmt.Sprintf("User<%d %s %v %v>", u.ID, u.Name, u.Email, u.Role)
}
