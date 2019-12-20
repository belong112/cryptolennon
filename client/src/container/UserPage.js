import React, { Component } from 'react';

class Userpage extends Component {
  constructor (props) {
    super(props);
    this.state = {       
      name: this.props.user.name,
    };
  }

  namechange = (e) =>{
    this.setState({
      name:e.target.value
    })
  }

  onSubmit = () =>{
    const {name} = this.state
    console.log('we')
    this.props.handleAccountChange(name)
  }

  render() {
    return (
      <div className="container">
        <div className="py-5 text-center">          
          <h4>個人資訊</h4>
          <p>可隨時更改暱稱，手續費約為0.001eth</p>
        </div>   
        <div className="col-5 mx-auto">  
          <div className="form-group">
            <label for="exampleInputEmail1">你的暱稱</label>
            <input className="form-control" value={this.state.name} onChange={this.namechange} maxlength="10"/>
          </div>          
          <button onClick={this.onSubmit} className="btn btn-outline-secondary">更新</button>
        </div>
      </div>      
    );
  }
}
export default Userpage;