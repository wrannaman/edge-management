package configs

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strings"

	"github.com/kr/pretty"
	"github.com/spf13/viper"
)

// Configs global configs object
var Configs Configuration

// Initialize me
func Initialize() {
	fmt.Println("Initializing Configs")

	env := strings.ToLower(os.Getenv("ENV"))
	if env == "" {
		env = "dev"
	}
	viper.AddConfigPath("./configs")
	viper.SetConfigName(env)
	viper.SetConfigType("json")

	viper.SetDefault("CertPath", "./certs/cert.pem")
	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Error reading config file, %s", err)
	}
	err := viper.Unmarshal(&Configs)
	if err != nil {
		log.Fatalf("unable to decode into struct, %v", err)
	}
	pem, err := ioutil.ReadFile(Configs.CertPath)
	// if err != nil {
	//   panic(err)
	// }
	//
	// secret, err := LoadPublicKey(pem)
	// if err != nil {
	//   panic(err)
	// }
	// secretProvider := auth0.NewKeyProvider(secret)
	// audience := Configs.Auth0WellKnown
	// authConfig := auth0.NewConfiguration(secretProvider, []string{audience}, Configs.Auth0Domain, jose.RS256)
	// validator := auth0.NewValidator(authConfig, nil)

	// client := auth0.NewJWKClient(auth0.JWKClientOptions{URI: Configs.Auth0WellKnown}, nil)
	// audience := Configs.Auth0ClientID
	// configuration := auth0.NewConfiguration(client, []string{audience}, Configs.Auth0Domain, jose.RS256)
	// validator := auth0.NewValidator(configuration, nil)
	//
	// Configs.Auth0Validator = validator
	fmt.Printf("%# v \n", pretty.Formatter(Configs)) //It will print all struct details
	Configs.Pem = pem

	// viper.SetDefault("LayoutDir", "layouts")
	// viper.SetDefault("Taxonomies", map[string]string{"tag": "tags", "category": "categories"})

	// if os.Getenv("ENVIRONMENT") == "DEV" {
	// 	viper.SetConfigName("config")
	//
	// 	viper.AddConfigPath(filepath.Dir(dirname))
	// 	viper.ReadInConfig()
	// } else {
	// 	viper.AutomaticEnv()
	// }
}
