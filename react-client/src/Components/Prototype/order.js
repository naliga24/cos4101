import { table } from './table.js'
import { queue } from './queue.js'
import { food } from './food.js'
const request = require('superagent')

export class order {
  constructor() {

  }
  callListReserveAndFullTable() {
    this.data = new table()
    this.data.listReserveAndFullTable()
  }

  callGetQueueInfo(tableNo) {
    this.data1 = new queue()
    this.data1.getQueueInfo(tableNo)
  }

  getOrderHeader(tableNo) {
    request.get('http://localhost:8080/selectOrderHeader/' + tableNo)
      .send()
      .end((err, res) => {
        if (err) { alert(err); return }
        if (res.body) {
          console.log(res.body)
          this.data2 = res.body
        }
      })
  }

  getOrderDetail(tableNo) {
    request.get('http://localhost:8080/selectOrderDetail/' + tableNo)
      .send()
      .end((err, res) => {
        if (err) { alert(err); return }
        if (res.body) {
          console.log(res.body)
          this.data3 = res.body
        }
      })
  }

  callFindFood(foodName) {
    this.data4 = new food()
    this.data4.findFood(foodName)
  }

  deleteFood(orderCode, orderNo) {
    request.get('http://localhost:8080/deleteOrderDetail/' + orderCode + '/' + orderNo )
      .send()
      .end((err, res) => {
        if (err) { alert(err); return }
        if (res.text === "1") {
          //alert(`ลบข้อมูลการสั่งอาหาร ${orderCode} เรียบร้อย`)
        } else if (res.text === "0") {
          console.log(`ไม่สามารถลบข้อมูลการสั่งอาหาร`)
        } else if (res.text === "2") {
          console.log(`ลบข้อมูลการสั่งอาหาร ${orderCode} เรียบร้อย\nไม่สามารถอับเดทราคารวมได้`)
        }
      })
  }

  addOrderHeader(tableNo,queueCode){
    request.get('http://localhost:8080/insertOrderHeader/' + tableNo + '/' + queueCode )
    .send()
    .end((err, res) => {
        if (err) { alert(err); return }
        if (res.text === "1") {
            console.log(`เพิ่มข้อมูล header การสั่งอาหารเรียบร้อย\nปรับสถานะการใช้โต็ะ ='3' เรียบร้อย`)
        } else if (res.text === "0") {
            console.log(`ไม่สามารถเพิ่มข้อมูล header การสั่งอาหาร\nไม่สามารถปรับสถานะการใช้โต็ะ`)
        }
        else if (res.text === "2") {
            console.log(`เพิ่มข้อมูล header การสั่งอาหารเรียบร้อย\nไม่สามารถปรับสถานะการใช้โต็ะ`)
        }
    })
  }

  addFood(orderCode,foodCode,foodType,foodName,foodPrice,foodAmount,clear){
    request.get('http://localhost:8080/insertOrderDetail/'+orderCode  + '/' + foodCode + '/' + foodType + '/' + foodName + '/' + foodPrice + '/' + foodAmount)
    .send()
    .end((err, res) => {
        if (err) { 
          alert(err); 
          return }
        if (res.text === "1") {
          clear()
           // alert(`เพิ่มข้อมูลการสั่งอาหาร ${orderCode} เรียบร้อย`)
        } else if (res.text === "0") {
           // alert(`ไม่สามารถเพิ่มข้อมูลการสั่งอาหาร`)
        } else if (res.text === "2") {
            //alert(`เพิ่มข้อมูลการสั่งอาหาร ${orderCode} เรียบร้อย\nไม่สามารถอับเดทราคารวมได้`)
        }
    })
  }

  editFood(orderCode,orderNo,foodAmount,clear){
    request.get('http://localhost:8080/updateOrderDetail/' + orderCode + '/' + orderNo  + '/' + foodAmount)
    .send()
    .end((err, res) => {
        if (err) { alert(err); return }
        if (res.text === "1") {
          // alert(`แก้ไขมูลการสั่งอาหาร ${orderCode} เรียบร้อย`)
          clear()
        } else if (res.text === "0") {
            console.log(`ไม่สามารถเแก้ไข้อมูลการสั่งอาหาร`)
        } else if (res.text === "2") {
            console.log(`เแก้ไข้อมูลการสั่งอาหาร ${orderCode} เรียบร้อย\nไม่สามารถอับเดทราคารวมได้`)
        }
    })
  }

  listWaitCookingDetail() {
    request.get('http://localhost:8080/selectOrderDetailWaiting')
    .send()
    .end((err, res) => {
        if (err) { alert(err); return }
        if (res.body) {
            console.log(res.body)
            this.data5 = res.body
        }
    });
  }

  listWaitSendingDetail() {
    request.get('http://localhost:8080/selectOrderDetailCooking')
    .send()
    .end((err, res) => {
        if (err) { alert(err); return }
        if (res.body) {
            console.log(res.body)
          this.data6 = res.body
        }
    });
  }

  listDataReportSummary(startDate, endDate) {
    request.get('http://localhost:8080/selectReportSummary/' + startDate + '/' + endDate)
    .send()
    .end((err, res) => {
        if (err) { alert(err); return }
        if (res.body) {
            console.log(res.body[1])
            this.dataReportSummary = res.body[1]
        }
    })
  }

  listDataReportByFoodType(startDate, endDate, foodType) {
    request.get('http://localhost:8080/selectReportByFoodType/' + startDate + '/' + endDate + '/' + foodType)
    .send()
    .end((err, res) => {
        if (err) { alert(err); return }
        if (res.body) {
            console.log(res.body)
            this.dataReportByFoodType = res.body[1]
        }
    })
  }
}
