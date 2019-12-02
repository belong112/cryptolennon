import React, { Component } from "react";
import {Route, BrowserRouter} from "react-router-dom"

import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import Header from "./components/Header.js"
import Footer from "./components/Footer.js"
import CommentBoard from "./container/CommentBoard.js"
import Homepage from "./container/Homepage.js"
import Userpage from "./container/UserPage.js"

import "./App.css";

class App extends Component {
   constructor (props) {
    super(props);
    this.state = { 
      storageValue: 0, 
      web3: null, 
      accounts: null, 
      contract: null,
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

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...!!!!!!!</div>;
    }
    const CommentPage = (props) => { return ( <CommentBoard id={props.match.params.boardid} />)};
    const UserPage = (props) =>{ return ( <Userpage user={this.state.user}/>)};
    return (
      <BrowserRouter> 
        <div className='App'>
          <Header user={this.state.user}/>
          <div>
            <Route exact path='/' component={Homepage} />
            <Route exact path='/user' render={UserPage} />
            <Route exact path='/commentboard/:boardid' render={CommentPage} /> 
          </div>
          <Footer/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
