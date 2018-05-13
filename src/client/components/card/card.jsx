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
      notes: props.notes
    }
    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.save = this.save.bind(this);
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
      console.log(res);
    });
  }

  render() {
    return (
      <div>
        <form className={styles.cardContainer}>
          <div className={styles.inputs}>
            <input className={styles.inputField} onChange={this.handleTagsChange} type="text" name="tags" placeholder="tags (defaulted to others)" value={this.state.tags} /><br />
            <textarea className={styles.inputField} onChange={this.handleNotesChange} type="text" name="notes" placeholder="notes" value={this.state.notes} /><br />
          </div>
          <div className={styles.controls}>
            <button className={styles.button} onClick={() => this.save(this.props.cardId)}>Save</button><br />
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