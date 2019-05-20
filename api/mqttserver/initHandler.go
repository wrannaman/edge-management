package mqttserver

import (
	"fmt"

	MQTT "github.com/eclipse/paho.mqtt.golang"
)

// channels

// InitChannel me
var InitChannel = make(chan bool)

// InitHandler me
func InitHandler(client MQTT.Client, msg MQTT.Message) {
	InitChannel <- true
	fmt.Printf("BrokerLoadHandler         ")
	fmt.Printf("[%s]  ", msg.Topic())
	fmt.Printf("%s\n", msg.Payload())
}
