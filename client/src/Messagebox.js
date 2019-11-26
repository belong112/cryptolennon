import React, { Component } from 'react';

class Messagebox extends Component {
  render() {
    return (
    	<div key={this.props.item.id} className={"border text-left p-2 m-2 " + (this.props.item.agree === 'y' ? 'border-success' : 'border-danger')}>
        <div>
          <h4>{(this.props.item.agree === 'y' ? '支持' : '反對')}</h4>
          <p>{this.props.item.text}</p>
          <span className="text-secondary">{this.props.item.age || "?"}歲，{this.props.item.name||"?"}</span>
        </div>
        <div className="button-container">
          <button className="btn btn-outline-secondary" onClick={() => this.handleCommentRespond(this.props.item.id,'positive')}>推{this.props.item.respond.positive}</button>
          <button className="btn btn-outline-secondary" onClick={() => this.handleCommentRespond(this.props.item.id,'negative')}>噓{this.props.item.respond.negative}</button>
        </div>
      </div>
    );
  }
}
export default Messagebox;