package models


import (
	"time"

	"github.com/coopernurse/gorp"
	//"code.google.com/p/go.crypto/bcrypt"
)



// notes
type Reading struct {
    Id          int64   `db:"id" json:"id"`
    Created     int64   `db:"created" json:"created"`
    Updated     int64   `db:"updated" json:"updated"`

    Read                bool    `db:"read" json:"read"`
    Link                string  `db:"link" json:"link"`
    Description         string  `db:"description" json:"description"`
}



/*
 *  SQL Hooks
 */



// implement the PreInsert and PreUpdate hooks
func (i *Reading) PreInsert(s gorp.SqlExecutor) error {
    i.Created = time.Now().UnixNano()
    i.Updated = i.Created
    i.Read = false // default not read of course
    return nil
}

func (i *Reading) PreUpdate(s gorp.SqlExecutor) error {
    i.Updated = time.Now().UnixNano()
    return nil
}