import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { browserHistory } from 'react-router';
import HomePage from './HomePage';
import NavBar from './HeaderComponent/NavBar';
import Footer from './FooterComponent/Footer';
import Login from './BodyComponent/Login';
import Queue from './BodyComponent/Queue';
import QueueManage from './BodyComponent/QueueManage';
import QueueReserve from './BodyComponent/QueueReserve';
import Order from './BodyComponent/Order';
import Payment from './BodyComponent/Payment';
import PaymentSearch from './BodyComponent/PaymentSearch';
import Cooking from './BodyComponent/Cooking';
import Food from './BodyComponent/Food';
import FoodSearch from './BodyComponent/FoodSearch';
import Table from './BodyComponent/Table';
import TableSearch from './BodyComponent/TableSearch';
import User from './BodyComponent/User';
import UserSearch from './BodyComponent/UserSearch';
import Configuration from './BodyComponent/Configuration';
import Report from './BodyComponent/Report';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <NavBar />
          <Route name="login" exact path="/" component={Login} />
          <Route name="home" exact path="/HomePage" component={HomePage} />
          <Route name="queue" exact path="/Queue" component={Queue} />
          <Route name="queueManage" exact path="/QueueManage" component={QueueManage} />
          <Route name="queueReserve" exact path="/QueueReserve" component={QueueReserve} />
          <Route name="order" exact path="/Order" component={Order} />
          <Route name="payment" exact path="/Payment" component={Payment} />
          <Route name="paymentSearch" exact path="/PaymentSearch" component={PaymentSearch} />
          <Route name="cooking" exact path="/Cooking" component={Cooking} />
          <Route name="food" exact path="/Food" component={Food} />
          <Route name="foodSearch" exact path="/FoodSearch" component={FoodSearch} />
          <Route name="Table"  path="/Table" component={Table} />
          <Route name="TableSearch" path="/TableSearch" component={TableSearch} />
          <Route name="user" exact path="/User" component={User} />
          <Route name="userSearch" exact path="/UserSearch" component={UserSearch} />
          <Route name="configuration" exact path="/Configuration" component={Configuration} />
          <Route name="report" exact path="/Report" component={Report} />
          <Footer />
        </div>
      </Router>
    )
  }
}
export default App;