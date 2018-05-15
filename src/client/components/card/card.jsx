/* eslint-disable */
import React from 'react';
import styles from './style.scss';
import axios from 'axios';
// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { docco } from 'react-syntax-highlighter/styles/hljs';
// import Editor from './editor';

class Card extends React.Component {
  constructor() {
    super();
    this.state = {
      editorMode: false
    }
    this.changeEditorMode = this.changeEditorMode.bind(this);
    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    // this.highlight = this.highlight.bind(this);
    // this.review = this.review.bind(this);
    this.delete = this.delete.bind(this);
  }

  handleTagsChange(event) {
    this.setState({ tags: event.target.value });
  }

  handleNotesChange(event) {
    this.setState({ notes: event.target.value });
  }

  changeEditorMode(cardId) {
    this.props.changeEditorMode(this);
    this.setState({ editorMode: true });
  }

  save(cardId) {
    const tags = this.props.tags == undefined ? 'others' : this.props.tags;
    if (this.props.notes != undefined) {
      axios({
        method: 'post',
        url: '/users/1/cards',
        data: {
          userId: 1,
          cardId: cardId,
          tags: tags,
          notes: this.props.notes
        }
      })
      .then(res => {
        this.setState({ editorMode: false });
      });
    }
  }

  delete(cardId) {
    axios({
      method: 'delete',
      url: '/users/1/cards',
      data: {
        cardId: cardId
      }
    })
    .then(res => {
      this.props.nullPrevCard(this);
    });
  }

  render() {
    if (this.state.editorMode == true) {
      return (
        <div>
          <div className={styles.cardContainer}>
            <div className={styles.inputs}>
              <input className={styles.inputField} onChange={this.handleTagsChange} type="text" name="tags" placeholder="tags (defaulted to others)" value={this.props.tags} /><br />
              <textarea autoFocus className={styles.inputField} onChange={this.handleNotesChange} type="text" rows="8" name="notes" placeholder={this.props.placeholder} value={this.props.notes} /><br />
            </div>
            <div className={styles.controls}>
              <button className={styles.button} onClick={this.highlight}>Highlight</button><br />
              <button className={styles.button} onClick={this.review}>Review</button><br />
              <button className={styles.button} onClick={() => this.delete(this.props.cardId)}>Delete</button><br />
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div onClick={() => this.changeEditorMode(this.props.cardId)}>
          <li>{this.props.notes}</li>
        </div>
      )
    }
  }
}

export default Card;