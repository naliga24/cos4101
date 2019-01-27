import React, { Component } from 'react';
import { login } from './../Prototype/login.js'
import { withRouter } from 'react-router-dom';
let auth = sessionStorage.getItem("token");

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: '0000000',
    }
  
    this.logout = this.logout.bind(this);
    this.clear = this.clear.bind(this);
    this.openPageQueue = this.openPageQueue.bind(this);
    this.openPageOrder = this.openPageOrder.bind(this);
    this.openPagePayment = this.openPagePayment.bind(this);
    this.openPageCooking = this.openPageCooking.bind(this);
    this.openPageFood = this.openPageFood.bind(this);
    this.openPageTable= this.openPageTable.bind(this);
    this.openPageUser = this.openPageUser.bind(this);
    this.openPageConfiguration = this.openPageConfiguration.bind(this);
    this.openPageReport = this.openPageReport.bind(this);
  }

  componentWillMount() {
    var tmp = new login()
    if(auth){
      tmp.callSetPermission() 
      this.setState({ data: tmp.data2.data })
    }
  }

  logout() {
    var tmp = new login()
    tmp.writeLogLogout('2') 
  }

  clear(){
    this.setState({ data: '0000000' });
    sessionStorage.removeItem("token")
    this.props.history.push('/');
  }

  openPageQueue() {
    this.props.history.push('/Queue');
  }

  openPageOrder() {
    this.props.history.push('/Order');
  }

  openPagePayment() {
    this.props.history.push('/Payment');
  }

  openPageCooking() {
    this.props.history.push('/Cooking');
  }

  openPageFood() {
    this.props.history.push('/Food');
  }

  openPageTable() {
    this.props.history.push('/Table');
  }

  openPageUser() {
    this.props.history.push('/User');
  }

  openPageReport() {
    this.props.history.push('/Report');
  }

  openPageConfiguration() {
    this.props.history.push('/Configuration');
  }

  render() {
    return (
      <div class="container">
      <nav class="navbar navbar-light">
          <ul class="nav nav-tabs">
            {this.state.data ? this.state.data[0] === '1' ?  (<li class="nav-item" style={linkStyle} role="presentation" onClick={this.openPageQueue}> <a class="nav-link" href="#">การจัดการคิว</a></li>) : (<li></li>) : (<li></li>)}
            {this.state.data ? this.state.data[1] === '1' ? (<li class="nav-item" style={linkStyle} role="presentation" onClick={this.openPageOrder}> <a class="nav-link" href="#">การสั่งอาหาร</a></li>) : (<li></li>) : (<li></li>)}
            {this.state.data ? this.state.data[2] === '1' ? (<li class="nav-item" style={linkStyle} role="presentation" onClick={this.openPagePayment}><a class="nav-link" href="#">การชำระเงิน</a></li>) : (<li></li>) : (<li></li>)}
            {this.state.data ? this.state.data[3] === '1' ? (<li class="nav-item" style={linkStyle} role="presentation" onClick={this.openPageCooking}><a class="nav-link" href="#">การทำอาหาร</a></li>) : (<li></li>) : (<li></li>)}
            {this.state.data ? this.state.data[4] === '1' ? (<li class="nav-item" style={linkStyle} role="presentation">
              <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                การจัดการฐานข้อมูล <span class="caret"></span>
              </a>
              <ul class="dropdown-menu">
                <li class="dropdown-item" href="#" style={linkStyle} role="presentation" onClick={this.openPageFood}><a style={linkStyle} class="navbar-link" href="#">อาหาร</a></li>
                <li class="dropdown-item" href="#" style={linkStyle} role="presentation" onClick={this.openPageTable}><a style={linkStyle} class="nav-link" href="#">โต๊ะอาหาร</a></li>
                <li class="dropdown-item" href="#" style={linkStyle} role="presentation" onClick={this.openPageUser}><a style={linkStyle} class="nav-link" href="#">ผู้ใช้งานระบบ</a></li>
              </ul>
            </li>) : (<li></li>) : (<li></li>)}
            {this.state.data ? this.state.data[5] === '1' ? (<li class="nav-item" style={linkStyle} role="presentation" onClick={this.openPageReport}><a class="nav-link" href="#">รายงาน</a></li>) : (<li></li>) : (<li></li>)}
            {this.state.data ? this.state.data[6] === '1' ? (<li class="nav-item" style={linkStyle} role="presentation" onClick={this.openPageConfiguration}><a class="nav-link" href="#">การตั้งค่า</a></li>) : (<li></li>) : (<li></li>)}
            {this.state.data !== '0000000' ? (<li class="nav-item" style={linkStyle} role="presentation" onClick={()=>{this.logout();this.clear()}}><a class="nav-link" href="#">ออกจากระบบ</a></li>) : (<li></li>)}
          </ul>
      </nav>
      </div>
    )
  }
}

var linkStyle = {
  color: "#777",
  fontWeight: "bold",
  textDecorationLine: "none",
  letterSpacing: 0.25,
};

export default withRouter(NavBar);