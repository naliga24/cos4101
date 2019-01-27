import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { queue } from './../Prototype/queue.js'
import { login } from './../Prototype/login.js'
let dateFormat = require('dateformat')

class Queue extends Component {
    constructor() {
        super();
        this.state = {
            customerName: '',
            customerAmount: null,
            customerTelephone: '',
            customerEmail: '',
            data: '',
            buttonDisble: true,
            tmpDate:new Date(),
        };
        this.saveQueue = this.saveQueue.bind(this)
        this.getCurrentDate = this.getCurrentDate.bind(this)
        this.add = this.add.bind(this)
        this.clear = this.clear.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    componentDidMount() {
        this.getCurrentDate()
    }

    getCurrentDate(){
        setInterval(() => {
            this.state.tmpDate.setSeconds(this.state.tmpDate.getSeconds() + 1);
            this.setState({tmpDate:this.state.tmpDate})
        }, 1000)
    }

    saveQueue() {
        if (this.state.customerName && this.state.customerTelephone && this.state.customerAmount > 0) {
            var tmp = new queue()
            tmp.addQueue(this.state, this.clear)
            alert(`บันทึกข้อมูลคิวเรียบร้อย`)
            window.setTimeout(() => {
                this.setState({ data: tmp.data })
            }, 1000)
        } else if (this.state.customerName == '') {
            alert('ไม่ได้ระบุชื่อ')
        } else if (this.state.customerTelephone == '') {
            alert('ไม่ได้ระบุเบอร์โทร')
        } else if (this.state.customerAmount <= 0) {
            alert('จำนวนลูกค้าต้องมีค่ามากกว่า 0')
        }
        var log = new login()
        log.writeLogLogout('3')
    }
    clear() {
        this.setState({ buttonDisble: !this.state.buttonDisble })
    }
    add() {
        this.setState({ buttonDisble: !this.state.buttonDisble, data: '', customerName: '', customerAmount: '', customerTelephone: '', customerEmail: '' })
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    render() {
        if (!sessionStorage.getItem("token")) { return (<Redirect to={'/'} />) }
        return (
            <div class='outer'>
                <div class="alert alert-info" role="alert" id='header_product'><h3>การจัดการคิว</h3></div>
                <div class='queue'>
                    <div class='button'>
                        <button type="button" class="btn btn-default navbar-btn" onClick={this.add} disabled={!this.state.buttonDisble}>เพิ่มข้อมูล</button>
                        <button type="submit" class="btn btn-default navbar-btn" onClick={this.saveQueue} disabled={this.state.buttonDisble}>บันทึกข้อมูล</button>
                        <Link to="QueueManage"><button type="button" class="btn btn-default navbar-btn">จัดลำดับคิว</button></Link>
                        <Link to="QueueReserve"><button type="button" class="btn btn-default navbar-btn">จองคิวล่วงหน้า</button></Link>
                    </div>
                    <div class='status'>
                        <div class='top'>
                            <h4>หมายเลขคิว<input id='queuecode' value={this.state.data ? this.state.data.QUEUE_CODE : ''} type="text" class="form-control" aria-describedby="sizing-addon1" placeholder="YYMMDDXXXX" disabled /></h4>
                            <h4>ลำดับคิว<input value={this.state.data ? this.state.data.QUEUE_NO : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                            <h4>วันที่จองคิว<input value={this.state.data ? this.state.data.CUSTOMER_DATE : dateFormat(this.state.tmpDate, "yyyy-mm-dd")} type="text" class="form-control" aria-describedby="sizing-addon1" placeholder="YYYY-MM-DD" disabled /></h4>
                            <h4>เวลาที่จองคิว<input value={this.state.data ? this.state.data.CUSTOMER_TIME : dateFormat(this.state.tmpDate, "HH:MM:ss")} type="text" class="form-control" aria-describedby="sizing-addon1" placeholder="hh:mm:ss" disabled /></h4>
                            <h4>คิวที่รอ<input value={this.state.data ? this.state.data.QUEUE_WAIT : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                        </div>
                        <div class='middle'>
                            <h4 id='customername'>ชื่อลูกค้า<input id='customername' value={this.state.customerName} type="text" maxLength="30" class="form-control" aria-describedby="sizing-addon1" name="customerName" onChange={this.onChange} disabled={this.state.buttonDisble} required /></h4>
                            <h4 id='customeramount'>จำนวนลูกค้า<input id='customeramount' value={this.state.customerAmount} type="number" maxLength="3" min="1" max="999" class="form-control" aria-describedby="sizing-addon1" name="customerAmount" onChange={this.onChange} disabled={this.state.buttonDisble} required /></h4>
                            <h4 id='customertelephone'>เบอร์โทร<input id='customertelephone' value={this.state.customerTelephone} type="number" maxLength="10" class="form-control" aria-describedby="sizing-addon1" name="customerTelephone" onChange={this.onChange} disabled={this.state.buttonDisble} required /></h4>
                        </div>
                        <div class='bottom'>
                            <h4 id='email'>อีเมล์<input value={this.state.customerEmail} id='email' type="email" maxLength="30" class="form-control" aria-describedby="sizing-addon1" name="customerEmail" onChange={this.onChange} disabled={this.state.buttonDisble} required /></h4>
                            <h4 id='queuestatus'>สถานะของคิว<input id='queuestatus' type="text" class="form-control" aria-describedby="sizing-addon1" placeholder="คิวปกติ" disabled /></h4>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Queue;