package models


import (
	"time"

	"github.com/coopernurse/gorp"
	//"code.google.com/p/go.crypto/bcrypt"
)


// type Rate struct {
// 	Id       	int64	`db:"rate_id"`
//     Created  	int64
//     Updated  	int64

//     Code  		string      // county code e.g. USD
//     Value 		float64     // USD:X rate e.g. 2.04
//     Date        string      // e.g. 2011-02-20
// }

// notes
type Note struct {
    Id          int64   `db:"id"`
    Created     int64
    Updated     int64

    Html        string  `json:"html"`
}


// func (user *User) SetPassword(password string) {
// 	// use negative cost to prompt default
// 	hash, err := bcrypt.GenerateFromPassword([]byte(password) , -1)

// 	if err != nil { return }
// 	user.Hash = string(hash)
// }

// // Returns nil error on sucess
// func (user *User) ComparePassword(password string) error {
//     return bcrypt.CompareHashAndPassword([]byte(user.Hash), []byte(password))
// }

/*
 *  SQL Hooks
 */



// implement the PreInsert and PreUpdate hooks
func (i *Note) PreInsert(s gorp.SqlExecutor) error {
    i.Created = time.Now().UnixNano()
    i.Updated = i.Created
    return nil
}

func (i *Note) PreUpdate(s gorp.SqlExecutor) error {
    i.Updated = time.Now().UnixNano()
    return nil
}