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
      tags: [],
      notes: ""
    }
    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.save = this.save.bind(this);
    // this.highlight = this.highlight.bind(this);
    // this.review = this.review.bind(this);
    // this.delete = this.delete.bind(this);
  }

  handleTagsChange(event) {
    const tagsArr = event.target.value.split(',');
    this.setState({ tags: tagsArr });
  }

  handleNotesChange(event) {
    this.setState({ notes: event.target.value });
  }

  save() {
    axios({
      method: 'post',
      url: '/users/notes',
      data: {
        userId: 1,
        cardId: 1,
        tags: this.state.tags,
        notes: this.state.notes
      }
    })
    .then(res => {
      console.log(res);
    });
  }

  render() {
    return (
      <div>
        <form className={styles.cardContainer}>
          <div className={styles.inputs}>
            <input className={styles.inputField} onChange={this.handleTagsChange} type="text" name="tags" placeholder="tags" value={this.props.tags}/><br />
            <textarea className={styles.inputField} onChange={this.handleNotesChange} type="text" name="notes" placeholder="notes" value={this.props.notes} /><br />
          </div>
          <div className={styles.controls}>
            <button className={styles.button} onClick={this.save}>Save</button><br />
            <button className={styles.button} onClick={this.highlight}>Highlight</button><br />
            <button className={styles.button} onClick={this.review}>Review</button><br />
            <button className={styles.button} onClick={this.delete}>Delete</button><br />
          </div>
        </form>
        
      </div>
    )
  }
}

export default Card;