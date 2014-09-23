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

func getNote(dbmap *gorp.DbMap) (models.Note, error) {
	var n models.Note
	err := dbmap.SelectOne(&n, "select * from notes")
	return n, err
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

	
	// Notes
	m.Get("/cyberdyne/api/v1/note", authorize, func(r render.Render, dbmap *gorp.DbMap) {
		// get note
		n, err := getNote(dbmap)
		if err != nil {
	    	r.JSON(400, err)
	    	log.Println("Error retrieving notes: ")
	    	log.Println(err.Error())
	    	return
	    }

		r.JSON(200, map[string]interface{}{"html": n.Html})
	})

	type NoteHtml struct {
		Html string `form:"html"`
	}
	m.Patch("/cyberdyne/api/v1/note", authorize, binding.Bind(NoteHtml{}), 
		func(r render.Render, dbmap *gorp.DbMap, nh NoteHtml) {
		// retrieve note
		n, err := getNote(dbmap)
		if err != nil {
	    	r.JSON(400, err)
	    	log.Println("Error retrieving notes: ")
	    	log.Println(err.Error())
	    	return
	    }

	    // update and save
	    n.Html = nh.Html
	   	_, err2 := dbmap.Update(&n)
	   	if err2 != nil {
	    	r.JSON(400, err)
	    	log.Println("Error updating notes: ")
	    	log.Println(err.Error())
	    	return
	    }

	    r.JSON(200, nil)
	})


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