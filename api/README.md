# Edge Management API


## Requires MQTT Broker

using mosquito

```sh
brew install mosquito

mosquitto -c /etc/mosquitto/mosquitto.conf -v
```

# Swagger

```
swag init -g httpserver/httpserver.go
```

User

Stack
Device - edge device /server / etc.
  Devices have Apps
      Apps are kube configs.
