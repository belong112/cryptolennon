import React, { Fragment, Component } from 'react';

class Userpage extends Component {
  constructor (props) {
    super(props);
    this.state = {       
      contract: this.props.contract,
      name: this.props.user.name,
      replies: [],
      prequestions: [],
      petition_threshld: 0
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
      while(true){
        let x = await contract.methods.get_all_prequestions(p_id).call({'from': accounts[0]})
        if (x === '-1')
          break
        let prequestion = await contract.methods.get_prequestion(x).call()
        array1.push({p:prequestion[0], n_sign:prequestion[5]})
        p_id = x
      }
      let t = await contract.methods.get_petition_threshold().call()
      this.setState({
        replies: array0,
        prequestions: array1,
        petitions: t
      })
    }catch(err){
      console.log('error')
    }
  }

  render() {
    var temp = this.state.replies.concat().sort((a, b) => (b.time) - (a.time));
    const comments = temp.map(item => {
      return(
        <Fragment>
          <tr>
            <th scope="row">{item.q}</th>
            <th>{item.r}</th>
          </tr>
        </Fragment>
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
                {comments}
              </tbody>
            </table>
          </div>
        </div>
      </div>      
    );
  }
}
export default Userpage;