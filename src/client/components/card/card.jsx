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
      editorMode: false,
      tags: props.tags,
      notes: props.notes,
      cardId: props.cardId
    }
    this.changeEditorMode = this.changeEditorMode.bind(this);
    this.closeEditorMode = this.closeEditorMode.bind(this);
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
    this.props.changeEditorMode(this, cardId);
    this.setState({ editorMode: true });
  }

  closeEditorMode(cardId) {
    if (cardId == undefined) {
      this.save(null);
    } else {
      this.state.changeEditorMode(null);
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("should derive state")
    this.setState({ cardId: nextProps.cardId,
                    tags: nextProps.tags,
                    notes: nextProps.notes })
  }

  save() {
    this.setState({ editorMode: false });
    const obj = { cardId: this.state.cardId,
                  tags: this.state.tags,
                  notes: this.state.notes
                }
    this.props.save(obj);
    
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
      this.state.nullPrevCard(this);
    });
  }

  render() {
    if (this.state.editorMode == true) {
      return (
        <div>
          <div className={styles.cardContainer}>
            <div className={styles.inputs}>
              <input className={styles.inputField} onChange={this.handleTagsChange} type="text" name="tags" placeholder="tags (defaulted to others)" value={this.state.tags} /><br />
              <textarea autoFocus className={styles.inputField} onChange={this.handleNotesChange} type="text" rows="8" name="notes" placeholder={this.state.placeholder} value={this.state.notes} /><br />
            </div>
            <div className={styles.controls}>
              <button className={styles.button} onClick={this.highlight}>Highlight</button><br />
              <button className={styles.button} onClick={this.review}>Review</button><br />
              <button className={styles.button} onClick={() => this.delete(this.state.cardId)}>Delete</button><br />
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div onClick={() => this.changeEditorMode(this.state.cardId)}>
          <li>{this.state.notes}</li>
        </div>
      )
    }
  }
}

export default Card;