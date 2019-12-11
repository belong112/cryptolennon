import React, { Component } from "react";

import PostIt from "../components/PostIt.js";

import "../App.css";


let items = []
class CommentBoard extends Component {
   constructor (props) {
    super(props);
    this.state = { 
      web3: this.props.web3,
      accounts: this.props.accounts,
      contract: this.props.contract,
      comments: [],
      question: "",
      textarea: "",
      agree: null,
      user: {
        name:"鄭伊人",
        age: 22,
        history:[ // record user's respond to each comment
          {id:'1574752132567',respond:'positive'},
        ]
      },
      
    };
  }

  componentDidMount = async () => {
    const {contract,accounts} = this.state
    const q_id = this.props.id
    try {
      // get question
      var temp = await contract.methods.get_question(q_id).call()
      const question = {
        genre: 'Life',
        title: temp[0].toString(),
        subtitle: 'N/A'
      }

      // get reply
      var l = await contract.methods.get_reply_length(q_id).call()

      var temparray= []
      for (var i = 0; i < l; i++) {
        temp = await contract.methods.get_reply(q_id, i).call({from: accounts[0]})
        const newitem = {
          id: i.toString(),
          comment: temp[0].toString(),
          endorse: temp[1],
          time: temp[2],
          owner_id: temp[3],
          num_likes: temp[4],
        }
        temparray.push(newitem)
      }

      this.setState({
        question: question,
        comments: temparray
      })

    } catch (error) {
      alert( error );
    }
  };

  handleSelectOnchange = (e)=>{
    var temparray = []
    if(e.target.value === 'support')
      temparray = items.filter((item)=>{
        return item.agree === 'y';       // 取得大於五歲的
      });
    else if(e.target.value === 'oppose')
      temparray = items.filter((item)=>{
        return item.agree === 'f';       // 取得大於五歲的
      });
    else if(e.target.value === 'all')
      temparray = items
    else if(e.target.value === 'time'){
      temparray = items.concat().sort((a, b) => (a.id) - (b.id));
    }
    else if(e.target.value === 'likes'){
      temparray = items.concat().sort((a, b) => (b.respond.positive) - (a.respond.positive));
    }
    this.setState({
      comments:temparray
    })
  }

  handleTxtOnchange = (e) =>{
    this.setState({
      textarea: e.target.value
    })
  }

  handleRadio = (e) =>{
    this.setState({
      agree: e.target.value
    })
  }

  onSubmit = () => {
    const {textarea,agree,user} = this.state
    if (textarea === "")
      alert("你還沒寫下意見")
    else if (agree === null)
      alert('你還沒選擇支持或反對')
    else  
      items.unshift({
        id: 15000 + (Math.random() * (1000)),
        agree:agree,
        text:textarea,
        name:user.name,
        age:user.age,
        color: agree === 'f' ? 'pink' : 'green',
        respond:{
            "positive":0,
            "negative":0
          }
      });
    
    this.setState({
      agree:null,
      textarea:""
    });
  }

  handleCommentRespond = (id,respond) => {
    const {user} = this.state;
    const index = user.history.findIndex(item => item.id === id);
    const item = user.history[index];
    const index2 = items.findIndex(item2 => item2.id === id);
    const item2 = items[index2] 

    if (!item) {    // Not yet responded before
      user.history.push({
        id:id,
        respond:respond,
      });
      if (respond === 'positive')
        item2.respond.positive += 1;
      else
        item2.respond.negative += 1;
    } 
    else {
      if (item.respond === respond) {   // 收回
        item.respond = null;
        if (respond === 'positive')
          item2.respond.positive -= 1;
        else
          item2.respond.negative -= 1;
      } 
      else if(item.respond === null){  // 原本無
        item.respond = respond;
        if (respond === 'positive')
          item2.respond.positive += 1;
        else
          item2.respond.negative += 1;
      }
      else{                           //交換
        item.respond = respond;
        if (respond === 'positive'){
          item2.respond.positive += 1;
          item2.respond.negative -= 1;
        }else{
          item2.respond.negative += 1;
          item2.respond.positive -= 1;
        }
      }
      user.history.splice(index,1,item);
    } 

    this.setState({
      user:user,
      comments:items
    });   
  }

  render() {
    const { comments,user,question,contract } = this.state;
    const postIts = comments.map((item,index) =>{
      // const i = user.history.findIndex(userhistory => userhistory.id === item.id);
      // var myRespond = null
      // if(i>=0) myRespond = user.history[i].respond
        return(
          <PostIt contract={contract} item={item} handleCommentRespond={(i,respond) => this.handleCommentRespond(i,respond)} respond={''}/>
        )
    })

    return (
      <div className='container bg-light pb-5 pt-4'>
        <div> 
          <h6>每日一問:</h6>       
          <h1>{question.title}?</h1>
          <h6>{question.subtitle}</h6>
          <hr/>   
          <div className="input-group mb-3 col-4">
            <div className="input-group-prepend">
              <label className="input-group-text" for="inputGroupSelect01">排序</label>
            </div>
            <select className="custom-select" id='inputGroupSelect01' onChange={this.handleSelectOnchange}>
              <option value='all' selected>全部</option>
              <option value="time">照時間</option>
              <option value='likes'>照讚數</option>
            </select>
          </div>
          <div className="row">
            {postIts}
          </div>

          <div className="border p-2 m-2">
            <h3>發表你的看法吧</h3>
            <div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name='agree' value='y' onChange={this.handleRadio} checked={this.state.agree === 'y'} />
                <label className="form-check-label text-success" for="inlineRadio1">支持</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name='agree' value='f' onChange={this.handleRadio} checked={this.state.agree === 'f'}/>
                <label className="form-check-label text-danger" for="inlineRadio2">反對</label>
              </div>
               <div className="form-group">
                <textarea className="form-control" value={this.state.textarea} onChange={this.handleTxtOnchange} placeholder="寫些什麼..." rows="3"></textarea>
              </div>  
              <button onClick={this.onSubmit} className="btn btn-primary">submit</button>          
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CommentBoard;
