import React, { Component } from 'react';
import {NavLink, Link} from "react-router-dom";

import test1 from "../img/flag.jpg"

import data from "../data.js"


let questions = data.questions
let items = data.items
class Homepage extends Component {
   constructor (props) {
    super(props);
    this.state={
      genre: "",
      textarea: "",
      subtitle: "",
    }
  }

   handleTxtOnchange = (e) =>{
    this.setState({
      textarea: e.target.value
    })
  }

  handleSubOnchange = (e) =>{
    this.setState({
      subtitle: e.target.value
    })
  }
  handleSelecctOnchange = (e) =>{
    this.setState({
      genre: e.target.value
    })
  }

  onSubmit = () =>{
    const {genre, textarea, subtitle} = this.state
    questions.push({
      id: 140000 + (Math.random() * (10000)),
      genre: genre,
      title:textarea,
      subtitle:subtitle,
      num_comments:0
    });
    items.push([])
    this.setState({
      subtitle:"",
      textarea:""
    });
  }

  render() {
    const questionArray = questions.map((item,index) =>{
      var q = "["+(item.genre)+"] "+(item.title)
      return(
        <Link to={"/commentboard/"+(index)} className="d-flex justify-content-between align-items-center list-group-item list-group-item-action">{q}<span className={"badge badge-pill "+(item.num_comments > 10 ? 'badge-danger':'badge-secondary')}>{item.num_comments}</span></Link>
      )
    })

    var sortarray = questions.concat().sort((b, a) => (a.num_comments) - (b.num_comments));

    var sectionStyle = {
      width: "100%",
      backgroundImage: `url(${test1})`,
      backgroundPosition: "center 10%", 
      backgroundSize:"100%",
    };

    return (
      <div className='container'>
        <div class="nav-scroller py-1 mb-2 bg-white">
          
        </div>
        <div className='bg-light pb-5 px-2'>
        	<div class="jumbotron p-4 p-md-5 text-white rounded bg-dark" style={sectionStyle}>
            <div class="col-md-6 px-0 text-left">
              <p class="lead my-3">發燒話題</p>
              <h4 className='text-danger'>{sortarray[0].genre}</h4>
              <h1 class="display-4 ">{sortarray[0].title}</h1>         
              <p class="lead mb-0"><NavLink className="text-white font-weight-bold" to={"/commentboard/"+(sortarray[0].id)}>進入討論區</NavLink></p>
            </div>
          </div>
          <div class="row mb-2">
          <div class="col-md-6">
            <div class="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
              <div class="col p-4 d-flex flex-column position-static">
                <strong class="d-inline-block mb-2 text-primary">{sortarray[1].genre}</strong>
                <h3 class="mb-0">{sortarray[1].title}</h3>
                <div class="mb-1 text-muted">Nov 12</div>
                <p class="card-text mb-auto">{sortarray[1].subtitle}</p>
                <Link to={"/commentboard/"+(sortarray[1].id)}>go to commentboard</Link>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
              <div class="col p-4 d-flex flex-column position-static">
                <strong class="d-inline-block mb-2 text-success">{sortarray[2].genre}</strong>
                <h3 class="mb-0">{sortarray[2].title}</h3>
                <div class="mb-1 text-muted">Nov 11</div>
                <p class="mb-auto">{sortarray[2].subtitle}</p>
                <NavLink to={"/commentboard/"+(sortarray[2].id)}>go to commentboard</NavLink>
              </div>
              <div class="col-auto d-none d-lg-block">
                <svg class="bd-placeholder-img" width="200" height="250" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div>
            <h3>其他主題</h3>
          </div>
          <div className="list-group text-left">
            {questionArray}
          </div>        
        </div>
        <hr/>
        <div className='mt-5'>
          <h3>我要提問</h3>
          <div class="form-group">
            <label for="Select1">選擇主題</label>
            <select class="form-control" id="Select1" onChange={this.handleSelecctOnchange}>
              <option>-</option>
              <option value='Life'>Life</option>
              <option value='Politics'>Politics</option>
            </select>
          </div>
          <div class="form-group">
            <label>問題</label>
            <input type="text" className="form-control" onChange={this.handleTxtOnchange} value={this.state.textarea} />
          </div>
          <div class="form-group">
            <label>副標題</label>
            <input type="text" className="form-control"  onChange={this.handleSubOnchange} value={this.state.subtitle} />
          </div>  
          <p className='text-danger'>註 : 此動作需要約0.3eth</p>
          <button onClick={this.onSubmit} className="btn btn-primary">送出</button> 
        </div>
      </div>
    </div>
    );
  }
}
export default Homepage;