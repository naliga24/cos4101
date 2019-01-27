import { user } from './user.js'
import { food } from './food.js'
import { table } from './table.js'
const request = require('superagent')

export class database {
  constructor() {

  }

  callAddTable(tableCapacity, useStatus,clear) {
    this.table = new table()
    this.table.addTable(tableCapacity, useStatus,clear)
  }

  callEditTable(tableNo, tableCapacity, useStatus,clear) {
    this.table = new table()
    this.table.editTable(tableNo, tableCapacity, useStatus,clear)
  }

  callAddUser(state, userName,clear) {
    this.user = new user()
    this.user.addUser(state, userName,clear)
  }

  callEditUser(state, setCurrentDate,clear) {
    this.user = new user()
    this.user.editUser(state, setCurrentDate,clear)
  }
  
  callAddFood(foodType, foodName, foodPrice, foodStatus,clear) {
    this.food = new food()
    this.food.addFood(foodType, foodName, foodPrice, foodStatus,clear)
  }

  callEditFood(foodCode, foodType, foodName, foodPrice, foodStatus,clear) {
    this.food = new food()
    this.food.editFood(foodCode, foodType, foodName, foodPrice, foodStatus,clear)
  }

  callSearchFood(state){
    this.food = new food()
    this.food.searchFood(state)
  }

  callSearchTable(state){
    this.table = new table()
    this.table.searchTable(state)
  }

  callSearchUser(state){
    this.user = new user()
    this.user.searchUser(state)
  }
  
  callCheckFoodName(foodName){
    this.food = new food()
    this.food.checkFoodName(foodName)
  }

  callCheckUserLogin(userLogin){
    this.user = new user()
    this.user.checkUserLogin(userLogin)
  }

}