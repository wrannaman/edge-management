package main

import (
	"github.com/wrannaman/edge-management/api/configs"
	"github.com/wrannaman/edge-management/api/httpserver"
	"github.com/wrannaman/edge-management/api/mqttserver"
	"github.com/wrannaman/edge-management/api/postgres"
	"github.com/wrannaman/edge-management/api/redisclient"
)

func main() {
	configs.Initialize()
	redisclient.Initialize()
	postgres.Initialize()
	mqttserver.Initialize()
	httpserver.StartServer()
}
