import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { database } from './../Prototype/database.js'
import { login } from './../Prototype/login.js'

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableNo: this.props.location.tableNo,
            tableCapacity: this.props.location.tableCapacity,
            useStatus: this.props.location.useStatus ? this.props.location.useStatus : '2',
            flagEdit: this.props.location.flagEdit,
            buttonDisble: this.props.location.flagEdit,
            buttonDisble1: this.props.location.flagEdit,
        };
        this.saveTable = this.saveTable.bind(this)
        this.add = this.add.bind(this)
        this.clear = this.clear.bind(this)
        this.onChange = this.onChange.bind(this)
    }
    saveTable() {
        if (this.state.tableCapacity > '0' && this.state.useStatus) {
            var tmp = new database()
            if (this.state.flagEdit) {
                tmp.callEditTable(this.state.tableNo, this.state.tableCapacity, this.state.useStatus, this.clear)
                alert(`แก้ข้อมูลโต๊ะอาหาร "${this.state.tableNo}" เรียบร้อย`)
            } else {
                tmp.callAddTable(this.state.tableCapacity, this.state.useStatus, this.clear)
                alert(`เพิ่มข้อมูลโต๊ะอาหารเรียบร้อย`)
            }
        } else if (!this.state.tableCapacity || this.state.tableCapacity <= '0') {
            alert("จำนวนที่นั่งต้องมีค่ามากกว่า 0")
        }
        var log = new login()
        log.writeLogLogout('8')
    }
    add() {
        this.setState({ buttonDisble1: !this.state.buttonDisble1 });
    }
    clear() {
        this.setState({ tableCapacity: '' })
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        if (!sessionStorage.getItem("token")) { return (<Redirect to={'/'} />) }
        return (
            <div class='outer'>
                <div class="alert alert-info" role="alert" id='header_product'><h3>การจัดการฐานข้อมูล > โต็ะอาหาร</h3></div>
                <form class='table'>
                    <div class='button' onClickCapture={this.add} >
                        <button type="button" class="btn btn-default navbar-btn" onClick={this.add} disabled={this.state.buttonDisble1}>เพิ่มข้อมูล</button>
                        <button type="submit" class="btn btn-default navbar-btn" onClick={this.saveTable} disabled={!this.state.buttonDisble1}>บันทึกข้อมูล</button>
                        <Link to="TableSearch" ><button type="button" class="btn btn-default navbar-btn">ค้นหาข้อมูล</button></Link>
                    </div>

                    <div class='status'>
                        <div class='top'>
                            <h4>หมายเลขโต็ะ<input value={this.state.tableNo} id="tableNo" type="text" class="form-control" aria-describedby="sizing-addon1" name="tableNo" onChange={this.onChange} placeholder="xxx" disabled required /></h4>
                            <h4>จำนวนที่นั่ง<input value={this.state.tableCapacity} id="tableCapacity" type="number" maxLength="3" min="1" max="255" class="form-control" aria-describedby="sizing-addon1" name="tableCapacity" onChange={this.onChange} disabled={!this.state.buttonDisble1} required /></h4>
                            <h4>สถานะของการใช้โต็ะอาหาร<input class="form-control" aria-describedby="sizing-addon1" placeholder="ว่าง" disabled /></h4>
                            <h4>สถานะของโต็ะอาหาร<select class="selectpicker" name="useStatus" onChange={this.onChange} disabled={!this.state.buttonDisble} required>
                                <option value='2' selected={this.state.useStatus == '2' ? true : false}>ไม่ใช้งาน</option>
                                <option value='1' selected={this.state.useStatus == '1' ? true : false}>ใช้งาน</option>
                            </select></h4>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Table;