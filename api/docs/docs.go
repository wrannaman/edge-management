// GENERATED BY THE COMMAND ABOVE; DO NOT EDIT
// This file was generated by swaggo/swag at
// 2019-05-23 16:08:54.874158 -0700 PDT m=+0.031280181

package docs

import (
	"bytes"

	"github.com/alecthomas/template"
	"github.com/swaggo/swag"
)

var doc = `{
    "swagger": "2.0",
    "info": {
        "description": "This will cotroll remote edge devices",
        "title": "Edge Management API",
        "termsOfService": "https://sugarkubes.io/terms/",
        "contact": {
            "name": "API Support",
            "url": "http://www.xx.io/support",
            "email": "xx@xx.io"
        },
        "license": {
            "name": "MIT"
        },
        "version": "1.0"
    },
    "host": "localhost:8080",
    "basePath": "/",
    "paths": {}
}`

type swaggerInfo struct {
	Version     string
	Host        string
	BasePath    string
	Title       string
	Description string
}

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo swaggerInfo

type s struct{}

func (s *s) ReadDoc() string {
	t, err := template.New("swagger_info").Parse(doc)
	if err != nil {
		return doc
	}

	var tpl bytes.Buffer
	if err := t.Execute(&tpl, SwaggerInfo); err != nil {
		return doc
	}

	return tpl.String()
}

func Init() {
	swag.Register(swag.Name, &s{})
}
