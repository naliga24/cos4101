import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { queue } from './../Prototype/queue.js'
import { table } from './../Prototype/table.js'
import { login } from './../Prototype/login.js'
const request = require('superagent');

class QueueManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            data1: '',
            data2: '',
            selected: [],
            selected1: [],
            tableNo: '0',
            freeTableFlag: false,
        };
        this.onChange = this.onChange.bind(this)
        this.saveQueueTable = this.saveQueueTable.bind(this)
        this.waitQueue = this.waitQueue.bind(this)
        this.selectTableInfoFreeTable = this.selectTableInfoFreeTable.bind(this)
        this.selectQueueInfoNormal = this.selectQueueInfoNormal.bind(this)
        this.selectQueueInfoWait = this.selectQueueInfoWait.bind(this)
        this.checkFreeTable = this.checkFreeTable.bind(this)
    }

    selectTableInfoFreeTable() {
        var tmp = new queue()
        tmp.callListFreeTable()
        window.setTimeout(() => {
            this.setState({ data: tmp.data3.data1 })
        }, 1000);
    }

    selectQueueInfoNormal() {
        var tmp = new queue()
        tmp.listQueue()
        window.setTimeout(() => {
            this.setState({ data1: tmp.data1 })
        }, 1000);
    }

    selectQueueInfoWait() {
        var tmp = new queue()
        tmp.listQueueWait()
        window.setTimeout(() => {
            this.setState({ data2: tmp.data2 })
        }, 1000);
    }

    componentWillMount() {
        window.setInterval(() => {
            this.selectTableInfoFreeTable()
        }, 3000)
        this.selectQueueInfoNormal()
        this.selectQueueInfoWait()
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    waitQueue(queueCode, selectQueueInfoNormal, selectQueueInfoWait) {
        var tmp = new queue()
        tmp.pauseQueue(queueCode, selectQueueInfoNormal, selectQueueInfoWait)
        var log = new login()
        log.writeLogLogout('3')
    }

    saveQueueTable(queueCode, tableNo, selectQueueInfoNormal, selectQueueInfoWait) {
        this.checkFreeTable()
        window.setTimeout(() => {
            if (this.state.freeTableFlag === true) {
                var tmp = new queue()
                tmp.callSetTableToQueue(queueCode, tableNo, selectQueueInfoNormal, selectQueueInfoWait)
                alert(`จัดโต็ะให้ลูกค้าเรียบร้อย`)
                this.setState({ tableNo: '0' ,freeTableFlag: false})
            } else {
                alert(`หมายเลขโต๊ะไม่ถูกต้อง`)
            }
        }, 300)
        var log = new login()
        log.writeLogLogout('3')
    }

    checkFreeTable() {
        for (let x of this.state.data) {
            console.log(x.TABLE_NO, this.state.tableNo)
            if (x.TABLE_NO == this.state.tableNo && this.state.tableNo !== '0') {
                this.setState({ freeTableFlag: true })
                return
            }
        }
        this.setState({ freeTableFlag: false })
    }

    render() {
        if (!sessionStorage.getItem("token")) { return (<Redirect to={'/'} />) }
        return (
            <div class='outer'>
                <div class="alert alert-info" role="alert" id='header_product'><h3>การจัดการคิว</h3></div>
                <div class='queue_manage'>
                    <div class='button'>
                        <button type="button" class="btn btn-default navbar-btn disabled">เพิ่มข้อมูล</button>
                        <button type="button" class="btn btn-default navbar-btn disabled">บันทึกข้อมูล</button>
                        <button type="button" class="btn btn-default navbar-btn">จัดลำดับคิว</button>
                        <Link to="QueueReserve"><button type="button" class="btn btn-default navbar-btn">จองคิวล่วงหน้า</button></Link>
                    </div>
                    <div class="status">
                        <div class="table-wrapper-scroll-y" id="first">
                            <table class="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th class="stickqueue" scope="col">หมายเลขโต็ะ</th>
                                        <th class="stickqueue" scope="col">จำนวนที่นั่ง</th>
                                        <th class="stickqueue" scope="col">สถานะของการใช้โต็ะ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.data ? this.state.data.map((item, index) => (
                                            <tr>
                                                <th scope="row">{item.TABLE_NO}</th>
                                                <td>{item.TABLE_CAPACITY}</td>
                                                <td>{item.TABLE_STATUS_DESCRIPTION}</td>
                                            </tr>
                                        )) : (<tr></tr>)
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div class="queue_table">
                            <div class="table-wrapper-scroll-y" id="second">
                                <table class="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th class="stickqueue" scope="col">รหัสคิว</th>
                                            <th class="stickqueue" scope="col">หมายเลขคิว</th>
                                            <th class="stickqueue" scope="col">ชื่อลูกค้า</th>
                                            <th class="stickqueue" scope="col">จำนวนลูกค้า</th>
                                            <th class="stickqueue" scope="col">เบอร์โทร</th>
                                            <th class="stickqueue" scope="col">สถานะของคิว</th>
                                            <th class="stickqueue" scope="col">หมายเลขโต็ะ</th>
                                            <th class="stickqueue" scope="col">เลือกโต็ะ</th>
                                            <th class="stickqueue" scope="col">บันทึก</th>
                                            <th class="stickqueue" scope="col">ลูกค้าไม่มา</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.data1 ? this.state.data1.map((item, index) => (
                                                <tr>
                                                    <th scope="row">{item.QUEUE_CODE}</th>
                                                    <td>{item.QUEUE_NO}</td>
                                                    <td>{item.CUSTOMER_NAME}</td>
                                                    <td>{item.CUSTOMER_AMOUNT}</td>
                                                    <td>{item.CUSTOMER_TELEPHONE}</td>
                                                    <td>{item.QUEUE_STATUS_DESCRIPTION}</td>
                                                    <td><input type="number" maxLength="3" min="1" max="255" class="form-control" aria-describedby="sizing-addon1" name="tableNo" onChange={this.onChange} placeholder="0" onBlur={() => { var tmp = this.state.selected.slice(); tmp[index] = !this.state.selected; this.setState({ selected: tmp }); }} disabled={!this.state.selected[index]} /></td>
                                                    <td><p data-placement="top" data-toggle="tooltip" title="Select"><button class="btn btn-success btn-xs" data-title="Select" data-toggle="modal" data-target="#select" onClick={() => { var tmp = this.state.selected.slice(); tmp[index] = !this.state.selected[index]; this.setState({ selected: tmp }); }} ><span class="glyphicon glyphicon-ok"></span></button></p></td>
                                                    <td onClick={() => { this.saveQueueTable(item.QUEUE_CODE, this.state.tableNo, this.selectQueueInfoNormal, this.selectQueueInfoWait) }}><p data-placement="top" data-toggle="tooltip" title="Save"><button class="btn btn-primary btn-xs" data-title="Save" data-toggle="modal" data-target="#save" ><span class="glyphicon glyphicon-floppy-disk"></span></button></p></td>
                                                    <td onClick={() => { this.waitQueue(item.QUEUE_CODE, this.selectQueueInfoNormal, this.selectQueueInfoWait) }}><p data-placement="top" data-toggle="tooltip" title="Delete"><button class="btn btn-danger btn-xs" data-title="Delete" data-toggle="modal" data-target="#delete" ><span class="glyphicon glyphicon-remove"></span></button></p></td>
                                                </tr>
                                            )) : (<tr></tr>)
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div class="table-wrapper-scroll-y" id="third">
                                <table class="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th class="stickqueue" scope="col">รหัสคิว</th>
                                            <th class="stickqueue" scope="col">หมายเลขคิว</th>
                                            <th class="stickqueue" scope="col">ชื่อลูกค้า</th>
                                            <th class="stickqueue" scope="col">จำนวนลูกค้า</th>
                                            <th class="stickqueue" scope="col">เบอร์โทร</th>
                                            <th class="stickqueue" scope="col">สถานะของคิว</th>
                                            <th class="stickqueue" scope="col">หมายเลขโต็ะ</th>
                                            <th class="stickqueue" scope="col">เลือกโต็ะ</th>
                                            <th class="stickqueue" scope="col">บันทึก</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.data2 ? this.state.data2.map((item, index) => (
                                                <tr>
                                                    <th scope="row">{item.QUEUE_CODE}</th>
                                                    <td>{item.QUEUE_NO}</td>
                                                    <td>{item.CUSTOMER_NAME}</td>
                                                    <td>{item.CUSTOMER_AMOUNT}</td>
                                                    <td>{item.CUSTOMER_TELEPHONE}</td>
                                                    <td>{item.QUEUE_STATUS_DESCRIPTION}</td>
                                                    <td><input type="number" maxLength="3" min="1" max="255" class="form-control" aria-describedby="sizing-addon1" name="tableNo" onChange={this.onChange} placeholder="0" onBlur={() => { var tmp = this.state.selected1.slice(); tmp[index] = !this.state.selected1; this.setState({ selected1: tmp }); }} disabled={!this.state.selected1[index]} /></td>
                                                    <td><p data-placement="top" data-toggle="tooltip" title="Select"><button class="btn btn-success btn-xs" data-title="Select" data-toggle="modal" data-target="#select" onClick={() => { var tmp = this.state.selected1.slice(); tmp[index] = !this.state.selected1[index]; this.setState({ selected1: tmp }); }}><span class="glyphicon glyphicon-ok"></span></button></p></td>
                                                    <td onClick={(e) => { this.saveQueueTable(item.QUEUE_CODE, this.state.tableNo, this.selectQueueInfoNormal, this.selectQueueInfoWait) }}><p data-placement="top" data-toggle="tooltip" title="Save"><button class="btn btn-primary btn-xs" data-title="Save" data-toggle="modal" data-target="#save" ><span class="glyphicon glyphicon-floppy-disk"></span></button></p></td>
                                                </tr>
                                            )) : (<tr></tr>)
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default QueueManage;