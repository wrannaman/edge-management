package configs

// Configuration me
type Configuration struct {
	CertPath       string `json:"CertPath"`
	Auth0Domain    string `json:"Auth0Domain"`
	Auth0ClientID  string `json:"Auth0ClientID"`
	Auth0WellKnown string `json:"Auth0WellKnown"`
	MixpanelToken  string `json:"MixpanelToken"`
	Pem            []byte
	Self           string `json:"Self"`

	RedisConfig struct {
		Host     string `json:"RedisConfig.Host"`
		Port     int    `json:"RedisConfig.Port"`
		Password string `json:"RedisConfig.Password"`
	}

	PostgresConfig struct {
		Host     string `json:"PostgresConfig.Host"`
		Port     int    `json:"PostgresConfig.Port"`
		Username string `json:"PostgresConfig.Username"`
		Password string `json:"PostgresConfig.Password"`
		Database string `json:"PostgresConfig.Database"`
	}
}
