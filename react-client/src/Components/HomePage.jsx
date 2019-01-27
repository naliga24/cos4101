import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';

class HomePage extends Component {
  render() {
    if (!sessionStorage.getItem("token")){ return (<Redirect to={'/'} />) }
    return (
      <div class='outer'>
      </div>
    )
  }
}
export default HomePage;