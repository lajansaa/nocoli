/* eslint-disable */
import React from 'react';
import styles from './style.scss';
import axios from 'axios';
import TextArea from 'react-textarea-autosize';
import Remarkable from 'remarkable';
import hljs from 'highlight.js';
import Tooltip from 'material-ui-next/Tooltip';

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorMode: props.editorMode,
      tags: props.tags,
      notes: props.notes,
      cardId: props.cardId,
      formattedNotes: props.formattedNotes
    }
    this.changeEditorMode = this.changeEditorMode.bind(this);
    this.closeEditorMode = this.closeEditorMode.bind(this);
    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    // this.highlight = this.highlight.bind(this);
    // this.review = this.review.bind(this);
    // this.delete = this.delete.bind(this);
  }

  handleTagsChange(event) {
    this.setState({ tags: event.target.value });
  }

  formatNotes() {
    const highlight = (str, lang) => {
                         if (lang && hljs.getLanguage(lang)) {
                           try {
                             return hljs.highlight(lang, str).value;
                           } catch (err) {}
                         }

                         try {
                           return hljs.highlightAuto(str).value;
                         } catch (err) {}

                         return '';
                      }

    const markdown = new Remarkable('full', { breaks: true,
                                              highlight: highlight
                                            }
                                    );
    let formattedNotes = markdown.render(this.state.notes);
    this.setState({ formattedNotes: formattedNotes });
  }

  handleNotesChange(event) {
    this.setState({ notes: event.target.value }, () => {
      const obj = { cardId: this.state.cardId,
                  tags: this.state.tags,
                  notes: this.state.notes
                }
      this.props.setPrev(obj);
      this.formatNotes();
    });
  }

  changeEditorMode() {
    // this.props.changeEditorMode(this, cardId);
    const obj = { cardId: this.state.cardId,
                  tags: this.state.tags,
                  notes: this.state.notes
                }
    console.log('card obj', obj);
    this.props.changeEditorMode(obj);
    // this.setState({ editorMode: true });
  }

  closeEditorMode(cardId) {
    const obj = { cardId: -1,
                  tags: null,
                  notes: null
                }
    this.props.changeEditorMode(obj);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ cardId: nextProps.cardId,
                    editorMode: nextProps.editorMode,
                    tags: nextProps.tags,
                    notes: nextProps.notes,
                    formattedNotes: nextProps.formattedNotes })
  }

  save() {
    this.setState({ editorMode: false });
    const obj = { cardId: this.state.cardId,
                  tags: this.state.tags,
                  notes: this.state.notes
                }
    this.props.save(obj);
    
  }

  render() {
    if (this.state.editorMode == true) {
      return (
          <div className={styles.cardGrid}>
            <div className={styles.spacer}></div>
            <div>
              <div className={styles.controls}>
                <div className={styles.leftControls}>
                  <span className={styles.tagLabel}>Tags: </span><input className={styles.inputField} onChange={this.handleTagsChange} type="text" name="tags" placeholder="default: others" value={this.state.tags} />
                </div>
                <div className={styles.rightControls}>
                  <button className={styles.deleteBtn} onClick={this.props.delete} >delete</button>
                  <button className={styles.closeBtn} onClick={() => this.closeEditorMode(this.state.cardId)} >close</button>
                </div>
              </div>
              <p className={styles.markdownGuide}>**bold**, *italic*, ~~strikethrough~~, ==highlight==, `code`, ```blockcode```, [text](hyperlink)</p>
              <Tooltip id="tooltip-right-start" title="click for markdown guide" placement="right-start">
                <a href="https://jonschlinkert.github.io/remarkable/demo/" target="_blank"><button className={styles.markdownBtn}>?</button></a>
              </Tooltip>
              <div className={styles.codeGrid}>
                <div className={styles.codeGridItem}>
                  <TextArea
                    autoFocus
                    className={styles.autoExpand} 
                    onChange={this.handleNotesChange}
                    rows="1"
                    name="notes"
                    placeholder={this.state.placeholder}
                    value={this.state.notes}
                  />
                </div>
                <div dangerouslySetInnerHTML={{__html: this.state.formattedNotes}} className={styles.codeGridItem}/>
              </div>
            </div>
          </div>
      )
    } else {
      return (
        <div onClick={() => this.changeEditorMode()}>
          <div className={styles.cardGrid}>
            <div className={styles.spacer}></div>
            <div dangerouslySetInnerHTML={{__html: this.state.formattedNotes}} />
          </div>
        </div>
      )
    }
  }
}

export default Card;