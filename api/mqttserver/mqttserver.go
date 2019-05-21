package mqttserver

import (
	"fmt"
	"log"
	"os"
	"time"

	MQTT "github.com/eclipse/paho.mqtt.golang"
)

// Client ...
var Client MQTT.Client

// flag to set up mqtt client or not
var hasBeenSet bool

var f MQTT.MessageHandler = func(client MQTT.Client, msg MQTT.Message) {
	fmt.Printf("TOPIC: %s\n", msg.Topic())
	fmt.Printf("MSG: %s\n", msg.Payload())
}

// Initialize me
func Initialize() bool {
	if hasBeenSet == true {
		return true
	}
	opts := MQTT.NewClientOptions().AddBroker("tcp://0.0.0.0:1883")
	opts.SetCleanSession(true)
	opts.SetClientID("api")
	opts.SetUsername("admin")
	opts.SetPassword("andrewpierno")
	opts.SetKeepAlive(15 * time.Second)
	// opts.SetDefaultPublishHandler(f)
	opts.SetPingTimeout(15 * time.Second)
	opts.SetAutoReconnect(true)

	Client = MQTT.NewClient(opts)
	if token := Client.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}
	hasBeenSet = true

	log.Println("MQTT     OKAY")
	go Start()
	return true
}

// Start me
func Start() {
	if token := Client.Subscribe("$sugar/init", 0, InitHandler); token.Wait() && token.Error() != nil {
		fmt.Println(token.Error())
		os.Exit(1)
	}

	fmt.Println("MQTT => subscribed")
	for {
		<-InitChannel
	}
	// client.Disconnect(250)
}
