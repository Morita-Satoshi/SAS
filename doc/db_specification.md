## 利用するDB
DynamoDB

## テーブル
* management テーブル

|Key名|型|必須|
|:---|:---|:---|
|studentId|string|〇|
|plantID|number|〇|
|PlantName|string|〇|
|studentName|string|〇|

* 日々の成長記録テーブル

|Key名|型|必須|
|:---|:---|:---|
|studentID_platnID|string|〇|
|datetime|string|〇|
|pictureURL|string|〇|
|isWater|bool|〇|
