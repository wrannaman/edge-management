package edgeutils

// CheckError ...
func CheckError(e error) {
	if e != nil {
		panic(e)
	}
}
