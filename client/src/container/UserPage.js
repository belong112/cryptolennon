import React, { Fragment, Component } from 'react';

import swal from 'sweetalert2';

class Userpage extends Component {
  constructor (props) {
    super(props);
    this.state = {     
      accounts: this.props.accounts,  
      contract: this.props.contract,
      name: this.props.user.name,
      replies: [],
      questions: [],
      preQuestions: [],
      petitionThreshold: 0
    };
  }

  namechange = (e) =>{
    this.setState({
      name:e.target.value
    })
  }

  onSubmit = () =>{
    const {name} = this.state
    this.props.handleAccountChange(name)
  }

  componentDidMount = async () =>{
    try{
      const {accounts, contract} = this.state
      var q_id = -1
      var r_id = -1
      var array0 = []
      var p_id = -1
      var array1 = []
      var array2 = []
      //get replies
      while(true){
        let x =  await contract.methods.get_all_replies(q_id, r_id).call({'from': accounts[0]})
        if (x[0] === '-1' && x[1] === '-1')
          break
        let question = await contract.methods.get_question(x[0]).call()
        let reply = await contract.methods.get_reply(x[0], x[1]).call()
        array0.push({q:question[0], r:reply[0], time:reply[2]})
        q_id = x[0]
        r_id = x[1]     
      }
      //get prequestion
      while(true){
        let x = await contract.methods.get_all_prequestions(p_id).call({'from': accounts[0]})
        if (x === '-1')
          break
        let prequestion = await contract.methods.get_prequestion(x).call()
        array1.push({title:prequestion[0], n_sign:prequestion[5], p_id: x}) //Todo: n_sign->petition
        p_id = x
      }
      //get questions
      p_id = -1
      while(true){
        let x = await contract.methods.get_all_questions(p_id).call({'from': accounts[0]})
        if (x === '-1')
          break
        let question = await contract.methods.get_question(x).call()
        array2.push({title:question[0]}) //Todo: n_sign->petition
        p_id = x
      }
      //get theeshold
      let t = await contract.methods.get_petition_threshold().call()
      this.setState({
        name: this.props.user.name,
        replies: array0,
        questions: array2,
        preQuestions: array1,
        petitionThreshold: t
      })

      //get questions
      while(true){
        let x = await contract.methods.get_all_prequestions(p_id).call({'from': accounts[0]})
        if (x === '-1')
          break
        let prequestion = await contract.methods.get_prequestion(x).call()
        array1.push({title:prequestion[0], n_sign:prequestion[5], p_id: x}) //Todo: n_sign->petition
        p_id = x
      }
    }catch(err){
      console.log('error')
    }
  }

  uploadPrequestion = async (p_id) => {
    const { contract,accounts } = this.state;
    
    // 判斷連署人數夠不夠
    // const prequestion = await contract.methods.get_prequestion(p_id).call();
    // if(prequestion[5] < 3) {
    //   swal.fire({
    //     icon: 'warning',
    //     title: '連署人數不夠喔！',
    //   });
    //   return;
    // }

    try{
      await contract.methods.create_question(p_id, Date.now()).send({'from': accounts[0]});
      swal.fire({
        icon: 'success',
        title: '達到連署門檻，以成功上架囉！',
      });
    }catch{
      swal.fire({
        icon: 'warning',
        title: '上架發生錯誤！(可能是連署人數不夠喔！）',
      });
    }
  }

  render() {
    var comments = this.state.replies.concat().sort((a, b) => (b.time) - (a.time));
    var preQuestions = this.state.preQuestions.concat();
    var questions = this.state.questions.concat();
    const c = comments.map(item => {
      return(
        <Fragment>
          <tr>
            <th scope="row">{item.q}</th>
            <th>{item.r}</th>
          </tr>
        </Fragment>
        )
    })
    const preQ = preQuestions.map((item, index) => {
      return(
        <div className={"d-flex justify-content-between align-items-center list-group-item "}>
          {item.title}
          <span>
          目前進度...({item.n_sign}/{this.state.petitionThreshold})
          </span>
          <button className="btn btn-warning btn-sm" onClick={() => {this.uploadPrequestion(item.p_id)}}>
          完成上架
          </button>
        </div>
      )
    })

    const q = questions.map((item, index) => {
      return(
        <div className={"d-flex justify-content-between align-items-center list-group-item "}>
          {item.title}
        </div>
      )
    })

    return (
      <div className="container">
        <div className="py-5 text-center">          
          <h4>個人資訊</h4>
          <p>可隨時更改暱稱，手續費約為0.001eth</p>
        </div>   
        <div className="col-5 mx-auto">  
          <div className="form-group">
            <label for="exampleInputEmail1">你的暱稱</label>
            <input className="form-control" value={this.state.name} onChange={this.namechange} maxLength="10"/>
          </div>          
          <button onClick={this.onSubmit} className="btn btn-outline-secondary">更新</button>
        </div>

        <div className='my-5'>          
          <nav>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item">
                <a className="nav-link active" id="home-tab" data-toggle="tab" href="#all" role="tab">連署中問題</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="profile-tab" data-toggle="tab" href="#petition" role="tab">已發布問題</a>
              </li>
            </ul>
          </nav>
          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="all" role="tabpanel" >
              <div className="list-group text-left">
                {preQ}
              </div>
            </div>
            <div className="tab-pane fade" id="petition" role="tabpanel">
              <div className="list-group text-left">
                {q}
              </div> 
            </div>
          </div>  
        </div>

        <div className="my-5">
          <h4>歷史紀錄</h4>
          <div className="table-wrapper-scroll-y">
            <table className="table table-bordered table-striped mb-0">
              <thead>
                <tr>
                  <th scope="col">問題</th>
                  <th scope="col">回應</th>
                </tr>
              </thead>
              <tbody>
                {c}
              </tbody>
            </table>
          </div>
        </div>
      </div>      
    );
  }
}
export default Userpage;