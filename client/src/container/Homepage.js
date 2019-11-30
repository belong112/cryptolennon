import React, { Component } from 'react';
import {NavLink} from "react-router-dom";

import test1 from "../img/flag.jpg"

class Homepage extends Component {
  render() {
    var sectionStyle = {
      width: "100%",
      backgroundImage: `url(${test1})`,
      backgroundPosition: "center 10%", 
      backgroundSize:"100%",
    };
    return (
      <div className='container'>
        <div class="nav-scroller py-1 mb-2 bg-white">
          <nav class="nav d-flex justify-content-between">
            <a class="p-2 text-muted" href="#">World</a>
            <a class="p-2 text-muted" href="#">U.S.</a>
            <a class="p-2 text-muted" href="#">Technology</a>
            <a class="p-2 text-muted" href="#">Design</a>
            <a class="p-2 text-muted" href="#">Culture</a>
            <a class="p-2 text-muted" href="#">Business</a>
            <a class="p-2 text-muted" href="#">Politics</a>
            <a class="p-2 text-muted" href="#">Opinion</a>
            <a class="p-2 text-muted" href="#">Science</a>
            <a class="p-2 text-muted" href="#">Health</a>
            <a class="p-2 text-muted" href="#">Style</a>
            <a class="p-2 text-muted" href="#">Travel</a>
          </nav>
        </div>
        <div className='bg-light pb-5 px-2'>
        	<div class="jumbotron p-4 p-md-5 text-white rounded bg-dark" style={sectionStyle}>
            <div class="col-md-6 px-0 text-left">
              <p class="lead my-3">發燒話題</p>
              <h4 className='text-danger'>Politics</h4>
              <h1 class="display-4 ">你支持一國兩制嗎?</h1>            
              <p class="lead mb-0"><NavLink className="text-white font-weight-bold" to="/commentboard">進入討論區</NavLink></p>
            </div>
          </div>
          <div class="row mb-2">
          <div class="col-md-6">
            <div class="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
              <div class="col p-4 d-flex flex-column position-static">
                <strong class="d-inline-block mb-2 text-primary">World</strong>
                <h3 class="mb-0">Featured post</h3>
                <div class="mb-1 text-muted">Nov 12</div>
                <p class="card-text mb-auto">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
                <NavLink to="/commentboard">go to commentboard</NavLink>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
              <div class="col p-4 d-flex flex-column position-static">
                <strong class="d-inline-block mb-2 text-success">Design</strong>
                <h3 class="mb-0">Post title</h3>
                <div class="mb-1 text-muted">Nov 11</div>
                <p class="mb-auto">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
                <NavLink to="/commentboard">go to commentboard</NavLink>
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
            <a href="#" class="d-flex justify-content-between align-items-center list-group-item list-group-item-action">
              [政治] 你支持郭台銘參選嗎?
              <span class="badge badge-danger badge-pill">124</span>
            </a>
            <a href="#" class="d-flex justify-content-between align-items-center list-group-item list-group-item-action">[法律] 你支持廢除死刑嗎?<span class="badge badge-primary badge-pill">22</span></a>
            <a href="#" class="d-flex justify-content-between align-items-center list-group-item list-group-item-action">[法律] 你支持吃香菜入罪嗎?<span class="badge badge-secondary badge-pill">12</span></a>
            <a href="#" class="d-flex justify-content-between align-items-center list-group-item list-group-item-action">[法律] 你支持一夫多妻制嗎?<span class="badge badge-secondary badge-pill">9</span></a>
          </div>        
        </div>
      </div>
    </div>
    );
  }
}
export default Homepage;