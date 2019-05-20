package main

import (
	"github.com/wrannaman/edge-management/api/httpserver"
	"github.com/wrannaman/edge-management/api/mqttserver"
)

// func brokerLoadHandler(client MQTT.Client, msg MQTT.Message) {
// 	brokerLoad <- true
// 	fmt.Printf("BrokerLoadHandler         ")
// 	fmt.Printf("[%s]  ", msg.Topic())
// 	fmt.Printf("%s\n", msg.Payload())
// }
//
// func brokerConnectionHandler(client MQTT.Client, msg MQTT.Message) {
// 	brokerConnection <- true
// 	fmt.Printf("BrokerConnectionHandler   ")
// 	fmt.Printf("[%s]  ", msg.Topic())
// 	fmt.Printf("%s\n", msg.Payload())
// }
//
// func brokerClientsHandler(client MQTT.Client, msg MQTT.Message) {
// 	brokerClients <- true
// 	fmt.Printf("BrokerClientsHandler      ")
// 	fmt.Printf("[%s]  ", msg.Topic())
// 	fmt.Printf("%s\n", msg.Payload())
// }

func main() {
	go httpserver.StartServer()
	mqttserver.Start()
}
