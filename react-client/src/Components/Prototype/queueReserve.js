import { table } from './table.js'
import { queue } from './queue.js'
const request = require('superagent')

export class queueReserve {
	constructor() {
	}
	
	callListTableForReserve () {
		this.tableOBJ = new table()
		this.tableOBJ.listTableForReserve();
	}

	callCheckFreeTable (tableNo) {
		this.tableOBJ = new table()
		this.tableOBJ.checkFreeTable(tableNo);
	}

	callAddQueueFormRegister (reserveCode, tableNo, reserveName, reserveAmount, reserveTelephone, reserveEmail) {
		this.queueOBJ = new queue()
		this.queueOBJ.addQueueFromRegister(reserveCode, tableNo, reserveName, reserveAmount, reserveTelephone, reserveEmail);
	}

	listDataReserve(reserveDate, tableNo) {
		request.post('http://localhost:8080/selectDataReserve')
		.send({ reserveDate: reserveDate, tableNo: tableNo })
		.end((err, res) => {
			if (err) { alert(err); return }
			if (res.body) {
				console.log(res.body)
				this.dataReserve = res.body
			}
		})
	}

	addDataReserve(reserveDate, tableNo, startTime, endTime, reserveName, reserveAmount, reserveTelephone, reserveEmail) {
		request.post('http://localhost:8080/insertDataReserve')
		.send({ reserveDate: reserveDate, tableNo: tableNo, startTime: startTime, endTime: endTime, reserveName: reserveName, reserveAmount: reserveAmount, reserveTelephone: reserveTelephone, reserveEmail: reserveEmail })
		.end((err, res) => {
			if (err) { alert(err); return }
			if (res.body) {
				console.log(res.body)
			}
		})
	}

	checkTimeForReserve(reserveDate, tableNo, startTime, endTime) {
		request.post('http://localhost:8080/checkTime')
		.send({ reserveDate: reserveDate, tableNo: tableNo, startTime: startTime, endTime: endTime })
		.end((err, res) => {
			if (err) { alert(err); return }
			if (res.body) {
				console.log(res.body)
				this.dataCheckTime = res.body
			}
		})
	}
}