package main

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/JGrotex/GrovePi/Software/Go/grovepi"

	"fmt"
)

type PostPlantCondition struct {
	IsWater    bool   `json:"isWater,omitempty"`
	PictureURL string `json:"pictureURL,omitempty"`
	Datetime   string `json:"datetime,omitempty"`
}

func runDirt() string {
	var g grovepi.GrovePi
	g = *grovepi.InitGrovePi(0x04) // GrovePi+はI2Cアドレス0x04で動作する
	defer g.CloseDevice()
	u := "https://wvgpmj09ce.execute-api.ap-northeast-1.amazonaws.com/dev/students/morita/plants/1"
	p := PostPlantCondition{}
	client := &http.Client{}

	for {
		i, err := g.AnalogRead(grovepi.A0) //A0ポートからセンサの値を読む
		if err != nil {
			panic(err)
		}
		t, _ := time.Parse("2006-01-02 15:04:05 MST", "2014-12-31 12:31:24 JST")
		if i < 500 {
			//API Call
			p.IsWater = true
		} else {
			p.IsWater = false
		}
		p.Datetime = t

		body,err :=json.Marshal(p)
		if err != nil{
			fmt.Println("create body error"))
		}
		req, err := http.NewRequest("POST", u,body)
		res,err := client.Do(req)

		fmt.Printf("%d\n", i) // 表示する
	}

	return "done"
}

func main() {
	runDirt()
}
