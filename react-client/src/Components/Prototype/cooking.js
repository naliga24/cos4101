import { order } from './order.js'
const request = require('superagent');

export class cooking {
  constructor() {

  }

  callListWaitCookingDetail() {
    this.data = new order()
    this.data.listWaitCookingDetail()
  }

  callListWaitSendingDetail() {
    this.data1 = new order()
    this.data1.listWaitSendingDetail()
  }

  addCookingDetail(orderCode,orderNo) {
    request.get('http://localhost:8080/updateOrderDetailToStartCooking/' + orderCode + '/' + orderNo)
    .send()
    .end((err, res) => {
        if (err) { alert(err); return }
        if (res.text === "1") {
            console.log(res)
            console.log(`เริ่มทำอาหารให้ลูกค้าเรียบร้อย`)
        } else if (res.text == "0") {
            console.log(`ไม่สามารถเริ่มทำอาหารให้ลูกค้าได้`)
        }
    })
  }

  addSendingDetail(orderCode,orderNo) {
    request.get('http://localhost:8080/updateOrderDetailToSending/' + orderCode + '/' + orderNo)
    .send()
    .end((err, res) => {
        if (err) { alert(err); return }
        if (res.text === "1") {
            console.log(res)
            console.log(`ส่งอาหารให้ลูกค้าเรียบร้อย`)
        } else if (res.text == "0") {
            console.log(`ไม่สามารถส่งอาหารให้ลูกค้าได้`)
        }
    })
  }

}