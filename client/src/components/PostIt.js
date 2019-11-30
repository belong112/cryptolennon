import React, { Component } from 'react';

import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

import "../css/postit.css"

class PostIt extends Component {
  render() {    
    return (
      <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 my-3">
        <div className={"note " + (this.props.item.color)}>
          <div className="text-left">
            <h4>{(this.props.item.agree === 'y' ? '支持' : '反對')}</h4>
            <div>{  this.props.item.text}</div>
            <br/>
            <div className="text-secondary">{this.props.item.age || "?"}歲，{this.props.item.name||"?"}</div>
          </div>
          <div className="buttongroup">
            <IconButton spacing={2}>
              <Badge badgeContent={this.props.item.respond.positive} color="primary">
                <ThumbUpIcon color={(this.props.respond === 'positive' ? 'primary':'')} />
              </Badge>
            </IconButton>
            <IconButton spacing={2}>
              <Badge badgeContent={this.props.item.respond.negative} color="secondary">
                <ThumbDownIcon color={(this.props.respond === 'negative' ? 'secondary':'')} />
              </Badge>
            </IconButton>
          </div>
        </div>
      </div>     
    );
  }
}
export default PostIt;