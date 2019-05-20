package mqttserver

import "fmt"

// Publish me
func Publish(topic string, message string) {
	fmt.Printf("\n publishing message %s topic %s \n", message, topic)
	Client.Publish("$sugar/deploy", 0, false, message)
}
