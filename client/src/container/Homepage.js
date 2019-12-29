import React, { Component } from 'react';
import {NavLink, Link} from "react-router-dom";

import test1 from "../img/tsai.jpg"

class Homepage extends Component {
   constructor (props) {
    super(props);
    this.state={
      web3: this.props.web3,
      contract: this.props.contract,
      accounts: this.props.accounts,
      genre: "",
      textarea: "",
      subtitle: "",
      questions: [],
      preQuestions: [],
      user: this.props.user
    }
  }

  componentDidMount = async () => {
    const {contract} = this.state
    try {
      // get question
      var l = await contract.methods.get_question_length().call()

      var temparray= []
      for (var i = 0; i < l; i++) {
        var temp = await contract.methods.get_question(i).call()
        var temp2 = await contract.methods.get_reply_length(i).call()
        const newitem = {
          id: i.toString(),
          genre: 'Life',
          title: temp[0].toString(),
          subtitle: temp[1].toString(),
          num_comments: temp2,
          last_update_time: temp[2],
          owner_id: temp[3]
        }
        temparray.push(newitem)
      }

      //get prequestion
      l = await contract.methods.get_prequestion_length().call()

      var temparray2= []
      for (i = 0; i < l; i++) {
        temp = await contract.methods.get_prequestion(i).call()
        const newitem = {
          id: i.toString(),
          genre: 'Life',
          title: temp[0].toString(),
          subtitle: temp[1].toString(),
          petitions: temp[4],
          create_time: temp[2],
          owner_id: temp[3]
        }
        temparray2.push(newitem)
      }

      this.setState({
        questions: temparray,
        preQuestions: temparray2
      })

    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };


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

  // 連署
  handleSign = async (i) =>{
    const { contract,accounts } = this.state
    try{
      await contract.methods.sign(i).send({from:accounts[0]})

      // check if 3 signs, if true => make question
      const temp = await contract.methods.get_prequestion(i).call()
      console.log(temp)
      if(temp[4] === 3){
        await contract.methods.create_question(i, Date.now()).send()
      }
    }catch(err){
      alert(err)
    }
  }

  onSubmitPrequestion = async () => {
    const {genre, textarea, subtitle, preQuestions,contract,accounts} = this.state
    try { 
      var time = Date.now()
      console.log(time)
      await contract.methods.create_prequestion(textarea, subtitle, time).send({from:accounts[0]})
    }
    catch(err){
      console.log("There is an error while create_question:" + err);
      this.setState({
        subtitle:"",
        textarea:"",
      });
      return;
    }

    var l = preQuestions.length
    var temparray = preQuestions.concat()
    temparray.push({
      id: l,
      genre: 'Life',
      title: textarea,
      subtitle: subtitle,
      petitions: 1
    });
    this.setState({
      subtitle:"",
      textarea:"",
      preQuestions: temparray
    });
  }

  render() {
    const preQuestionArray = this.state.preQuestions.map((item,index) =>{
      return(
        <div className="d-flex justify-content-between align-items-center list-group-item list-group-item-action">
          {item.title}
          <button className="btn btn-warning btn-sm" onClick={() => this.handleSign(index)}>
            我要連署
          </button>
        </div>
      )
    })
    const questionArray = this.state.questions.map((item,index) =>{
      // var q = "["+(item.genre)+"] "+(item.title)
      return(
        <Link to={"/commentboard/"+(index)} className="d-flex justify-content-between align-items-center list-group-item list-group-item-action">{item.title}<span className={"badge badge-pill "+(item.num_comments > 10 ? 'badge-danger':'badge-secondary')}>{item.num_comments}</span></Link>
      )
    })

    //var sortarray = questions.concat().sort((b, a) => (a.num_comments) - (b.num_comments));
    var sortarray = this.state.questions.concat().sort((b,a) =>(a.num_comments - b.num_comments));

    let raedy= false
    if (sortarray.length !== 0){
      raedy = true
    }

    var sectionStyle = {
      width: "100%",
      backgroundImage: `url(${test1})`,
      backgroundPosition: "center 90%", 
      backgroundSize:"100%",
    };
    if(raedy)
    return (
      <div className='container'>
        <div className="nav-scroller py-1 mb-2 bg-white">
          
        </div>
        <div className='bg-light pb-5 px-2'>
          <div className="jumbotron p-4 p-md-5 text-white rounded bg-dark" style={sectionStyle}>
            <div className="col-md-6 px-0 text-left">
              <p className="lead my-3">發燒話題</p>
              <h4 className='text-danger'>Life</h4>
              <h1 className="display-4 ">{sortarray[0].title}</h1>
              <h4 className="">{sortarray[0].subtitle}</h4>         
              <p className="lead mb-0"><NavLink className="text-white font-weight-bold" to={"/commentboard/"+(sortarray[0].id)}>進入討論區</NavLink></p>
            </div> 
          </div>
          <div className="row mb-2">
            <div className="col-md-6">
              <div className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                <div className="col p-4 d-flex flex-column position-static">
                  <strong className="d-inline-block mb-2 text-primary">Life</strong>
                  <h3 className="mb-0">{sortarray[1].title}</h3>
                  <div className="mb-1 text-muted">Nov 12</div>
                  <p className="card-text mb-auto">{sortarray[1].subtitle}</p>
                  <Link to={"/commentboard/"+(sortarray[1].id)}>go to commentboard</Link>
                </div>
              </div>
          </div>
          <div className="col-md-6">
            <div className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
              <div className="col p-4 d-flex flex-column position-static">
                <strong className="d-inline-block mb-2 text-success">Life</strong>
                <h3 className="mb-0">{sortarray[2].title}</h3>
                <div className="mb-1 text-muted">Nov 11</div>
                <p className="mb-auto">{sortarray[2].subtitle}</p>
                <NavLink to={"/commentboard/"+(sortarray[2].id)}>go to commentboard</NavLink>
              </div>
            </div>
          </div>
        </div>
        <div>          
          <nav>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item">
                <a className="nav-link active" id="home-tab" data-toggle="tab" href="#all" role="tab">所有問題</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="profile-tab" data-toggle="tab" href="#petition" role="tab">連署中問題</a>
              </li>
            </ul>
          </nav>
          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="all" role="tabpanel" >
              <div className="list-group text-left">
                {questionArray}
              </div>
            </div>
            <div className="tab-pane fade" id="petition" role="tabpanel">
              <div className="list-group text-left">
                {preQuestionArray}
              </div> 
            </div>
          </div>  
        </div>
        <hr/>
        <div className='mt-5'>
          <h3>我要提問</h3>
          <div className="form-group">
            <label for="Select1">選擇主題</label>
            <select className="form-control" id="Select1" onChange={this.handleSelecctOnchange}>
              <option>-</option>
              <option value='Life'>Life</option>
              <option value='Politics'>Politics</option>
            </select>
          </div>
          <div className="form-group">
            <label>問題</label>
            <input type="text" className="form-control" onChange={this.handleTxtOnchange} value={this.state.textarea} />
          </div>
          <div className="form-group">
            <label>副標題</label>
            <input type="text" className="form-control"  onChange={this.handleSubOnchange} value={this.state.subtitle} />
          </div>  
          <p className='text-danger'>註 : 此動作需要約0.003eth</p>
          <button onClick={this.onSubmitPrequestion} className="btn btn-primary">送出</button> 
        </div>
      </div>
    </div>
    );
    else
      return(
        <div class="spinner-border" style={{width: '3rem', height: '3rem'}} role="status">
          <span class="sr-only">Loading...</span>
        </div>
      )
  }
}
export default Homepage;