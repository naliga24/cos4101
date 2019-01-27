import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { database } from './../Prototype/database.js'
import { login } from './../Prototype/login.js'
class FoodSearch extends Component {
    constructor() {
        super();
        this.state = {
            foodCode: '',
            foodName: '',
            foodPrice: '',
            dscAsc: '',
            data: '',
        };
        this.searchFood = this.searchFood.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    searchFood() {
        var tmp = new database()
        tmp.callSearchFood(this.state) 
        window.setTimeout(() => {
            this.setState({data:tmp.food.data})
            this.state.data.length === 0 && alert('ไม่พบข้อมูลที่ค้นหา')
        }, 1000);
        var log = new login()
        log.writeLogLogout('7')
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
        console.log(this.state)
    }
    render() {
        if (!sessionStorage.getItem("token")) { return (<Redirect to={'/'} />) }
        return (
            <div class='outer'>
                <div class="alert alert-info" role="alert" id='header_product'><h3>การจัดการฐานข้อมูล > อาหาร</h3></div>
                <form class='product_search'>
                    <div class='button'>
                        <button type="button" class="btn btn-default navbar-btn disabled">เพิ่มข้อมูล</button>
                        <button type="button" class="btn btn-default navbar-btn disabled">บันทึกข้อมูล</button>
                        <button type="button" class="btn btn-default navbar-btn">ค้นหาข้อมูล</button>
                    </div>

                    <div class='status'>
                        <div class='top'>
                            <h4>รหัสสินค้า<input type="number" maxLength="5" min="0" max="99999" class="form-control" aria-describedby="sizing-addon1" name="foodCode" onChange={this.onChange} /></h4>
                            <h4>ชื่ออาหาร<input type="text" maxLength="30" class="form-control" aria-describedby="sizing-addon1" name="foodName" onChange={this.onChange} /></h4>
                        </div>
                        <div class='bottom'>
                            <h4>ราคาอาหาร<input type="number" maxLength="4" min="1" max="9999" class="form-control" aria-describedby="sizing-addon1" name="foodPrice" onChange={this.onChange} /></h4>
                            <h4 id='search_methods'>วิธีการค้นหาราคา
                            <select class="selectpicker" onChange={this.onChange} name="dscAsc">
                                    <option></option>
                                    <option value="<=">น้อยกว่าหรือเท่ากับ</option>
                                    <option value=">=">มากกว่าหรือเท่ากับ</option>
                                </select>
                            </h4>


                            <button type="button" class="btn btn-default navbar-btn" onClick={this.searchFood}>ค้นหา</button>
                        </div>
                    </div>
                    <div class="table-wrapper-scroll-y">
                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th class='stickyfoodsearch' scope="col">รหัสสินค้า</th>
                                <th class='stickyfoodsearch' scope="col">ประเภท</th>
                                <th class='stickyfoodsearch' scope="col">ชื่ออาหาร</th>
                                <th class='stickyfoodsearch' scope="col">ราคา</th>
                                <th class='stickyfoodsearch' scope="col">สถานะ</th>
                                <th class='stickyfoodsearch' scope="col">แก้ไข</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.data ? this.state.data.map((item, index) => (
                                    <tr>
                                        <td>{item.FOOD_CODE}</td>
                                        <td>{item.FOOD_TYPE_DESCRIPTION}</td>
                                        <td>{item.FOOD_NAME}</td>
                                        <td>{item.FOOD_PRICE}</td>
                                        <td>{item.USE_STATUS_DESCRIPTION}</td>
                                        <td>
                                            <Link to={{
                                                pathname: "/Food",
                                                foodCode: item.FOOD_CODE,
                                                foodType: item.FOOD_TYPE,
                                                foodName: item.FOOD_NAME,
                                                foodPrice: item.FOOD_PRICE,
                                                foodStatus: item.FOOD_STATUS,
                                                flagEdit: true,
                                            }}><p data-placement="top" data-toggle="tooltip" title="Edit"><button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#edit"><span class="glyphicon glyphicon-pencil"></span></button></p>
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (<td></td>)
                            }
                        </tbody>
                    </table>
                    </div>
                </form>
            </div>
        );
    }
}

export default FoodSearch;