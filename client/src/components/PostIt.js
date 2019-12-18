import React, { Component } from 'react';

import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

import "../css/postit.css"
import "../css/borders.css"

class PostIt extends Component {
  constructor (props) {
    super(props);
    this.state = { 
      contract:this.props.contract,
      owner:{}
    };
  }

  componentDidMount = async () => {
    const {contract} = this.state
    const owner_id = this.props.item.owner_id
    try {
      // get owner name and age
      let temp = await contract.methods.get_account(owner_id).call();
      const owner = {
        name: temp[0],
        age: 2019 - temp[3]
      }
      this.setState({
        owner:owner
      })

    }catch(err){
      alert(err)
    }
  }

  handleCommentRespond = (id) =>{
    this.props.handleCommentRespond(id)
  }

  render() {   
    let border = ""
    if (this.props.item.num_likes > 10)
      border = 'gradient'
    else if (this.props.item.num_likes > 20)
      border = 'fancy'

    return (
      <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 my-3 ">
        <div className={"note " + (this.props.item.endorse === true ? 'green' : 'pink') + " "+ (border) }>
          <div className="text-left">
            <h4>{(this.props.item.endorse === true ? '支持' : '反對')}</h4>
            <div>{this.props.item.comment}</div>
            <br/>
            <div className="text-secondary">{this.state.owner.age || "?"}歲，{this.state.owner.name||"?"}</div>
          </div>
          <div className="buttongroup">
            <IconButton onClick={()=>{this.handleCommentRespond(this.props.item.id)}} spacing={2}>
              <Badge badgeContent={this.props.item.num_likes} color="primary">
                <ThumbUpIcon color={(this.props.respond === 'positive' ? 'primary':'')} />
              </Badge>
            </IconButton>            
          </div>
        </div>
      </div>     
    );
  }
}
export default PostIt;