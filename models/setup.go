package models

import (
	"os"
	"fmt"
	"log"
	"regexp"

	"database/sql"

	_ "github.com/lib/pq"
	"github.com/coopernurse/gorp"
)



func PanicIf(err error) {
	if err != nil {
		panic(err)
	}
}

//func SetupDB() *sql.DB {
func SetupDB() *gorp.DbMap {
	db := pgConnect()

	// construct a gorp DbMap
    dbmap := &gorp.DbMap{Db: db, Dialect: gorp.PostgresDialect{}}

    // add a table, setting the table name to 'posts' and
    // specifying that the Id property is an auto incrementing PK
    dbmap.AddTableWithName(Note{}, "notes").SetKeys(true, "Id") //.ColMap("Email").SetUnique(true)
   	

    //.SetKeys(false, "Email")

    // drop all tables for testing
    log.Println("Dropping tables...")
	err1 := dbmap.DropTablesIfExists()
	PanicIf(err1)

	log.Println("Creating tables...")
    err2 := dbmap.CreateTablesIfNotExists()
    PanicIf(err2)
	
    log.Println("Loading initial data...")

    // insert the one note for use
    // env := os.Getenv("ENV")
    // // if not staging
    if env != "staging" && env != "production" {
    	n := new(Note)
	   	err0 := dbmap.Insert(n)
	   	PanicIf(err0)
    }
   	

    return dbmap
}


func pgConnect() *sql.DB {
	// Connect to Postgres database
	env := os.Getenv("ENV")
	regex := regexp.MustCompile("(?i)^postgres://(?:([^:@]+):([^@]*)@)?([^@/:]+):(\\d+)/(.*)$")
	var connection string
	switch env {
	case "staging":
		connection = os.Getenv("DATABASE_URL")
		break
	//case "production":
	// default to development
	default:
		connection = os.Getenv("POSTGRESQL_LOCAL_URL")
	}
	matches := regex.FindStringSubmatch(connection)
	sslmode := "disable"
	spec := fmt.Sprintf("user=%s password=%s host=%s port=%s dbname=%s sslmode=%s", matches[1], matches[2], matches[3], matches[4], matches[5], sslmode)

	db, err := sql.Open("postgres", spec)
	PanicIf(err)
	return db
}