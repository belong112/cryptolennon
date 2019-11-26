import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
    	<header className="blog-header py-3">
          <div className="row flex-nowrap justify-content-between align-items-center">
            <div className="col-4 pt-1">
              <span className="text-muted">早安，{this.props.user.name}</span>
            </div>
            <div className="col-4 text-center">
              <h3 className="blog-header-logo text-dark">Crypto-LennonWall</h3>
            </div>
            <div className="col-4 d-flex justify-content-end align-items-center">              
              <a className="btn btn-sm btn-outline-secondary" href="#">Sign up</a>
            </div>
          </div>
        </header>
    );
  }
}
export default Header;