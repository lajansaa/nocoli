/* eslint-disable */
import React from 'react';
import styles from './style.scss';
import axios from 'axios';
// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { docco } from 'react-syntax-highlighter/styles/hljs';
// import Editor from './editor';

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: props.tags,
      notes: props.notes,
      editorMode: props.editorMode
    }
    this.changeEditorMode = this.changeEditorMode.bind(this);
    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    // this.highlight = this.highlight.bind(this);
    // this.review = this.review.bind(this);
    // this.delete = this.delete.bind(this);
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
    const tags = this.state.tags.length == 0 ? 'others' : this.state.tags;
    axios({
      method: 'post',
      url: '/users/1/notes',
      data: {
        userId: 1,
        cardId: cardId,
        tags: tags,
        notes: this.state.notes
      }
    })
    .then(res => {
      this.setState({ editorMode: false });
    });
  }

  render() {
    if (this.state.editorMode == true) {
      return (
        <div>
          <div className={styles.cardContainer}>
            <div className={styles.inputs}>
              <input className={styles.inputField} onChange={this.handleTagsChange} type="text" name="tags" placeholder="tags (defaulted to others)" value={this.state.tags} /><br />
              <textarea autoFocus className={styles.inputField} onChange={this.handleNotesChange} type="text" rows="8" name="notes" placeholder="notes" value={this.state.notes} /><br />
            </div>
            <div className={styles.controls}>
              <button className={styles.button} onClick={this.highlight}>Highlight</button><br />
              <button className={styles.button} onClick={this.review}>Review</button><br />
              <button className={styles.button} onClick={this.delete}>Delete</button><br />
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div onClick={() => this.changeEditorMode(this.props.cardId)}>
          <li>{this.state.notes}</li>
        </div>
      )
    }
  }
}

export default Card;