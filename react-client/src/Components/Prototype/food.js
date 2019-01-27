const request = require('superagent');

export class food {

  constructor() {

  }

  searchFood(data) {
    request.post('http://localhost:8080/selectFoodInfo')
      .send({ data: data })
      .end((err, res) => {
        if (err) { console.log(err); return; }
        this.data = res.body
        console.log(res.body)
      })
    console.log(this.data)
  }

  addFood(foodType, foodName, foodPrice, foodStatus, clear) {
    request.get('http://localhost:8080/insertFoodInfo/' + foodType + '/' + foodName + '/' + foodPrice + '/' + foodStatus)
      .send()
      .end((err, res) => {
        if (err) { alert(err); return }
        if (res.text === "1") {
          console.log(res)
          //this.alert_msg = `เพิ่มข้อมูลสินค้าเรียบร้อย`
          clear()
        } else if (res.text == "0") {
          alert(`ไม่สามารถเพิ่มข้อมูลรายการอาหาร "${foodName}" (ชื่อมีอยู่แล้ว)`) //ไม่มีใน requirement
        }
      });
  }

  editFood(foodCode, foodType, foodName, foodPrice, foodStatus, clear) {
    request.get('http://localhost:8080/updateFoodInfo/' + foodCode + '/' + foodType + '/' + foodName + '/' + foodPrice + '/' + foodStatus)
      .send()
      .end((err, res) => {
        if (err) { alert(err); return }
        if (res.text === "1") {
          console.log(res)
          //this.alert_msg = `แก้ข้อมูลรายการอาหาร "${foodCode}" เรียบร้อย`
          clear()
        } else if (res.text == "0") {
          console.log(`ไม่สามารถแก้ไขข้อมูลรายการอาหาร "${foodCode}" ได้`)
        }
      });
  }

  findFood(foodName){
    request.get('http://localhost:8080/selectFoodInfoFindFood/' + foodName)
    .send()
    .end((err, res) => {
        if (err) { alert(err); return }
        if (res.body) {
            console.log(res.body)
           this.data1 = res.body
        }
    })
  }

  checkFoodName(foodName){
    request.get('http://localhost:8080/selectFoodInfoFoodName/'+foodName)
        .send()
        .end((err, res) => {
            if (err) { alert(err); return }
            if (res.text === "1") {
                console.log(res)
                this.data2 = res.text
            } else if (res.text == "0") {
                this.data2 = res.text
            }

        });
  }
}
