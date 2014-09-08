package main

import (
	//"log"
	// "strings"
	

	"github.com/go-martini/martini"
	"github.com/codegangsta/martini-contrib/render"
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
	m.Post("/cyberdyne/api/v1/password", func(r render.Render) {
		//return "hi"
		r.JSON(200, "hoi")
	})


	// Not found
	m.NotFound(func() string {
		// handle 404
		return "Sorry, that route doenst exist"
	})

	m.Run()
}