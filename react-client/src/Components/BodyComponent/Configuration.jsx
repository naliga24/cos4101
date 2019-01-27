import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { configuration } from './../Prototype/configuration.js'
import { login } from './../Prototype/login.js'

class Configuration extends Component {
    constructor() {
        super();
        this.state = {
            input: {
                queue: null,
                order: null,
                payment: null,
                cooking: null,
                database: null,
                report: null,
                admin: null,
            },
            data: null,
            data1: null,
            userTypeNo: null,
            userTypeName: null,
            inputDisable: true,
        };
        this.saveConfiguration = this.saveConfiguration.bind(this)
        this.edit = this.edit.bind(this)
    }

    componentWillMount() {
        this.selectUserTypeInfo()
    }

    selectUserTypeInfo() {
        var tmp = new configuration()
        tmp.callListPermission()
        window.setTimeout(() => {
            this.setState({ data: tmp, data1: tmp.data1.data })
        }, 1000);
    }

    saveConfiguration() {
        var permission = '';
        var tmp = [this.state.queue, this.state.order, this.state.payment, this.state.cooking, this.state.database, this.state.report, this.state.admin, this.state.userTypeNo]
        for (var i = 0; i <= 6; i++) {
          if (tmp[i]) {
            permission += '1'
          } else {
            permission += '0'
          }
        }
        if (permission[0] === '1' || permission[1] === '1' || permission[2] === '1' || permission[3] === '1' || permission[4] === '1' || permission[5] === '1') {
            this.state.data.editUserType(permission,this.state.userTypeNo)
            alert(`แก้ไขสิทธิ์ในการเข้าใช้งานของ "${this.state.userTypeName}" เรียบร้อย`)
            this.selectUserTypeInfo()
            this.setState({ queue: null, order: null, payment: null, cooking: null, database: null, report: null ,inputDisable:true})
    
        } else {
          alert('ต้องกำหนดสิทธิ์ในการเข้าใช้งานอย่างน้อย 1 เมนู')
        }
        var log = new login()
        log.writeLogLogout('10')
    }

    edit(index) {
        var tmp = this.state.data1[index].USER_TYPE_PERMISSION
        let i = 0
        for (var obj in this.state.input) {
            if (tmp[i] === '1') {
                this.setState({ [obj]: true })
            } else if (tmp[i] === '0') {
                this.setState({ [obj]: false })
            }
            i += 1
        }
        var x = document.getElementById("userTypeName")
        x.value = this.state.data1[index].USER_TYPE_NAME
        this.setState({ userTypeNo: this.state.data1[index].USER_TYPE_NO, userTypeName: this.state.data1[index].USER_TYPE_NAME, inputDisable: false })
    }
    
    render() {
        if (!sessionStorage.getItem("token")) { return (<Redirect to={'/'} />) }
        return (
            <div class='outer'>
                <div class="alert alert-info" role="alert" id='header_product'><h3>การตั่งค่า</h3></div>
                <div class='configuration'>
                    <div class='button'>
                        <button type="submit" class="btn btn-default navbar-btn" onClick={this.saveConfiguration} disabled={this.state.inputDisable} >บันทึกข้อมูล</button>
                    </div>

                    <div class='status'>
                        <div id='top'>
                            <h4>ประเภทผู้ใช้งาน<input type="text" class="form-control" aria-describedby="sizing-addon1" id="userTypeName" disabled /></h4>
                            <li class="list-group-item">
                                <input type="checkbox" checked={this.state.queue} onClick={() => { this.setState({ queue: !this.state.queue }) }} disabled={this.state.inputDisable} /><span>การจัดการคิว</span>
                            </li>
                            <li class="list-group-item">
                                <input type="checkbox" checked={this.state.order} onClick={() => { this.setState({ order: !this.state.order }) }} disabled={this.state.inputDisable} /><span>การสั่งอาหาร</span>
                            </li>
                            <li class="list-group-item">
                                <input type="checkbox" checked={this.state.payment} onClick={() => { this.setState({ payment: !this.state.payment }) }} disabled={this.state.inputDisable} /><span>การชำระเงิน</span>
                            </li>
                        </div>
                        <div id='bottom'>
                            <li class="list-group-item">
                                <input type="checkbox" checked={this.state.cooking} onClick={() => { this.setState({ cooking: !this.state.cooking }) }} disabled={this.state.inputDisable} /><span>การทำอาหาร</span>
                            </li>
                            <li class="list-group-item">
                                <input type="checkbox" checked={this.state.database} onClick={() => { this.setState({ database: !this.state.database }) }} disabled={this.state.inputDisable} /><span>การจัดการฐานข้อมูล</span>
                            </li>
                            <li class="list-group-item">
                                <input type="checkbox" checked={this.state.report} onClick={() => { this.setState({ report: !this.state.report }) }} disabled={this.state.inputDisable} /><span>รายงาน</span>
                            </li>
                        </div>
                    </div>
                    <div class="table-wrapper-scroll-y">
                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th scope="col">ลำดับที่</th>
                                <th scope="col">ประเภทผู้ใช้งานระบบ</th>
                                <th scope="col">แก้ไข</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.data1 ? this.state.data1.map((item, index) => (
                                    <tr>
                                        <th scope="row">{index + 1}</th>
                                        <td>{item.USER_TYPE_NAME}</td>
                                        <td onClick={() => this.edit(index)}><p data-placement="top" data-toggle="tooltip" title="Edit"><button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#edit" ><span class="glyphicon glyphicon-pencil"></span></button></p></td>
                                    </tr>
                                )) : (<p></p>)
                            }
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Configuration