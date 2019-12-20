import React, { Component } from "react";
import {Route, BrowserRouter} from "react-router-dom"

import LennonContract from "./contracts/Lennon.json";

import getWeb3 from "./getWeb3";
import Header from "./components/Header.js"
import Footer from "./components/Footer.js"
import CommentBoard from "./container/CommentBoard.js"
import Homepage from "./container/Homepage.js"
import Userpage from "./container/UserPage.js"
import Registerpage from "./container/RegisterPage.js"

import "./App.css";

class App extends Component {
   constructor (props) {
    super(props);
    this.state = { 
      web3: null, 
      accounts: null, 
      contract: null,
      user: {
        name:"",
        b_year: 0,
        b_month: 0,
        b_day: 0,
        id: 0
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
      const deployedNetwork = LennonContract.networks[networkId];
      const instance = new web3.eth.Contract(
        LennonContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      console.log(deployedNetwork.address)

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance},this.runExample);
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
    //await contract.methods.create_account("雨境",5,27,1998).send({from: accounts[0]});

    // await contract.methods.create_question().send({from: accounts[0]});
    //const t2 = await contract.methods.get_question(3).call();
    //console.log(t2);
    // success
    // const t1 = await contract.methods.get_question(0).call();
    // console.log(t1); 

    // success
    // await contract.methods.create_question('幹你娘?').send({from: accounts[0]});
    // const t2 = await contract.methods.get_question(3).call();
    // console.log(t2);

    // failed
    // const t3 = await contract.methods.get_account().call();
    // console.log(t3);

    //fail
    // const t4 = await contract.methods.get_reply(0, 0).call({from: accounts[0]});
    // console.log(t4);
  }
  handleregister = async (a,b,c,d) =>{
    const {contract, accounts} = this.state
    try { 
      await contract.methods.create_account(a,b,c,d).send({'from': accounts[0]});
      const t3 = await contract.methods.get_account().call();
    }
    catch(err){
      console.log("There is an error while create_account:" + err);
      return;
    }
    var fake_user = {
      id: t3[0],
      name:a,
      b_year:d,
      b_month:b,
      b_day:c
    }
    this.setState({
      user:fake_user
    })
  }


  handleAccountChange = async (new_name) =>{
    const {contract, accounts, user} = this.state
    try { 
      await contract.methods.modify_account_info(new_name).send({'from': accounts[0]});
    }
    catch(err){
      console.log("There is an error while updateing name :" + err);
      return;
    }
    var fake_user = user
    fake_user.name = new_name
    this.setState({
      user:fake_user
    })
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...!!!!!!!</div>;
    }
    const RegisterPage = (props) => { return ( <Registerpage handleregister={(a,b,c,d) => this.handleregister(a,b,c,d)} />)};
    const CommentPage = (props) => { return ( <CommentBoard  web3={this.state.web3} accounts={this.state.accounts} contract={this.state.contract} user={this.state.user} id={props.match.params.boardid} />)};
    const UserPage = (props) =>{ return ( <Userpage  handleAccountChange={(a) => this.handleAccountChange(a)} user={this.state.user} />)};
    const HomePage = (props) =>{ return ( <Homepage web3={this.state.web3} accounts={this.state.accounts} contract={this.state.contract} user={this.state.user} />)}
    return (
      <BrowserRouter> 
        <div className='App'>
          <Header user={this.state.user}/>
          <div>
            <Route exact path='/user' render={UserPage} />
            <Route exact path='/register' render={RegisterPage} />
            <Route exact path='/' render={HomePage} />            
            <Route exact path='/commentboard/:boardid' render={CommentPage} /> 
          </div>
          <Footer/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
