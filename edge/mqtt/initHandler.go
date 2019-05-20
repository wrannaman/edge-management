package mqtt

import (
	"fmt"

	MQTT "github.com/eclipse/paho.mqtt.golang"
)

// channels

// SubscribeChannel me
var SubscribeChannel = make(chan bool)

// SubscribeHandler me
func SubscribeHandler(client MQTT.Client, msg MQTT.Message) {
	SubscribeChannel <- true
	fmt.Printf("BrokerLoadHandler         ")
	fmt.Printf("[%s]  ", msg.Topic())
	fmt.Printf("%s\n", msg.Payload())
}
