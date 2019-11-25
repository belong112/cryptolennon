import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

var items = [{
          agree: 'y',
          text: "兩國的文化已經漸行漸遠，實屬沒必要強迫兩國統一。"
        },
        {
          agree: 'y',
          text: "我認為台灣擁有很多對岸沒有的，我實在不想被統一。"
        },
        {
          agree: 'f',
          text: "區區灣灣人民，別忘了你們的老祖先，都是從中國而來，現在回歸祖國懷抱，豈能不答應?"
        }]

class App extends Component {
   constructor (props) {
    super(props);
    this.state = { 
      storageValue: 0, 
      web3: null, 
      accounts: null, 
      contract: null, 
      items: [],
      textarea: "",
      agree: null
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
    const {agree,textarea} = this.state
    if (textarea === "")
      alert("你還沒寫下意見")
    else if (agree == null)
      alert('你還沒選擇支持或反對')
    else  
      items.unshift({
        agree:agree,
        text:textarea
      });
    
    this.setState({
      items:items,
      agree:null,
      textarea:""
    });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    const { items } = this.state;
    const replys = items.map(item =>{
      if (item.agree === 'y') {
      return(
        <div className="border border-success text-left p-2 m-2">
          <h4>支持</h4>
          <p>{item.text}</p>
        </div>
      )}

      else{
        return(
        <div className="border border-danger text-left p-2 m-2">
          <h4>反對</h4>
          <p>{item.text}</p>
        </div>
      )}
    })

    return (
      <div className="App m-5">
        <h1>你支持一國兩制嗎?</h1>
        {replys}

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
    );
  }
}

export default App;
