package main

import (
	"log"
	// "strings"
	
	"encoding/base64"

	"github.com/go-martini/martini"

	"github.com/codegangsta/martini-contrib/render"
	"github.com/martini-contrib/binding"
)


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
	m.Post("/cyberdyne/api/v1/password", binding.Bind(PasswordForm{}), func(r render.Render, p PasswordForm) {
		b, err := base64.StdEncoding.DecodeString(p.Password)
		if err != nil { log.Println("Error decoding password...") }
		password := string(b)

		log.Println(p.Password)
		log.Println(password)

		//return "hi"
		r.JSON(200, password)
	})


	// Not found
	m.NotFound(func() string {
		// handle 404
		return "Sorry, that route doenst exist"
	})

	m.Run()
}