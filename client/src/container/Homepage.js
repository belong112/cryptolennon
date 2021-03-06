import React, { Component } from 'react';
import {NavLink, Link} from "react-router-dom";

import swal from 'sweetalert2';
import WhatshotIcon from '@material-ui/icons/Whatshot';

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
      petitionThreshold: 0,
      user: this.props.user,
      buffer: null
    }
  }

  componentDidMount = async () => {
    const {contract,accounts} = this.state
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
          imghash: temp[2].toString(),
          num_comments: temp2,
          last_update_time: temp[3],
          owner_id: temp[4]
        }
        temparray.push(newitem)
      }

      //get prequestion
      l = await contract.methods.get_prequestion_length().call();

      var temparray2= []
      for (i = 0; i < l; i++) {
        temp = await contract.methods.get_prequestion(i).call( {'from': accounts[0]})
        console.log(temp)
        const newitem = {
          id: i.toString(),
          genre: 'Life',
          title: temp[0].toString(),
          subtitle: temp[1].toString(),
          imghash: temp[2].toString(),
          petitions: temp[5],
          create_time: temp[3],
          owner_id: temp[4],
          signed: temp[6],
        }
        temparray2.push(newitem)
      }

      let t = await contract.methods.get_petition_threshold().call()

      this.setState({
        questions: temparray,
        preQuestions: temparray2,
        petitionThreshold: t
      })

    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };


  handleTxtOnchange = (e) => {this.setState({textarea: e.target.value})}
  handleSubOnchange = (e) => {this.setState({subtitle: e.target.value})}
  handleSelecctOnchange = (e) => {this.setState({genre: e.target.value})}
  handleChangeFile = (e) => {
    e.preventDefault()
    let reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result)
      });
    };
  };

  // 連署
  handleSign = async (i) =>{
    const { user,contract,accounts } = this.state;
    try{
      await contract.methods.sign(i).send({from:accounts[0]});

      // check if 3 signs, if true => make question
      const prequestion = await contract.methods.get_prequestion(i).call();
      if(prequestion[5] >= 3){
        await this.petitionComplete(i);
      }
    }catch(err){
      if(user.name === ''){
        swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: '要先創建帳號才能連署ㄡ!',
        });
      }
      else{
        swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: '連署錯誤了啦！你是不是要自肥啊？',
        });
      }
    }
  }

  petitionComplete = (i) => {
    const { contract,accounts } = this.state;
    
    //Todo: 顯示連署成功
  }

  // 提交待聯署問題
  onSubmitPrequestion = async (e) => {
    e.preventDefault()
    const { user, genre, textarea, subtitle, preQuestions,contract,accounts} = this.state
    let hash = ''
    try { 
      // send picture ipfs
      const IPFS = require('ipfs-api');
      const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

      // Error Handle. Photo upload (Required)
      if (!this.state.buffer) {
        swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: '你還沒上傳照片啦，你是要別人看什麼＾＿＾？',
        });
        return;
      }

      await ipfs.files.add(this.state.buffer, async (error, result) => {
        if(error) {
          if(user.name === ""){
            swal.fire({
              icon: 'warning',
              title: 'Oops...',
              text: '要先創建帳號才能提問ㄡ!',
            });
          }
          else{
            swal.fire({
              icon: 'warning',
              title: 'Oops...',
              text: '怪怪ㄉ',
            });
          }
          return
        }
        hash = result[0].hash 
        var time = Date.now()
        await contract.methods.create_prequestion(textarea, subtitle, hash, time).send({from:accounts[0]});
        swal.fire({
          icon: 'success',
          title: '送出成功',
          text: '問題要先經過連署 => 超過一定門檻 => 到個人頁面就可以正式發佈喔！',
        });

      })
      // var time = Date.now()
      // console.log(time)
      // await contract.methods.create_prequestion(textarea, subtitle, hash, time).send({from:accounts[0]})
    }
    catch(err){
      console.log("There is an error while create_question:" + err);
      this.setState({
        subtitle:"",
        textarea:"",
      });
      return;
    }

    var l = preQuestions.length;
    var temparray = preQuestions.concat();
    temparray.push({
      id: l,
      genre: 'Life',
      title: textarea,
      subtitle: subtitle,
      imghash: hash,
      petitions: 1,
      signed: true,
    });
    this.setState({
      subtitle:"",
      textarea:"",
      buffer: null,
      genre: '-',
      preQuestions: temparray,
    });
  }

  render() {
    const { contract, accounts, preQuestions, questions, petitionThreshold } = this.state;
    const preQuestionArray = preQuestions.map((item,index) =>{
      return(
        <div className="d-flex justify-content-between align-items-center list-group-item list-group-item-action">
          {item.title}
          <button className={"btn btn-sm "+ (item.signed ? "btn-success" : "btn-warning")} onClick={() => this.handleSign(index)}>
            我要連署...({item.petitions}/{petitionThreshold})
          </button>
        </div>
      ) 
    })
    const sortedQuestionArray = questions.concat().sort((b,a) =>(a.num_comments - b.num_comments));
    const questionArray = sortedQuestionArray.map((item,index) =>{
      // var q = "["+(item.genre)+"] "+(item.title)
      return(
        <Link to={"/commentboard/"+(item.id)} className="d-flex justify-content-between align-items-center list-group-item list-group-item-action">{item.title}<span className={"badge badge-pill "+(item.num_comments > 10 ? 'badge-danger':'badge-secondary')}>{item.num_comments}</span></Link>
      )
    })

    //var sortarray = questions.concat().sort((b, a) => (a.num_comments) - (b.num_comments));
    var sortarray = questions.concat().sort((b,a) =>(a.num_comments - b.num_comments));

    let ready= false // to make sure array is loaded
    let sectionStyle = {}
    if (sortarray.length !== 0){
      ready = true
      sectionStyle = {
        width: "100%",
        backgroundImage: `url(${"https://ipfs.io/ipfs/" + sortarray[0].imghash})`,
        backgroundPosition: "center 20%", 
        backgroundSize:"100%",
      };
    }

    if(ready)
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
                <a className="nav-link" id="profile-tab" data-toggle="tab" href="#petition" role="tab">連署中問題 <WhatshotIcon fontSize='small' color='secondary'/></a>
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
          <div className="text-left text-muted text-sm">＊註：綠色按鈕代表自己已經連署過了，黃色的代表自己沒連署過</div> 
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
          <div className="form-group">
            <label>上傳圖片</label>
            <br/>
            <input type="file" className="" onChange={this.handleChangeFile} />
          </div>          
          <p className='text-danger'>註 : 此動作需要約0.003eth</p>
          <button onClick={this.onSubmitPrequestion} className="btn btn-primary">送出</button> 
        </div>
      </div>
    </div>
    );
    else
      return(
        <div className="spinner-border" style={{width: '3rem', height: '3rem'}} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      )
  }
}
export default Homepage;