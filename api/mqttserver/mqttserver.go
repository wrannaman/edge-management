package mqttserver

import (
	"fmt"
	"os"
	"time"

	MQTT "github.com/eclipse/paho.mqtt.golang"
)

var Client MQTT.Client
var hasBeenSet bool

var f MQTT.MessageHandler = func(client MQTT.Client, msg MQTT.Message) {
	fmt.Printf("TOPIC: %s\n", msg.Topic())
	fmt.Printf("MSG: %s\n", msg.Payload())
}

// MaybeInitialize me
func MaybeInitialize() bool {
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

	fmt.Println("MQTT good to go")
	return true
}

// Start me
func Start() {
	MaybeInitialize()
	if token := Client.Subscribe("$sugar/init", 0, InitHandler); token.Wait() && token.Error() != nil {
		fmt.Println(token.Error())
		os.Exit(1)
	}

	fmt.Println("subscribed")
	for {
		<-InitChannel
	}
	// client.Disconnect(250)
}
