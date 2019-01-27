import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { database } from './../Prototype/database.js'
import { login } from './../Prototype/login.js'

class Food extends Component {
    constructor(props) {
        super(props);
        this.state = {
            foodCode: this.props.location.foodCode,
            foodType: this.props.location.foodType,
            foodName: this.props.location.foodName,
            oldFoodName: this.props.location.foodName,
            foodPrice: this.props.location.foodPrice,
            foodStatus: this.props.location.foodStatus ? this.props.location.foodStatus : '1',
            flagEdit: this.props.location.flagEdit,
            buttonDisble: this.props.location.flagEdit,
            buttonDisble1: this.props.location.flagEdit,

        };
        this.saveFood = this.saveFood.bind(this)
        this.add = this.add.bind(this)
        this.clear = this.clear.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    saveFood() {
        if (this.state.foodType && this.state.foodName && this.state.foodPrice > '0' && this.state.foodStatus) {
            var tmp = new database()
            if (this.state.foodName !== this.state.oldFoodName) {
                tmp.callCheckFoodName(this.state.foodName)
                setTimeout(() => {
                    if (tmp.food.data2 === '0') {
                        if (this.state.flagEdit) {
                            tmp.callEditFood(this.state.foodCode, this.state.foodType, this.state.foodName, this.state.foodPrice, this.state.foodStatus, this.clear)
                            alert(`แก้ข้อมูลรายการอาหาร "${this.state.foodCode}" เรียบร้อย`)
                        } else {
                            tmp.callAddFood(this.state.foodType, this.state.foodName, this.state.foodPrice, this.state.foodStatus, this.clear)
                            alert(`เพิ่มข้อมูลสินค้าเรียบร้อย`)
                        }
                    } else if (tmp.food.data2 === '1' && this.state.flagEdit) {
                        alert(`ไม่สามารถแก้ไขข้อมูลรายการอาหาร "${this.state.foodName}" ชื่อมีในระบบแล้ว`)
                    }
                    else if (tmp.food.data2 === '1' && !this.state.flagEdit) {
                        alert(`ไม่สามารถเพิ่มข้อมูลรายการอาหาร "${this.state.foodName}" ชื่อมีในระบบแล้ว`)
                    }
                }, 300);
            } else if (this.state.flagEdit) {
                tmp.callEditFood(this.state.foodCode, this.state.foodType, this.state.foodName, this.state.foodPrice, this.state.foodStatus, this.clear)
                alert(`แก้ข้อมูลรายการอาหาร "${this.state.foodCode}" เรียบร้อย`)
            }
        } else if (!this.state.foodType) {
            alert("ไม่ได้ระบุประเภทอาหาร")
        } else if (!this.state.foodName) {
            alert("ไม่ได้ระบุชื่ออาหาร")
        } else if (!this.state.foodPrice || this.state.foodPrice <= '0') {
            alert("ราคาสินค้าต้องมีมูลค่ามากกว่า 0")
        }
        var log = new login()
        log.writeLogLogout('7')
    }

    add() {
        this.setState({ buttonDisble1: !this.state.buttonDisble1 });
    }

    clear() {
        this.setState({ buttonDisble1: !this.state.buttonDisble1, flagEdit: false, foodCode: '', foodName: '', foodPrice: '', foodType: '' })
        console.log('clear()')
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        if (!sessionStorage.getItem("token")) { return (<Redirect to={'/'} />) }
        return (
            <div class='outer'>
                <div class="alert alert-info" role="alert" id='header_product'><h3>การจัดการฐานข้อมูล > อาหาร</h3></div>
                <div class='product'>
                    <div class='button'>
                        <button type="button" class="btn btn-default navbar-btn" onClick={this.add} disabled={this.state.buttonDisble1}>เพิ่มข้อมูล</button>
                        <button type="submit" class="btn btn-default navbar-btn" onClick={this.saveFood} disabled={!this.state.buttonDisble1}>บันทึกข้อมูล</button>
                        <Link to="FoodSearch"><button type="button" class="btn btn-default navbar-btn">ค้นหาข้อมูล</button></Link>
                    </div>

                    <div class='status'>
                        <div class='top'>
                            <h4>รหัสสินค้า<input id='foodcode' value={this.state.foodCode} type="text" class="form-control" aria-describedby="sizing-addon1" placeholder="xxxxx" disabled /></h4>
                            <h4>ประเภทอาหาร
                                <select class="selectpicker" name="foodType" onChange={this.onChange} disabled={this.state.buttonDisble1 && this.state.flagEdit} required>
                                    <option></option>
                                    <option value='1' selected={this.state.foodType == '1' ? true : false}>อาหาร</option>
                                    <option value='2' selected={this.state.foodType == '2' ? true : false}>เครื่องดื่ม</option>
                                    <option value='3' selected={this.state.foodType == '3' ? true : false}>ของหวาน</option>
                                    <option value='4' selected={this.state.foodType == '4' ? true : false}>อื่นๆ</option>
                                </select>
                            </h4>
                            <h4>ชื่ออาหาร<input value={this.state.foodName} type="text" maxLength="30" class="form-control" aria-describedby="sizing-addon1" name="foodName" onChange={this.onChange} disabled={!this.state.buttonDisble1} required /></h4>
                        </div>
                        <div class='bottom'>
                            <h4 id='foodprice'>ราคาอาหาร<input id='foodprice' value={this.state.foodPrice} type="number" maxLength="4" min="1" max="9999" class="form-control" aria-describedby="sizing-addon1" name="foodPrice" onChange={this.onChange} disabled={!this.state.buttonDisble1} required /></h4>
                            <h4 id='foodstatus'>สถานะ
                                <select class="selectpicker" name="foodStatus" onChange={this.onChange} disabled={!this.state.buttonDisble}>
                                    <option value='1' selected={this.state.foodStatus == '1' ? true : false}>ใช้งาน</option>
                                    <option value='2' selected={this.state.foodStatus == '2' ? true : false}>ไม่ใช้งาน</option>
                                </select>
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Food;