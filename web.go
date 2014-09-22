package main

import (
	"log"
	"fmt"
	"time"
	// "strings"
	
	"encoding/base64"
	"encoding/hex"
	"crypto/md5"

	"github.com/go-martini/martini"

	"github.com/codegangsta/martini-contrib/render"
	"github.com/martini-contrib/binding"
)


// returns what the key should be today
func getKey(pass string) string {
	y, m, d := time.Now().UTC().Date()
	date := fmt.Sprintf("%d-%s-%d-%s", y,m,d, pass)

	hasher := md5.New()
    hasher.Write([]byte(date))
    return hex.EncodeToString(hasher.Sum(nil))
}


func main() {
	m := martini.Classic()
	m.Use(render.Renderer())

	m.Get(".*", func(r render.Render) {
		//return "hi"
		r.HTML(200, "index", nil)
	})


	// APIs
	// Cyberdyne
	type PasswordForm struct {
		Password string `form:"password"`
	}


	type auth struct {
		Success bool 	`json:"success"`
		Key 	string 	`json:"key"`
	}

	m.Post("/cyberdyne/api/v1/password", binding.Bind(PasswordForm{}), func(r render.Render, p PasswordForm) {
		b, err := base64.StdEncoding.DecodeString(p.Password)
		if err != nil { 
			log.Println("Error decoding password...")
			r.JSON(400, err)
			return
		}
		password := string(b)

		a := new(auth)
		if password == "frewsdf" {
			a.Success = true
			a.Key = getKey(password)
		} else {
			a.Success = false
		}

		r.JSON(200, a)
	})


	// Not found
	m.NotFound(func() string {
		// handle 404
		return "Sorry, that route doenst exist"
	})

	m.Run()
}