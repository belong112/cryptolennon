import React, { Component } from "react";

import SimpleStorageContract from "../contracts/SimpleStorage.json";
import getWeb3 from "../getWeb3";
import PostIt from "../components/PostIt.js";

import "../App.css";

import data from "../data.js"

let items = []
let question = []
class CommentBoard extends Component {
   constructor (props) {
    super(props);
    items = data.items[this.props.id]
    question = data.questions[this.props.id]
    this.state = { 
      web3: null, 
      accounts: null, 
      contract: null,
      currentitems: items,
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
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(1000).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
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
      currentitems:temparray
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
      currentitems:items
    });   
  }

  render() {
    const { currentitems,user } = this.state;
    const postIts = currentitems.map((item,index) =>{
      const i = user.history.findIndex(userhistory => userhistory.id === item.id);
      var myRespond = null
      if(i>=0) myRespond = user.history[i].respond
        return(
          <PostIt item={item} handleCommentRespond={(i,respond) => this.handleCommentRespond(i,respond)} respond={myRespond}/>
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
              <option value="support">支持方</option>
              <option value="oppose">反對方</option>
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
