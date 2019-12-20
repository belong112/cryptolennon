import React, { Component } from 'react';

class Registerpage extends Component {
  constructor (props) {
    super(props);
    this.state = {       
      name: "",
      month: 1,
      year: 1900,
      day: 1
    };
  }

  namechange = (e) =>{
    this.setState({
      name:e.target.value
    })
  }

  monthchange = (e) =>{
    this.setState({
      month:e.target.value
    })
  }
  yearchange = (e) =>{
    this.setState({
      year:e.target.value
    })
  }
  daychange = (e) =>{
    this.setState({
      day:e.target.value
    })
  }

  onSubmit = () =>{
    const {name, year, month, day} = this.state
    this.props.handleregister(name, day, month, year)
  }



  render() {
    return (
      <div className="container">
        <div className="py-5 text-center">          
          <h4>申請帳號</h4>
          <p>與網頁互動前請先申請帳號，手續費需要0.01eth</p>
        </div>   
        <div className="col-5 mx-auto">  
          <div className="form-group">
            <label for="exampleInputEmail1">你的暱稱</label>
            <input className="form-control" id="exampleInputEmail1" value={this.state.name} onChange={this.namechange} maxlength="10" required/>
          </div>
          <label>你的生日</label>
          <div className="form-row">
            <div class="form-group col-4">
              <label for="exampleInputPassword1">年</label>
              <input type="number" min="1900" max="2100" class="form-control" id="exampleInputPassword1" value={this.state.year} onChange={this.yearchange} />
            </div>
            <div class="form-group col-4">
              <label for="exampleInputPassword1">月</label>
              <input type="number" min="1" max="12" class="form-control" id="exampleInputPassword1" value={this.state.month} onChange={this.monthchange} />
            </div>
            <div class="form-group col-4">
              <label for="exampleInputPassword1">日</label>
              <input type="number" min="1" max="31" class="form-control" id="exampleInputPassword1" value={this.state.day} onChange={this.daychange} />
            </div>
          </div>  
          <button onClick={this.onSubmit} className="btn btn-outline-secondary">創建帳號</button>
        </div>
      </div>      
    );
  }
}
export default Registerpage;