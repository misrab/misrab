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
type Reading struct {
    Id          int64   `db:"id"`
    Created     int64   `db:"created"`
    Updated     int64   `db:"updated"`

    Link                string  `json:"link"`
    Description         string  `json:"description"`
}



/*
 *  SQL Hooks
 */



// implement the PreInsert and PreUpdate hooks
func (i *Reading) PreInsert(s gorp.SqlExecutor) error {
    i.Created = time.Now().UnixNano()
    i.Updated = i.Created
    return nil
}

func (i *Reading) PreUpdate(s gorp.SqlExecutor) error {
    i.Updated = time.Now().UnixNano()
    return nil
}