import React, { Component } from 'react';
import {NavLink, Link} from "react-router-dom";

class Header extends Component {
  render() {
    if(this.props.user.name === "")
    return (
    	<header className="blog-header py-3  bg-dark text-white">
        <div className="row flex-nowrap justify-content-between align-items-center">
          <div className="col-4 pt-1">
            <span>你好，陌生人</span>
          </div>
          <div className="col-4 text-center">
            <h3 className="blog-header-logo">Crypto-LennonWall</h3>
          </div>
          <div className="col-4">
            <Link to="/user">
              <span style={{color:'white'}}>
                <span className="pr-4">register</span>
              </span>              
            </Link>
            <Link to="/">
              <span style={{color:'white'}}>
                <i className="fas fa-home"></i>
              </span>              
            </Link>
          </div>
        </div>
      </header>
    );
    else
      return(
        <header className="blog-header py-3  bg-dark text-white">
          <div className="row flex-nowrap justify-content-between align-items-center">
            <div className="col-4 pt-1">
              <span>早安  {this.props.user.name}</span>
            </div>
            <div className="col-4 text-center">
              <h3 className="blog-header-logo">Crypto-LennonWall</h3>
            </div>
            <div className="col-4">
              <NavLink to="/user">
                <span style={{color:'white'}}>
                  <i className="fas fa-user pr-4"></i>
                </span>              
              </NavLink>
              <Link to="/">
                <span style={{color:'white'}}>
                  <i className="fas fa-home"></i>
                </span>              
              </Link>
            </div>
          </div>
        </header>
      );
  }
}
export default Header;