import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { table } from './../Prototype/table.js'
import { queue } from './../Prototype/queue.js'
import { order } from './../Prototype/order.js'
import { login } from './../Prototype/login.js'
let dateFormat = require('dateformat')

const request = require('superagent')

class Order extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: '',
            data1: '',
            data2: '',
            data3: '',
            data4: '',
            tableNo: '',
            foodName: '',
            foodAmount: '1',
            tableIndex: '',
            index: '',
            buttonDisble: false,
            buttonDisble1: false,
            buttonDisble2: false,
            flagEdit: false,
            tmpDate:new Date(),
        }
        this.clear = this.clear.bind(this)
        this.addOrder = this.addOrder.bind(this)
        this.addFood = this.addFood.bind(this)
        this.editFood = this.editFood.bind(this)
        this.saveOrder = this.saveOrder.bind(this)
        this.getCurrentDate = this.getCurrentDate.bind(this)
        this.onChange = this.onChange.bind(this)
        this.selectTable = this.selectTable.bind(this)
        this.searchFood = this.searchFood.bind(this)
        this.selectOrderHeader = this.selectOrderHeader.bind(this)
        this.deleteOrderFood = this.deleteOrderFood.bind(this)
        this.selectReserveAndFullTable = this.selectReserveAndFullTable.bind(this)

    }

    componentWillMount() {
        window.setInterval(() => {
            this.selectReserveAndFullTable()
        }, 2000);
        this.getCurrentDate()
    }

    
    getCurrentDate(){
        setInterval(() => {
            this.state.tmpDate.setSeconds(this.state.tmpDate.getSeconds() + 1);
            this.setState({tmpDate:this.state.tmpDate})
        }, 1000)
    }

    clear() {
        this.setState({ buttonDisble: false, buttonDisble2: true, foodName: '', foodAmount: '1', flagEdit: false })
    }

    saveOrder() {
        if (this.state.data[this.state.tableIndex].TABLE_STATUS_DESCRIPTION === 'รอสั่งอาหาร' && this.state.flagEdit === false && this.state.foodAmount > 0 && this.state.data2) {
            this.addOrder()
            window.setTimeout(() => {
                this.addFood()
                alert(`เพิ่มข้อมูลการสั่งอาหาร ${this.state.data4[0].ORDER_CODE} เรียบร้อย`)
            }, 4000)
        }
        else if (this.state.data[this.state.tableIndex].TABLE_STATUS_DESCRIPTION === 'สั่งอาหารแล้ว' && this.state.flagEdit === false && this.state.foodAmount > 0 && this.state.data2) {
            this.addFood()
            alert(`เพิ่มข้อมูลการสั่งอาหาร ${this.state.data4[0].ORDER_CODE} เรียบร้อย`)
        }
        else if (this.state.flagEdit === true && this.state.foodAmount > 0) {
            this.editFood()
            alert(`แก้ไขมูลการสั่งอาหาร ${this.state.data3[this.state.index].ORDER_CODE} เรียบร้อย`)
        } else if (!this.state.data2) {
            alert('ไม่ได้ระบุรายการอาหาร')
        }else if (this.state.foodAmount <= 0){
            alert('จำนวนอาหารต้องมีจำนวนมากกว่า 0')
        }
        var log = new login()
        log.writeLogLogout('4')
    }

    onChange(e) {
        if (e.target.name === "tableNo") {
            var tmp = e.target.value.split(',')
            this.setState({ [e.target.name]: tmp[0], tableIndex: tmp[1] }, () => { this.state.data[this.state.tableIndex].TABLE_STATUS_DESCRIPTION !== 'โต็ะว่าง' ? this.selectTable() : console.log('สถานะโต็ะเท่ากับ "โต็ะว่าง" ไม่สามารถแสดงข้อมูล queue_info , order_header , order_detail') })

        } else if (e.target.name === "foodName") {
            this.setState({ [e.target.name]: e.target.value }, () => this.searchFood())
        } else {
            this.setState({ [e.target.name]: e.target.value })
        }
    }

    addOrder() {
        var tmp = new order()
        tmp.addOrderHeader(this.state.tableNo, this.state.data1[0].QUEUE_CODE)
        window.setTimeout(() => {
            this.selectOrderHeader()
        }, 1000)
    }

    addFood() {
        var tmp = new order()
        tmp.addFood(this.state.data4[0].ORDER_CODE, this.state.data2[0].FOOD_CODE, this.state.data2[0].FOOD_TYPE, this.state.data2[0].FOOD_NAME, this.state.data2[0].FOOD_PRICE, this.state.foodAmount,this.clear)
        window.setTimeout(() => {
            this.selectOrderHeader()
            this.selectOrderDetail()
        }, 1000);
    }

    editFood() {
        var tmp = new order()
        tmp.editFood(this.state.data3[this.state.index].ORDER_CODE, this.state.data3[this.state.index].ORDER_NO, this.state.foodAmount,this.clear)
        window.setTimeout(() => {
            this.selectOrderHeader()
            this.selectOrderDetail()
        }, 1000)
    }

    selectReserveAndFullTable() {
        var tmp = new order()
        tmp.callListReserveAndFullTable()
        window.setTimeout(() => {
            this.setState({ data: tmp.data.data2 })
        }, 1000);
    }

    selectTable() {
        var tmp = new order()
        tmp.callGetQueueInfo(this.state.tableNo)
        window.setTimeout(() => {
            this.setState({ data1: tmp.data1.data4 })
            this.selectOrderHeader()
            this.selectOrderDetail()
        }, 1000);
    }

    selectOrderHeader() {
        var tmp = new order()
        tmp.getOrderHeader(this.state.tableNo)
        window.setTimeout(() => {
            this.setState({ data4: tmp.data2 })
        }, 1000);
    }

    selectOrderDetail() {
        var tmp = new order()
        tmp.getOrderDetail(this.state.tableNo)
        window.setTimeout(() => {
            this.setState({ data3: tmp.data3 })
        }, 1000)
    }

    searchFood() {
        this.setState({ data2: '' })
        if (this.state.foodName && this.state.tableNo) {
            var tmp = new order()
            tmp.callFindFood(this.state.foodName)
            window.setTimeout(() => {
                this.setState({ data2: tmp.data4.data1 })
            }, 1000);
        }
    }

    deleteOrderFood(index) {
        var tmp = new order()
        tmp.deleteFood(this.state.data3[index].ORDER_CODE, this.state.data3[index].ORDER_NO)
        alert(`ลบข้อมูลการสั่งอาหาร ${this.state.data3[index].ORDER_CODE} เรียบร้อย`)
        window.setTimeout(() => {
            this.selectOrderHeader()
            this.selectOrderDetail()
        }, 1000);
        var log = new login()
        log.writeLogLogout('4')
    }

    render() {
        if (!sessionStorage.getItem("token")) { return (<Redirect to={'/'} />) }
        return (
            <div class='outer'>
                <div class="alert alert-info" role="alert" id='header_order'><h3>การสั่งอาหาร</h3></div>
                <div class='order' id="wrapper">
                    <div class='status'>
                        <div class='top'>
                            <h4 onChangeCapture={() => { this.setState({ data1: '', data3: '', data4: '' }) }}>หมายเลขโต็ะ
                            <select class="selectpicker" name="tableNo" onChange={this.onChange}>
                                    <option selected="selected" disabled hidden></option>
                                    {
                                        this.state.data ? this.state.data.map((item, index) => (
                                            <option value={item.TABLE_NO + ',' + index}>{item.TABLE_NO}</option>
                                        )) : (<option>ไม่มีรายการโต็ะ</option>)
                                    }
                                </select>
                            </h4>
                            <h4>รอบการใช้บริการ<input value={this.state.data4 ? this.state.data4[0].TABLE_ROUND : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                            <h4>จำนวนที่นั่ง<input id='tablecapacity' value={this.state.data1 ? this.state.data[this.state.tableIndex].TABLE_CAPACITY : this.state.tableIndex ? this.state.data[this.state.tableIndex].TABLE_CAPACITY : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                            <h4>สถานะของการใช้โต็ะ<input id='tablestatus' value={this.state.data1 ? this.state.data[this.state.tableIndex].TABLE_STATUS_DESCRIPTION : this.state.tableIndex ? this.state.data[this.state.tableIndex].TABLE_STATUS_DESCRIPTION : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                        </div>
                        <div class='middle'>
                            <h4>หมายเลขคิว<input id='queuecode' value={this.state.data1 ? this.state.data1[0].QUEUE_NO : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                            <h4>ชื่อลูกค้า<input id='customername' value={this.state.data1 ? this.state.data1[0].CUSTOMER_NAME : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                            <h4>จำนวนลูกค้า<input id='customeramount' value={this.state.data1 ? this.state.data1[0].CUSTOMER_AMOUNT : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                        </div>
                        <div class='bottom'>
                            <h4>หมายเลขการสั่งอาหาร<input id='ordercode' value={this.state.data4 ? this.state.data4[0].ORDER_CODE : ''} type="text" class="form-control" aria-describedby="sizing-addon1" placeholder="YYMMDDXXXX" disabled /></h4>
                            <h4>วันที่สั่งอาหาร<input id='orderdate' value={this.state.data4 ? this.state.data4[0].ORDER_DATE : dateFormat(this.state.tmpDate, "yyyy-mm-dd")} type="text" class="form-control" aria-describedby="sizing-addon1" placeholder="YYYY-MM-DD" disabled /></h4>
                            <h4>เวลาสั่งอาหาร<input id='ordertime' value={this.state.data4 ? this.state.data4[0].ORDER_TIME : dateFormat(this.state.tmpDate, "HH:MM:ss")} type="text" class="form-control" aria-describedby="sizing-addon1" placeholder="hh:mm:ss" disabled /></h4>
                            <h4>มูลค่าอาหาร<input id='ordertotalprice' value={this.state.data4 ? this.state.data4[0].ORDER_TOTAL_PRICE : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                        </div>
                    </div>
                    <div class='food'>
                        <div class='top' >
                            <div>
                                <button type="submit" class="btn btn-default navbar-btn" onClick={this.saveOrder} disabled={(!this.state.buttonDisble && !this.state.buttonDisble1) || this.state.buttonDisble2}>บันทึกข้อมูล</button>
                            </div>
                            <button type="button" class="btn btn-default navbar-btn" onClick={() => { this.setState({ data2: '', foodName: '', foodAmount: '1', buttonDisble2: false, buttonDisble: false, buttonDisble1: false }) }}>ยกเลิก</button>
                        </div>
                        <div class='middle'>
                            <h4>รหัสสินค้า<input id='foodcode' value={this.state.data2 ? this.state.data2[0].FOOD_CODE : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                            <h4>ประเภทอาหาร<input value={this.state.data2 ? this.state.data2[0].FOOD_TYPE_DESCRIPTION : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                            <h4>ชื่ออาหาร<input value={this.state.foodName} type="text" maxLength="30" minLength="1" class="form-control" aria-describedby="sizing-addon1" id='foodName' name="foodName" onChange={this.onChange} disabled={!this.state.buttonDisble || this.state.buttonDisble1} required /></h4>
                        </div>
                        <div class='bottom'>
                            <h4>ราคาอาหาร<input id='foodprice' value={this.state.data2 ? this.state.data2[0].FOOD_PRICE : ''} type="text" class="form-control" aria-describedby="sizing-addon1" disabled /></h4>
                            <h4>จำนวนที่สั่ง<input id='foodamount' value={this.state.foodAmount} type="number" maxLength="3" min="1" max="255" class="form-control" aria-describedby="sizing-addon1" name="foodAmount" onChange={this.onChange} disabled={!this.state.buttonDisble} required /></h4>
                            <button type="button" class="btn btn-default navbar-btn" onClick={() => { this.setState({ buttonDisble: true, buttonDisble1: false, buttonDisble2: false, flagEdit: false, data2: '', foodName: '', foodAmount: '1' }) }} disabled={this.state.buttonDisble || !this.state.tableNo}>เพิ่มข้อมูลรายการอาหาร</button>
                        </div>
                    </div>
                    <div class="table-wrapper-scroll-y">
                        <table class="table table-bordered table-striped">
                            <thead class='ordertablehead'>
                                <tr>
                                    <th class="stickyorder" scope="col">ลำดับ</th>
                                    <th class="stickyorder" scope="col">รหัสสินค้า</th>
                                    <th class="stickyorder" scope="col">ประเภท</th>
                                    <th class="stickyorder" scope="col">ชื่ออาหาร</th>
                                    <th class="stickyorder" scope="col">ราคา</th>
                                    <th class="stickyorder" scope="col">จำนวน</th>
                                    <th class="stickyorder" scope="col">ราคารวม</th>
                                    <th class="stickyorder" scope="col">สถานะ</th>
                                    <th class="stickyorder" scope="col">แก้ไข</th>
                                    <th class="stickyorder" scope="col">ลบ</th>
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
                                            <td onClick={() => { var tmp = [item]; this.setState({ buttonDisble: true, buttonDisble1: true, buttonDisble2: false, data2: tmp, foodName: item.FOOD_NAME, foodAmount: item.FOOD_AMOUNT, flagEdit: true, index: index }); }}><p data-placement="top" data-toggle="tooltip" title="Edit"><button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#edit" disabled={item.FOOD_STATUS !== '1'}><span class="glyphicon glyphicon-pencil"></span></button></p></td>
                                            <td onClick={() => { this.deleteOrderFood(index) }}><p data-placement="top" data-toggle="tooltip" title="Delete"><button class="btn btn-danger btn-xs" data-title="Delete" data-toggle="modal" data-target="#delete" disabled={item.FOOD_STATUS !== '1'}><span class="glyphicon glyphicon-remove"></span></button></p></td>
                                        </tr>
                                    )) : (<tr></tr>)
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Order;