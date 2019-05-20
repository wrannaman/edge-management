package configs

// Configuration me
type Configuration struct {
	CertPath       string `json:"CertPath"`
	Auth0Domain    string `json:"Auth0Domain"`
	Auth0ClientID  string `json:"Auth0ClientID"`
	Auth0WellKnown string `json:"Auth0WellKnown"`
	MixpanelToken  string `json:"MixpanelToken"`
	Pem            []byte
	RedisConfig    struct {
		Host     string `json:"Redis.Host"`
		Port     int    `json:"Redis.Port"`
		Password string `json:"Redis.Password"`
	}
	Self string `json:"Self"`
}
