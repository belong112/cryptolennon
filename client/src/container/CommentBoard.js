import React, { Component } from "react";

import SimpleStorageContract from "../contracts/SimpleStorage.json";
import getWeb3 from "../getWeb3";
import PostIt from "../components/PostIt.js"

import "../App.css";


var currentitems = []
var items = [{
          id:'1574752132567',
          agree: 'y',
          text: "兩國的文化已經漸行漸遠，實屬沒必要強迫兩國統一。",
          age: 22,
          name: "石牌小雞雞",
          color: "yellow",
          respond:{
            "positive":3,
            "negative":6
          }
        },
        {
          id:'1574752182674',
          agree: 'y',
          text: "我認為台灣擁有很多對岸沒有的，我實在不想被統一。",
          age: 16,
          name: '東區劉德華',
          color: "green",
          respond:{
            "positive":17,
            "negative":2
          }
        },
        {
          id:'1574752232922',
          agree: 'f',
          text: "區區灣灣人民，別忘了你們的老祖先，都是從中國而來，現在回歸祖國懷抱，豈能不答應?",
          age: 53,
          name: "韓家軍100號子弟兵",
          color: "pink",
          respond:{
            "positive":10,
            "negative":9
          }
        }]

class CommentBoard extends Component {
   constructor (props) {
    super(props);
    this.state = { 
      storageValue: 0, 
      web3: null, 
      accounts: null, 
      contract: null,
      items: [],
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
      this.setState({ web3, accounts, contract: instance, items:items});
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

  handleOnchange = (e) =>{
    this.setState({
      textarea: e.target.value
    })
  }

  handleRadio = (e) =>{
    console.log(e.target.value)
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
        color: "blue",
        respond:{
            "positive":0,
            "negative":0
          }
      });
    
    this.setState({
      items:items,
      agree:null,
      textarea:""
    });
  }

  changefilter = (flitername) =>{
    if(flitername === 'agree')
      currentitems = items.filter((item)=>{
        return item.agree === 'y';       // 取得大於五歲的
      });
    else if(flitername === 'disagree')
      currentitems = items.filter((item)=>{
        return item.agree === 'f';       // 取得大於五歲的
      });
    else if(flitername === 'all')
      currentitems = items
    else if(flitername === 'likes'){
      console.log('w')
      currentitems = items.sort((a, b) => (b.respond.positive) - (a.respond.positive));
    }

    this.setState({
      items:currentitems
    })
  }

  handleCommentRespond = (id,respond) => {
    const {items,user} = this.state;
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
      items:items
    });   
  }

  render() {
    const { items,user } = this.state;
    const postIts = items.map((item,index) =>{
      const i = user.history.findIndex(userhistory => userhistory.id === item.id);
      var respond = null
      if(i>=0) respond = user.history[i].respond

        return(
          <PostIt item={item} respond={respond} />
        )
    })

    return (
      <div className='App container'>
        <div> 
          <h6>每日一問:</h6>       
          <h1>你支持一國兩制嗎?</h1>
          <div className="btn-group" role="group">
            <button className="btn btn-outline-secondary disabled">fliter</button>
            <button className="btn btn-secondary" onClick={() => this.changefilter('all')}>全部</button>
            <button className="btn btn-secondary" onClick={() => this.changefilter('agree')}>支持方</button>
            <button className="btn btn-secondary" onClick={() => this.changefilter('disagree')}>反對方</button>
            <button className="btn btn-secondary" onClick={() => this.changefilter('likes')}>照讚數</button>
          </div>
          <div className="input-group mb-3 col-4">
            <div className="input-group-prepend">
              <label className="input-group-text" for="inputGroupSelect01">Filter</label>
            </div>
            <select className="custom-select" id='inputGroupSelect01'>
              <option value='0' selected>All</option>
              <option value="1">Support</option>
              <option value="2">Opposition</option>
              <option value="3">By time</option>
              <option value='4'>By likes</option>
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
                <textarea className="form-control" value={this.state.textarea} onChange={this.handleOnchange} placeholder="寫些什麼..." rows="3"></textarea>
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
