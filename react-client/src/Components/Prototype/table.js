const request = require('superagent')

export class table {
  constructor() {
  }

    searchTable(data){
        request.post('http://localhost:8080/selectTableInfo' ) 
        .send({data:data})
        .end((err, res) => {
            if (err) { console.log(err); return; }
            this.data = res.body
            console.log(res.body)
        })
        console.log(this.data)
    }

    addTable(tableCapacity,useStatus,clear){
        request.get('http://localhost:8080/insertTableInfo/'  + tableCapacity + '/' + useStatus)
        .send()
        .end((err, res) => {
            if (err) { alert(err); return }
            if (res.text === "1") {
                console.log(res)
                //this.alert_msg = `เพิ่มข้อมูลโต๊ะอาหารเรียบร้อย`
                clear()
            } else if (res.text === "0") {
                //this.alert_msg = `ไม่สามารถเพิ่มข้อมูลโต็ะอาหาร`
                console.log(`ไม่สามารถเพิ่มข้อมูลโต็ะอาหาร`)
            }
        })
    }

    editTable(tableNo,tableCapacity,useStatus,clear){
        request.get('http://localhost:8080/updateTableInfo/' + tableNo + '/' + tableCapacity + '/' + useStatus)
        .send()
        .end((err, res) => {
            if (err) { alert(err); return }
            if (res.text === "1") {
                console.log(res)
                //this.alert_msg = `แก้ข้อมูลโต๊ะอาหาร "${tableNo}" เรียบร้อย`
                clear()
            } else if (res.text === "0") {
                //this.alert_msg = `ไม่สามารถแก้ไขข้อมูลโต็ะอาหาร "${tableNo}" ได้`
                console.log(`ไม่สามารถแก้ไขข้อมูลโต็ะอาหาร "${tableNo}" ได้`)
            }
        })
    }

    listFreeTable(){
        request.get('http://localhost:8080/selectTableInfoFreeTable')
        .send()
        .end((err, res) => {
            if (err) { alert(err); return }
            if (res.body) {
                console.log(res.body)
            this.data1 = res.body
            }
        })
    }

    listAllTable(){
        request.get('http://localhost:8080/selectTableInfoAllTable')
        .send()
        .end((err, res) => {
            if (err) { alert(err); return }
            if (res.body) {
                console.log(res.body)
                this.data2 = res.body
            }
        })
    }

    setTableToQueue(queueCode, tableNo, selectQueueInfoNormal, selectQueueInfoWait) {
        request.get('http://localhost:8080/updateQueueInfoAndSetTable/' + queueCode + '/' + tableNo)
        .send()
        .end((err, res) => {
            if (err) { alert(err); return }
            if (res.text === "1") {
            console.log(res)
            //alert(`จัดโต็ะให้ลูกค้าเรียบร้อย`)
            selectQueueInfoNormal()
            selectQueueInfoWait()
            } else if (res.text == "0") {
            console.log(`หมายเลขโต๊ะไม่ถูกต้อง`)
            }
        })
    }

    listFullTable(){
        request.get('http://localhost:8080/selectTableInfoFullTable')
        .send()
        .end((err, res) => {
            if (err) { alert(err); return }
            if (res.body) {
                console.log(res.body)
                this.data2 = res.body
            }
        })
    }

    listReserveAndFullTable(){
        request.get('http://localhost:8080/selectTableInfoReserveAndFullTable')
        .send()
        .end((err, res) => {
            if (err) { alert(err); return }
            if (res.body) {
                console.log(res.body)
                this.data2 = res.body
            }
        })
    }

    listTableForReserve(){
        request.get('http://localhost:8080/selectTableForReserve')
        .send()
        .end((err, res) => {
            if (err) { alert(err); return }
            if (res.body) {
                console.log(res.body)
                this.dataTable = res.body
            }
        })
    }

    checkFreeTable(tableNo){
        request.post('http://localhost:8080/selectFreeTable')
        .send({ tableNo: tableNo })
        .end((err, res) => {
            if (err) { alert(err); return }
            if (res.body) {
                console.log(res.body)
                this.dataCheckTable = res.body
            }
        })
    }
}
