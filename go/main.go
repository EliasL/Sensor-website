package main

import (
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"syscall"

	"github.com/gorilla/websocket"
	"golang.org/x/crypto/ssh/terminal"

	_ "github.com/go-sql-driver/mysql"
)

var upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool {
	return true
}}

func checkErr(err error) {
	if err != nil {
		log.Println("write:", err)
	}
}

func getTableData(tableName, date1, date2 string) ([]byte, error) {

	db, err := sql.Open("mysql", "elias:"+password+"@tcp(lowpowersensor.tk:3306)/elwatch")
	checkErr(err)
	defer db.Close()

	// Open doesn't open a connection. Validate DSN data:
	if err != nil {
		log.Println("write:", err)
		return nil, err
	}

	rows, err := db.Query(fmt.Sprintf("SELECT value, date FROM %v WHERE (date BETWEEN '%v' AND '%v')", tableName, date1, date2))
	checkErr(err)
	defer rows.Close()

	type DBData struct {
		Value float32
		Date  string
	}

	var data = []DBData{}

	for rows.Next() {
		var value float32
		var date string
		err := rows.Scan(&value, &date)
		checkErr(err)
		data = append(data, DBData{value, date})
	}
	checkErr(err)

	js, err := json.Marshal(data)
	checkErr(err)
	return js, nil
}

func sendMessage(c *websocket.Conn, mt int, messageType string, args []string) {
	var message []byte
	var err error
	if messageType == "elwatchTableTimeframe" {
		message, err = getTableData(args[0], args[1], args[2])
		checkErr(err)
	}
	err = c.WriteMessage(mt, message)
	checkErr(err)
}

func handleCommand(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	checkErr(err)

	defer c.Close()
	for {
		mt, message, err := c.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			break
		}
		log.Printf("recv: %s", message)

		messageArgs := strings.Split(string(message), ", ")

		if messageArgs[0] == "get" {
			sendMessage(c, mt, messageArgs[1], messageArgs[2:])
		}
	}

}

func getFirstFilePathFrom(folderPath string) string {
	files, err := ioutil.ReadDir(folderPath)
	if err != nil {
		log.Fatal(err)
	}

	return folderPath + "/" + files[0].Name()
}

var ip = ":8080"
var addr = flag.String("addr", "lowpowersensor.tk:8080", "http service address")
var password = ""

func main() {
	flag.Parse()
	log.SetFlags(0)

	fmt.Print("Enter password for mysql user elias at 46.101.29.167: ")
	bytePassword, err := terminal.ReadPassword(int(syscall.Stdin))
	if err == nil {
	}
	password = string(bytePassword)

	fmt.Println("Ready")
	fmt.Println("Serving " + ip)

	http.HandleFunc("/", handleCommand)
	var cert = "/etc/letsencrypt/live/lowpowersensor.tk/cert.pem"
	var key = "/etc/letsencrypt/live/lowpowersensor.tk/privkey.pem"
	log.Fatal(http.ListenAndServeTLS(*addr, cert, key, nil))

}
