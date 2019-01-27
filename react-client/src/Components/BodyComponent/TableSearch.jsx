import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { database } from './../Prototype/database.js'
import { login } from './../Prototype/login.js'

class TableSearch extends Component {
    constructor() {
        super();
        this.state = {
            tableNo: '',
            tableCapacity: '',
            tableStatus: '',
            useStatus: '',
            dscAsc: '',
            data: '',
        }
        this.searchTable = this.searchTable.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    searchTable() {
        var tmp = new database()
        tmp.callSearchTable(this.state) 
        window.setTimeout(() => {
            this.setState({data:tmp.table.data})
            console.log(this.state.data)
            this.state.data.length === 0 && alert('ไม่พบข้อมูลที่ค้นหา')
        }, 1000);
        var log = new login()
        log.writeLogLogout('8')
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        console.log(this.state)
    }
    render() {
        if (!sessionStorage.getItem("token")) { return (<Redirect to={'/'} />) }
        return (
            <div class='outer'>
                <div class="alert alert-info" role="alert" id='header_product'><h3>การจัดการฐานข้อมูล > โต็ะอาหาร</h3></div>
                <div class='table_search'>
                    <div class='button'>
                        <button type="button" class="btn btn-default navbar-btn disabled">เพิ่มข้อมูล</button>
                        <button type="button" class="btn btn-default navbar-btn disabled">บันทึกข้อมูล</button>
                        <button type="button" class="btn btn-default navbar-btn">ค้นหาข้อมูล</button>
                    </div>

                    <div class='status'>
                        <div class='top'>
                            <h4>หมายเลขโต็ะ<input type="number" maxLength="3" min="1" max="255" class="form-control" aria-describedby="sizing-addon1" name="tableNo" onChange={this.onChange} /></h4>
                            <h4>จำนวนที่นั่ง<input type="number" maxLength="3" min="1" max="255" class="form-control" aria-describedby="sizing-addon1" name="tableCapacity" onChange={this.onChange} /></h4>
                            <h4>สถานะของการใช้โต็ะอาหาร<select class="selectpicker" name="tableStatus" onChange={this.onChange}>
                                <option></option>
                                <option value={1}>ว่าง</option>
                                <option value={2}>รอสั่งอาหาร</option>
                                <option value={3}>สั่งอาหารแล้ว</option>
                            </select></h4>
                            <h4>สถานะของโต็ะอาหาร<select class="selectpicker" name="useStatus" onChange={this.onChange}>
                                <option></option>
                                <option value={1}>ใช้งาน</option>
                                <option value={2}>ไม่ใช้งาน</option>
                            </select></h4>
                        </div>
                        <div class='bottom'>
                            <h4 class='search_methods'>วิธีการค้นหาที่นั้ง
                            <select class="selectpicker" name="dscAsc" onChange={this.onChange}>
                                    <option></option>
                                    <option value="<=">น้อยกว่าหรือเท่ากับ</option>
                                    <option value=">=">มากกว่าหรือเท่ากับ</option>
                                </select>
                            </h4>
                            <button type="button" class="btn btn-default navbar-btn" onClick={this.searchTable}>ค้นหา</button>
                        </div>
                    </div>
                    <div class="table-wrapper-scroll-y">
                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th class='stickytablesearch' scope="col">หมายเลขโต็ะ</th>
                                <th class='stickytablesearch' scope="col">จำนวนที่นั่ง</th>
                                <th class='stickytablesearch' scope="col">สถานะของการใช้โต็ะ</th>
                                <th class='stickytablesearch' scope="col">สถานะของโต็ะ</th>
                                <th class='stickytablesearch' scope="col">แก้ไข</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.data ? this.state.data.map((item, index) => (
                                    <tr>
                                        <td>{item.TABLE_NO}</td>
                                        <td>{item.TABLE_CAPACITY}</td>
                                        <td>{item.TABLE_STATUS_DESCRIPTION}</td>
                                        <td>{item.USE_STATUS_DESCRIPTION}</td>
                                        <td>
                                            <Link onClick={(e) => item.TABLE_STATUS !== '1' ? e.preventDefault() : ''} to={{
                                                pathname: "/Table",
                                                tableNo: item.TABLE_NO,
                                                tableCapacity: item.TABLE_CAPACITY,
                                                tableStatus: item.TABLE_STATUS,
                                                useStatus: item.USE_STATUS,
                                                flagEdit: true,
                                            }}><p data-placement="top" data-toggle="tooltip" title="Edit"><button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#edit" disabled={item.TABLE_STATUS !== '1'}><span class="glyphicon glyphicon-pencil"></span></button></p>
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (<tr></tr>)
                            }
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default TableSearch;