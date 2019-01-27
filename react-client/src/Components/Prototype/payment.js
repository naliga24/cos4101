import { table } from './table.js';
import { queue } from './queue.js';
import { order } from './order.js'
const request = require('superagent');

export class payment {
  constructor() {
  }

  callListAllTable() {
    this.data6 = new table()
    this.data6.listAllTable()
  }

  callListFullTable() {
    this.data = new table()
    this.data.listFullTable()
  }

  callGetQueueInfo(tableNo) {
    this.data2 = new queue()
    this.data2.getQueueInfo(tableNo)
  }

  searchPaymentDetail(data) {
    request.post('http://localhost:8080/selectPaymentInfo')
    .send({ data: data })
    .end((err, res) => {
        if (err) { console.log(err); return; }
        this.data1 = res.body
        console.log(res.body)
    })
console.log(this.data)
  }

  callGetOrderHeader(tableNo) {
    this.data3 = new order()
    this.data3.getOrderHeader(tableNo)
  }

  callGetOrderDetail(tableNo){
    this.data4 = new order()
    this.data4.getOrderDetail(tableNo)
  }

  editPayment(paymentCode,receiveAmount,exchangeAmount){
    request.get('http://localhost:8080/updatePaymentInfo/' + paymentCode + '/' + receiveAmount + '/' + exchangeAmount)
    .send()
    .end((err, res) => {
        if (err) { alert(err); return }
        if (res.text === "1") {
            console.log(res)
            //alert(`แก้ไขข้อมูลการชำระเงิน ${paymentCode} เรียบร้อย`)
        } else if (res.text == "0") {
            //alert(`ไม่สามารถแก้ไขข้อมูลการชำระเงิน ${paymentCode}`)
            console.log(`ไม่สามารถแก้ไขข้อมูลการชำระเงิน ${paymentCode}`)
        }
    })
  }

  addPayment(orderCode,orderTotalPrice,receiveAmount,exchangeAmount,tableNo){
        request.get('http://localhost:8080/insertPaymentInfo/' + orderCode + '/' + orderTotalPrice + '/' + receiveAmount + '/' + exchangeAmount + '/' + tableNo)
        .send()
        .end((err, res) => {
            if (err) { alert(err); return }
            if (res.body) {
                console.log(res)
                //alert(`เพิ่มข้อมูลการชำระเงินเรียบร้อย`)
                this.data5 = res.body[0]
            } else if (res.text === "0") {
                console.log(`ไม่สามารถเพิ่มข้อมูลการชำระเงินได้`)
            }
            else if (res.text === "2") {
                console.log(`ไม่สามารถอัปเดทสถานะโต็ะ(เกิดข้อผิดพลาด)`)
            }
        })
    
  }
}