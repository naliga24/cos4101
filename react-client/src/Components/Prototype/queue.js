import { table } from './table.js';
const request = require('superagent');

export class queue {
  constructor() {
  }

  addQueue(data, clear) {
    request.post('http://localhost:8080/insertQueueInfo')
      .send({ data: data })
      .end((err, res) => {
        if (err) { alert(err); return }
        if (res.body) {
          console.log(res)
          console.log(res.body[0])
          this.data = res.body[0]
          //alert(`บันทึกข้อมูลคิวเรียบร้อย`)
          clear()
        } else if (res.text === "0") {
          console.log(`ไม่สามารถบันทึกข้อมูลคิว`)
        }
        else if (res.text === "2") {
          console.log(`ไม่สามารถบันทึกข้อมูลคิว(เกิดข้อผิดพลาด)`)
        }
      })
  }

  listQueue() {
    request.get('http://localhost:8080/selectQueueInfoNormal')
      .send()
      .end((err, res) => {
        if (err) { alert(err); return }
        if (res.body) {
          console.log(res.body)
          this.data1 = res.body
        }
      });
  }

  listQueueWait() {
    request.get('http://localhost:8080/selectQueueInfoWait')
      .send()
      .end((err, res) => {
        if (err) { alert(err); return }
        if (res.body) {
          console.log(res.body)
          this.data2 = res.body
        }
      });
  }

  callListFreeTable() {
    this.data3 = new table()
    this.data3.listFreeTable()
  }

  pauseQueue(queueCode, selectQueueInfoNormal, selectQueueInfoWait) {
    request.get('http://localhost:8080/updateQueueStatusToWait/' + queueCode)
      .send()
      .end((err, res) => {
        if (err) { alert(err); return }
        if (res.text === "1") {
          console.log(res)
          //alert(`พักคิวเรียบร้อย`)
          selectQueueInfoNormal()
          selectQueueInfoWait()
        } else if (res.text == "0") {
          alert(`ไม่สามารพักคิวได้`)
        }
      })
  }

  callSetTableToQueue(queueCode, tableNo, selectQueueInfoNormal, selectQueueInfoWait) {
    this.data5 = new table()
    this.data5.setTableToQueue(queueCode, tableNo, selectQueueInfoNormal, selectQueueInfoWait)
  }

  getQueueInfo(tableNo) {
    request.get('http://localhost:8080/selectQueueInfo/' + tableNo)
    .send()
    .end((err, res) => {
        if (err) { alert(err); return }
        if (res.body) {
            console.log(res.body)
            this.data4 = res.body
        }
    })
  }

  addQueueFromRegister(reserveCode, tableNo, reserveName, reserveAmount, reserveTelephone, reserveEmail) {
		request.post('http://localhost:8080/insertQueueFromRegister')
		.send({ reserveCode: reserveCode, tableNo: tableNo, reserveName: reserveName, reserveAmount: reserveAmount, reserveTelephone: reserveTelephone, reserveEmail: reserveEmail })
		.end((err, res) => {
		  if (err) { alert(err); return }
			if (res.body) {
				console.log(res.body)
			}
		})
	}
}