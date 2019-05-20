package mqtt

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/eclipse/paho.mqtt.golang"
)

var f mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	fmt.Printf("TOPIC: %s\n", msg.Topic())
	fmt.Printf("MSG: %s\n", msg.Payload())
}

var client mqtt.Client
var hasBeenSet bool

// MaybeInitialize me!
func MaybeInitialize() bool {
	if hasBeenSet == true {
		return true
	}

	opts := mqtt.NewClientOptions().AddBroker("tcp://0.0.0.0:1883")
	opts.SetCleanSession(true)
	opts.SetClientID("edge")
	opts.SetUsername("admin")
	opts.SetPassword("andrewpierno")
	opts.SetKeepAlive(15 * time.Second)
	opts.SetDefaultPublishHandler(f)
	opts.SetPingTimeout(15 * time.Second)
	opts.SetAutoReconnect(true)

	c := mqtt.NewClient(opts)
	if token := c.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}
	client = c
	hasBeenSet = true

	return true
}

var count int

// InitializeSubscribers me
func InitializeSubscribers() {
	MaybeInitialize()
	if token := client.Subscribe("$sugar/deploy", 0, SubscribeHandler); token.Wait() && token.Error() != nil {
		fmt.Println(token.Error())
		os.Exit(1)
	}

	fmt.Println("MQTT subscribed")
	for {
		<-SubscribeChannel
	}
}

// Run me!
func Run() {
	MaybeInitialize()
	count++
	token := client.Publish("$sugar/init", 0, false, "awake: "+strconv.Itoa(count))
	token.Wait()
	for {
		<-SubscribeChannel
	}
	// client.Disconnect(250)
}
