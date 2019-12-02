import React, { Component } from 'react';

class Userpage extends Component {
  constructor (props) {
    super(props);
    this.state = {       
      name: this.props.user.name,
      age: this.props.user.age,     
    };
  }

  namechange = (e) =>{
    this.setState({
      name:e.target.value
    })
  }
  agechange = (e) =>{
    this.setState({
      age:e.target.value
    })
  }

  render() {
    return (
      <div className="container">
        <div className="py-5 text-center">          
          <h4>個人資訊</h4>
          <p>可隨時更改，手續費為0.03eth</p>
        </div>   
        <div className="col-5 mx-auto">  
        <form >
          <div className="form-group">
            <label for="exampleInputEmail1">你的暱稱</label>
            <input className="form-control" id="exampleInputEmail1" value={this.state.name} onChange={this.namechange} maxlength="10"/>
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">歲數</label>
            <input type="number" min="1" max="150" class="form-control" id="exampleInputPassword1" value={this.state.age} onChange={this.agechange} />
          </div>  
          <button type="submit" className="btn btn-outline-secondary">更新</button>
        </form> 
        </div>
      </div>      
    );
  }
}
export default Userpage;