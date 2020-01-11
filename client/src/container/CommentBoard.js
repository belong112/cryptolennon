import React, { Component } from "react";

import PostIt from "../components/PostIt.js";
import swal from 'sweetalert2';

import {getDateTime} from "../utils/utils.js";

import "../App.css";

class CommentBoard extends Component {
   constructor (props) {
    super(props);
    this.state = { 
      web3: this.props.web3,
      accounts: this.props.accounts,
      contract: this.props.contract,
      comments: [],  // 真實資料
      currentarray: [],  // filter後的
      question: "",
      textarea: "",
      agree: 'y',
      user: this.props.user
      
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
        q_id: q_id,
        title: temp[0].toString(),
        subtitle: temp[1].toString(),
        imghash: temp[2].toString(),
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
          num_likes: parseInt(temp[4]),
        }
        temparray.push(newitem)
      }

      this.setState({
        question: question, //問題(data)
        comments: temparray, //回復(data)
        currentarray: temparray //當前頁面上的回覆
      })

    } catch (error) {
      alert( error );
    }
  };

  handleSelectOnchange = (e)=>{
    const {comments} = this.state
    var temparray = []
    if(e.target.value === 'oppose'){
      temparray = comments.concat().filter(item => item.endorse === false)
    }else if(e.target.value === 'support'){
      temparray = comments.concat().filter(item => item.endorse === true)
    }else if(e.target.value === 'time' ){
      temparray = comments.concat().sort((a, b) => (a.id) - (b.id));
    }else if(e.target.value === 'likes'){
      temparray = comments.concat().sort((a, b) => (b.num_likes) - (a.num_likes));
    }
    this.setState({
      currentarray:temparray
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

  onSubmitReply = async () => {
    const {question, comments, textarea, agree, contract, accounts} = this.state;

    if (textarea === ""){
      swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: '你還沒寫下意見',
      });
    } else if (agree === null) {
      swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: '你還沒選擇支持或反對',
      });
    } else {
      const time = Date.now();
      console.log(time)
      console.log(Date.now())
      var endorse = (agree === 'y' ? true : false)
      
      try{ 
        await contract.methods.create_reply(question.q_id, textarea, endorse, time).send({from: accounts[0]});
      }
      catch(err){
        console.log("There is an error while create_reply:" + err);
        return;
      }
      var l = comments.length

      comments.push({
        id: l,
        comment:textarea,
        endorse:endorse,
        time: time,
        owner_id: this.state.user.id, 
        num_likes: 0,
      });
    }
    this.setState({
      agree: 'y',
      textarea:"",
      comments: comments, //回覆 (data)
      currentarray: comments //當前頁面上的回覆
    });
  }

  handleCommentRespond = async(r_id) => {
    const {comments, contract, accounts, question} = this.state;    
    try{
      await contract.methods.like(question.q_id, r_id).send({from: accounts[0]})
      var new_comments = comments
      new_comments[r_id].num_likes+=1
    } catch(err){
      swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: '按了讚是不能收回的喔<3',
      });
    }
    this.setState({
      //user:user,
      comments:new_comments
    });
  }

  render() {
    const { currentarray,question,contract } = this.state;
    const postIts = currentarray.map((item,index) =>{
      // const i = user.history.findIndex(userhistory => userhistory.id === item.id);
      // var myRespond = null
      // if(i>=0) myRespond = user.history[i].respond
        return(
          <PostIt contract={contract} item={item} handleCommentRespond={(i,respond) => this.handleCommentRespond(i,respond)} respond={''}/>
        )
    })

    var sectionStyle = {
      width: "100%",
      height: "200px",
      backgroundImage: `url(${"https://ipfs.io/ipfs/" + question.imghash})`,
      backgroundPosition: "center 50%", 
      backgroundSize: '100%',
    };

    return (
      <div className='container bg-light pb-5 pt-4'>
        <div> 
          <div style={sectionStyle} className="pt-5">
            <h6 className="stroke">每日一問:</h6>       
            <h1 className="stroke">{question.title}?</h1>
            <h6 className="stroke">{question.subtitle}</h6>            
          </div>
          <hr/>   
          <div className="input-group mb-3 col-4">
            <div className="input-group-prepend">
              <label className="input-group-text" for="inputGroupSelect01">排序</label>
            </div>
            <select className="custom-select" id='inputGroupSelect01' onChange={this.handleSelectOnchange}>
              <option value="time">照時間</option>
              <option value='likes'>照讚數</option>
              <option value='support'>支持方</option>
              <option value='oppose'> 反對方 </option>              
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
              <button onClick={this.onSubmitReply} className="btn btn-primary">submit</button>          
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CommentBoard;
