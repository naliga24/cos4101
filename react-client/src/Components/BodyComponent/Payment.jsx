import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { payment } from './../Prototype/payment.js'
import { login } from './../Prototype/login.js'
let dateFormat = require('dateformat')

class Payment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: '',
            data1: [this.props.location.data ? this.props.location.data : ''],
            data2: '',
            data3: '',
            data4: [this.props.location.data ? this.props.location.data : ''],
            tableNo: [this.props.location.data ? this.props.location.data.TABLE_NO : ''],
            receiveAmount: this.props.location.data ? this.props.location.data.RECEIVE_AMOUNT : '',
            exchangeAmount: this.props.location.data ? this.props.location.data.EXCHANGE_AMOUNT : '',
            paymentStatus: '',
            indexData: '',
            unservedFoodFlag: false,
            editFlag: this.props.location.editFlag,
            detailFlag: this.props.location.detailFlag,
            buttonDisble: false,
            buttonDisble1: false,
            tmpDate:new Date(),
        }
        this.savePayment = this.savePayment.bind(this)
        this.start = this.start.bind(this)
        this.calExchange = this.calExchange.bind(this)
        this.onChange = this.onChange.bind(this)
        this.selectFullTable = this.selectFullTable.bind(this)
        this.selectTable = this.selectTable.bind(this)
        this.selectOrderHeader = this.selectOrderHeader.bind(this)
        this.selectOrderDetail = this.selectOrderDetail.bind(this)
        this.findUnservedFood = this.findUnservedFood.bind(this)
        this.getCurrentDate = this.getCurrentDate.bind(this)
        this.clear = this.clear.bind(this)
    }

    componentDidMount() {
        if (this.state.editFlag || this.state.detailFlag) {
            this.selectTableInfoAllTable()
        } else {
            this.selectFullTable()
        }
        if (this.state.editFlag || this.state.detailFlag) {
            this.selectOrderDetail()
        }
        this.getCurrentDate()
    }

    getCurrentDate(){
        setInterval(() => {
            this.state.tmpDate.setSeconds(this.state.tmpDate.getSeconds() + 1);
            this.setState({tmpDate:this.state.tmpDate})
        }, 1000)
    }

    savePayment() {
        if (this.state.editFlag && this.state.exchangeAmount >= 0) {
            var tmp = new payment()
            tmp.editPayment(this.props.location.data.PAYMENT_CODE, this.state.receiveAmount, this.state.exchangeAmount)
            alert(`แก้ไขข้อมูลการชำระเงิน ${this.props.location.data.PAYMENT_CODE} เรียบร้อย`)
            this.selectFullTable()
            this.clear()
        } else if (this.state.data4 && this.state.receiveAmount && this.state.exchangeAmount >= 0 && this.state.data[this.state.indexData].TABLE_STATUS_DESCRIPTION === 'สั่งอาหารแล้ว' && !this.state.unservedFoodFlag) {
            var tmp = new payment()
            tmp.addPayment(this.state.data4[0].ORDER_CODE, this.state.data4[0].ORDER_TOTAL_PRICE, this.state.receiveAmount, this.state.exchangeAmount, this.state.tableNo)
            setTimeout(() => {
                alert(`เพิ่มข้อมูลการชำระเงิน ${this.state.data4[0].ORDER_CODE} เรียบร้อย`)
                this.setState({ data2: tmp.data5 })
                this.selectFullTable()
                this.clear()
            }, 1000)
        } else if (this.state.unservedFoodFlag) {
            alert('ลูกค้ายังไม่ได้รับรายการอาหารบางรายการ')
        } else if (this.state.exchangeAmount < 0 || this.state.receiveAmount == '') {
            alert('จำนวนเงินที่รับจากลูกค้าไม่ถูกต้อง')
        }
        var log = new login()
        log.writeLogLogout('6')
    }

    start() {
        this.setState({ buttonDisble: !this.state.buttonDisble, buttonDisble1: !this.state.buttonDisble1 })
    }

    calExchange() {
        this.state.data4 && this.setState({ exchangeAmount: parseFloat(this.state.receiveAmount) - this.state.data4[0].ORDER_TOTAL_PRICE })
    }

    onChange(e) {
        if (e.target.name === "tableNo") {
            var tmp = e.target.value.split(',')
            this.setState({ [e.target.name]: tmp[0], indexData: tmp[1] }, () => { this.state.data[this.state.indexData].TABLE_STATUS_DESCRIPTION !== 'โต็ะว่าง' ? this.selectTable() : console.log('สถานะโต็ะเท่ากับ "โต็ะว่าง" ไม่สามารถแสดงข้อมูล queue_info , order_header , order_detail') })
        } else if (e.target.name === "receiveAmount") {
            this.setState({ [e.target.name]: e.target.value }, () => this.calExchange())
        }
    }

    selectTableInfoAllTable() {
        var tmp = new payment()
        tmp.callListAllTable()
        window.setTimeout(() => {
            this.setState({ data: tmp.data6.data2 })
        }, 1000);
    }


    selectFullTable() {
        var tmp = new payment()
        tmp.callListFullTable()
        window.setTimeout(() => {
            this.setState({ data: tmp.data.data2 })
        }, 1000);
    }

    selectTable() {
        var tmp = new payment()
        tmp.callGetQueueInfo(this.state.tableNo)
        window.setTimeout(() => {
            this.setState({ data1: tmp.data2.data4 })
            this.selectOrderHeader()
            this.selectOrderDetail()
            window.setTimeout(() => {
                this.findUnservedFood()
            }, 1000);
        }, 1000);
    }

    selectOrderHeader() {
        var tmp = new payment()
        tmp.callGetOrderHeader(this.state.tableNo)
        window.setTimeout(() => {
            this.setState({ data4: tmp.data3.data2 })
        }, 1000);
    }

    selectOrderDetail() {
        var tmp = new payment()
        tmp.callGetOrderDetail(this.state.tableNo)
        window.setTimeout(() => {
            this.setState({ data3: tmp.data4.data3 })
        }, 1000)
    }

    findUnservedFood() {
        for (let x of this.state.data3) {
            if (x.FOOD_STATUS_DESCRIPTION === 'รับรายการ' || x.FOOD_STATUS_DESCRIPTION === 'กำลังทำอาหาร') {
                this.setState({ unservedFoodFlag: true })
                return
            }
        }
    }

    clear() {
        this.setState({ data1: '', data3: '', data4: '', tableNo: '', indexData: '', receiveAmount: '', exchangeAmount: '', buttonDisble: !this.state.buttonDisble, buttonDisble1: !this.state.buttonDisble1, editFlag: false })
        // editFlag:false clear when finish edit
    }

    render() {
        if (!sessionStorage.getItem("token")) { return (<Redirect to={'/'} />) }
        return (
            <div class='outer'>
                <div class="alert alert-info" role="alert" id='header_product'><h3>การชำระเงิน</h3></div>
                <div class='order'>
                    <div class='button'>
                        <button type="button" class="btn btn-default navbar-btn" onClick={this.start} disabled={this.state.buttonDisble1 || this.state.detailFlag}>เพิ่มข้อมูลการชำระเงิน</button>
                        <button type="button" class="btn btn-default navbar-btn" onClick={this.savePayment} disabled={!this.state.buttonDisble1}>บันทึกข้อมูล</button>
                        <Link to="PaymentSearch"><button type="button" class="btn btn-default navbar-btn">ค้นหาข้อมูล</button></Link>
                    </div>
                    <div class='status'>
                        <div class='top'>
                            <h4 onChangeCapture={() => { this.setState({ data1: '', data3: '', data4: '' }) }}>หมายเลขโต็ะ
                            <select class="selectpicker" name="tableNo" onChange={this.onChange} disabled={this.state.editFlag||this.state.detailFlag}>
                                    <option selected={false} hidden></option>
                                    {
                                        this.state.data ? this.state.data.map((item, index) => (
                                            <option value={item.TABLE_NO + ',' + index} selected={!this.state.tableNo ? false : (this.state.editFlag || this.state.detailFlag) ? (this.state.tableNo == item.TABLE_NO) ? true : false : false}>{item.TABLE_NO}</option>
                                        )) : (<option>ไม่มีรายการโต็ะ</option>)
                                    }
                                </select>
                            </h4>
                            <h4>รอบการใช้บริการ<input value={this.state.data4 ? this.state.data4[0].TABLE_ROUND : (this.state.editFlag || this.state.detailFlag) ? this.props.location.data.TABLE_ROUND : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                            <h4>จำนวนที่นั่ง<input id='tablecapacity' value={this.state.data1 && (this.state.editFlag || this.state.detailFlag) ? this.props.location.data.TABLE_CAPACITY : this.state.indexData ? this.state.data[this.state.indexData].TABLE_CAPACITY : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                            <h4>สถานะของการใช้โต็ะ<input id='tablestatus' value={this.state.data1 && (this.state.editFlag || this.state.detailFlag) ? '' : this.state.indexData ? this.state.data[this.state.indexData].TABLE_STATUS_DESCRIPTION : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                        </div>
                        <div class='middle'>
                            <h4>หมายเลขคิว<input id='queuecode' value={this.state.data1 ? this.state.data1[0].QUEUE_NO : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                            <h4>ชื่อลูกค้า<input id='customername' value={this.state.data1 ? this.state.data1[0].CUSTOMER_NAME : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                            <h4>จำนวนลูกค้า<input id='customeramount' value={this.state.data1 ? this.state.data1[0].CUSTOMER_AMOUNT : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                        </div>
                        <div class='bottom'>
                            <h4>หมายเลขการสั่งอาหาร<input id='ordercode' value={this.state.data4 ? this.state.data4[0].ORDER_CODE : (this.state.editFlag || this.state.detailFlag) ? this.props.location.data.ORDER_CODE : ''} type="text" class="form-control" aria-describedby="sizing-addon1" placeholder="YYMMDDXXXX" disabled /></h4>
                            <h4>วันที่สั่งอาหาร<input id='orderdate' value={this.state.data4 ? this.state.data4[0].ORDER_DATE : (this.state.editFlag || this.state.detailFlag) ? this.props.location.data.ORDER_DATE : ''} type="text" class="form-control" aria-describedby="sizing-addon1" placeholder="YYYY-MM-DD" disabled /></h4>
                            <h4>เวลาสั่งอาหาร<input id='ordertime' value={this.state.data4 ? this.state.data4[0].ORDER_TIME : (this.state.editFlag || this.state.detailFlag) ? this.props.location.data.ORDER_TIME : ''} type="text" class="form-control" aria-describedby="sizing-addon1" placeholder="hh:mm:ss" disabled /></h4>
                            <h4>มูลค่าอาหาร<input id='ordertotalprice' value={this.state.data4 ? this.state.data4[0].ORDER_TOTAL_PRICE : (this.state.editFlag || this.state.detailFlag) ? this.props.location.data.ORDER_TOTAL_PRICE : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                        </div>
                    </div>
                    <div class="table-wrapper-scroll-y" id="firstpayment">
                        <table class="table table-bordered table-striped" id="firstpayment">
                            <thead>
                                <tr>
                                    <th class='stickpayment' scope="col">ลำดับที่</th>
                                    <th class='stickpayment' scope="col">รหัสสินค้า</th>
                                    <th class='stickpayment' scope="col">ประเภท</th>
                                    <th class='stickpayment' scope="col">ชื่ออาหาร</th>
                                    <th class='stickpayment' scope="col">ราคา</th>
                                    <th class='stickpayment' scope="col">จำนวน</th>
                                    <th class='stickpayment' scope="col">ราคารวม</th>
                                    <th class='stickpayment' scope="col">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.data3 ? this.state.data3.map((item, index) => (
                                        <tr>
                                            <td>{item.ORDER_NO}</td>
                                            <td>{item.FOOD_CODE}</td>
                                            <td>{item.FOOD_TYPE_DESCRIPTION}</td>
                                            <td>{item.FOOD_NAME}</td>
                                            <td>{item.FOOD_PRICE}</td>
                                            <td>{item.FOOD_AMOUNT}</td>
                                            <td>{item.FOOD_TOTAL}</td>
                                            <td>{item.FOOD_STATUS_DESCRIPTION}</td>
                                        </tr>
                                    )) : (<tr></tr>)
                                }
                            </tbody>
                        </table>
                    </div>
                    <div class='status'>
                        <div class='top'>
                            <h4>หมายเลขการชำระเงิน<input value={this.state.data2 ? this.state.data2.PAYMENT_CODE : (this.state.editFlag || this.state.detailFlag) ? this.props.location.data.PAYMENT_CODE : ''} type="text" class="form-control" aria-describedby="sizing-addon1" placeholder="YYMMDDXXXX" disabled /></h4>
                            <h4>วันที่ชำระเงิน<input id='paymentdate' value={this.state.data2 ? this.state.data2.PAYMENT_DATE : (this.state.editFlag || this.state.detailFlag) ? this.props.location.data.PAYMENT_DATE : dateFormat(this.state.tmpDate, "yyyy-mm-dd")} type="text" class="form-control" aria-describedby="sizing-addon1" placeholder="YYYY-MM-DD" disabled /></h4>
                            <h4>เวลาที่ชำระเงิน<input id='paymenttime' value={this.state.data2 ? this.state.data2.PAYMENT_TIME : (this.state.editFlag || this.state.detailFlag) ? this.props.location.data.PAYMENT_TIME : dateFormat(this.state.tmpDate, "HH:MM:ss")} type="text" class="form-control" aria-describedby="sizing-addon1" placeholder="hh:mm:ss" disabled /></h4>
                        </div>
                        <div class='bottom'>
                            <h4>จำนวนเงินที่รับ<input id='receiveamount' value={this.state.receiveAmount = (this.state.editFlag || this.state.detailFlag) ? this.state.editFlag ? this.state.receiveAmount : this.props.location.data.RECEIVE_AMOUNT : this.state.receiveAmount} type="number" maxLength="11" min="1" max="99999999999" class="form-control" aria-describedby="sizing-addon1" name="receiveAmount" onChange={this.onChange} disabled={!this.state.buttonDisble} required /></h4>
                            <h4>จำนวนเงินทอน<input id='exchangeamount' value={this.state.exchangeAmount = (this.state.editFlag || this.state.detailFlag) ? this.state.editFlag ? this.state.exchangeAmount : this.props.location.data.EXCHANGE_AMOUNT : this.state.exchangeAmount} type="number" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                            <h4>สถานะของการชำระเงิน<input id='paymentstatus' value={this.state.data2 ? this.state.data2.PAYMENT_STATUS_DESCRIPTION : (this.state.editFlag || this.state.detailFlag) ? this.props.location.data.PAYMENT_STATUS_DESCRIPTION : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Payment;