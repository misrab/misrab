package main

import (
	"log"
	"fmt"
	"time"
	"strings"
	
	"net/http"
	"encoding/base64"
	"encoding/hex"
	"crypto/md5"

	"github.com/go-martini/martini"
	"github.com/codegangsta/martini-contrib/render"
	"github.com/martini-contrib/binding"

	"github.com/coopernurse/gorp"

	"github.com/Misrab/misrab/models"
)


// returns what the key should be today
func getKey(pass string) string {
	y, m, d := time.Now().UTC().Date()
	date := fmt.Sprintf("%d-%s-%d-%s", y,m,d, pass)

	hasher := md5.New()
    hasher.Write([]byte(date))
    return hex.EncodeToString(hasher.Sum(nil))
}


func authorize(r render.Render, req *http.Request) {
	auth := strings.Replace(req.Header.Get("Authorization"), "Basic ", "", -1)

	decoded, err := base64.StdEncoding.DecodeString(auth)
	if err != nil { 
		log.Println("Error decoding api key: ")
		log.Println(err.Error())
		r.JSON(400, err)
		return
	}

	if getKey("frewsdf") != string(decoded) {
		r.JSON(401, nil)
		return
	}
}


func main() {
	m := martini.Classic()
	m.Map(models.SetupDB())
	m.Use(render.Renderer())

	


	// post password
	type PasswordForm struct {
		Password string `form:"password"`
	}
	type auth struct {
		Success bool 	`json:"success"`
		Key 	string 	`json:"key"`
	}
	m.Post("/cyberdyne/api/v1/password", binding.Bind(PasswordForm{}), 
	func(r render.Render, p PasswordForm) {
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

	
	/*
		Notes
	*/


	type NoteHtml struct {
		Html string `form:"html"`
	}
	m.Get("/cyberdyne/api/v1/notes", authorize, func(r render.Render, dbmap *gorp.DbMap) {
		// get note
		var n []models.Note
		_, err := dbmap.Select(&n, "select * from notes order by updated")

		if err != nil {
	    	r.JSON(400, err)
	    	log.Println("Error retrieving notes: ")
	    	log.Println(err.Error())
	    	return
	    }
	    // map[string]interface{}{"html": n.Html}
		r.JSON(200, n)
	})
	m.Post("/cyberdyne/api/v1/note", authorize, binding.Bind(NoteHtml{}), 
		func(r render.Render, dbmap *gorp.DbMap, nh NoteHtml) {
			var n = models.Note{
				Html: nh.Html,
			}

			err := dbmap.Insert(&n)
			if err != nil {
		    	r.JSON(400, err)
		    	log.Println("Error creating notes: ")
		    	log.Println(err.Error())
		    	return
	    	}

			r.JSON(200, n)
	})
	m.Delete("/cyberdyne/api/v1/note/(?P<id>[0-9]+)", authorize, 
		func(params martini.Params, r render.Render, dbmap *gorp.DbMap) {
		id := params["id"]

		_, err := dbmap.Exec("delete from notes where id=$1", id)
		if err != nil {
	    	r.JSON(400, err)
	    	log.Println("Error deleting notes: ")
	    	log.Println(err.Error())
	    	return
	    }

		r.JSON(200, nil)
	})



	/*
		Readings
	*/


	m.Get("/cyberdyne/api/v1/readings", authorize, func(r render.Render, dbmap *gorp.DbMap) {
		// get note
		var n []models.Reading
		_, err := dbmap.Select(&n, "select * from readings order by updated")

		if err != nil {
	    	r.JSON(400, err)
	    	log.Println("Error retrieving notes: ")
	    	log.Println(err.Error())
	    	return
	    }
	    // map[string]interface{}{"html": n.Html}
		r.JSON(200, n)
	})
	m.Post("/cyberdyne/api/v1/reading", authorize, binding.Bind(models.Reading{}), 
		func(r render.Render, dbmap *gorp.DbMap, nh models.Reading) {
			var n = models.Reading{
				Link: nh.Link,
				Description: nh.Description,
			}

			err := dbmap.Insert(&n)
			if err != nil {
		    	r.JSON(400, err)
		    	log.Println("Error creating reading: ")
		    	log.Println(err.Error())
		    	return
	    	}

			r.JSON(200, n)
	})
	m.Delete("/cyberdyne/api/v1/reading/(?P<id>[0-9]+)", authorize, 
		func(params martini.Params, r render.Render, dbmap *gorp.DbMap) {
		id := params["id"]

		_, err := dbmap.Exec("delete from readings where id=$1", id)
		if err != nil {
	    	r.JSON(400, err)
	    	log.Println("Error deleting notes: ")
	    	log.Println(err.Error())
	    	return
	    }

		r.JSON(200, nil)
	})
	m.Patch("/cyberdyne/api/v1/reading/toggleRead/(?P<id>[0-9]+)", authorize, 
		func(params martini.Params, res render.Render, dbmap *gorp.DbMap) {
		id := params["id"]
		var r models.Reading

		// retrieve
		err1 := dbmap.SelectOne(&r, "select * from readings where id=$1", id)
		if err1 != nil {
	    	res.JSON(400, err1)
	    	log.Println("Error finding notes: ")
	    	log.Println(err1.Error())
	    	return
	    }
	    // update
	    if r.Read == true {
	    	r.Read = false
    	} else {
    		r.Read = true
    	}
	    _, err2 := dbmap.Update(&r)
	    if err2 != nil {
	    	res.JSON(400, err2)
	    	log.Println("Error updating notes: ")
	    	log.Println(err2.Error())
	    	return
	    }

		res.JSON(200, r)
	})
	
	/*
		Angular
	*/

	// default angular app
	m.Get(".*", func(r render.Render) {
		//return "hi"
		r.HTML(200, "index", nil)
	})

	// Not found
	m.NotFound(func() string {
		// handle 404
		return "Sorry, that route doenst exist"
	})

	m.Run()
}