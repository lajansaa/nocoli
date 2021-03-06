/* eslint-disable */

import React from 'react';
import {hot} from 'react-hot-loader';
import Card from './components/card/Card';
import styles from './style.scss';
import axios from 'axios';
import Remarkable from 'remarkable';
import hljs from 'highlight.js';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      cards: [],
      prevCard: null,
      prevCardId: -1,
      selectedTags: 0,
      tagName: '',
      tags: []
    }
    this.changeEditorMode = this.changeEditorMode.bind(this);
    this.getCardsByTags = this.getCardsByTags.bind(this);
    this.setTags = this.setTags.bind(this);
    this.addCard = this.addCard.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.formatNotes = this.formatNotes.bind(this);
  }

  changeEditorMode(currentCard, cardId) {
    if (this.state.prevCard != null) {
      this.state.prevCard.save(this.state.prevCardId);
      this.state.prevCard.setState({ editorMode: false });
    }
    this.setState({ prevCard: currentCard,
                    prevCardId: cardId })
  }

  getCardsByDate() {
    axios({
      method: 'get',
      url: '/users/1/cards/date'
    })
    .then(res => {
      this.setState({ cards: res.data })
    });
  }

  setTags(event) {
    this.setState({selectedTags: event.target.value,
                   tagName: event.target.options[event.target.selectedIndex].text

                  }, () => {
                    this.getCardsByTags()})
    
  }

  getCardsByTags() {
    if (this.state.selectedTags == 0) {
      this.getCardsByDate()
    } else {
      axios({
        method: 'get',
        url: '/users/1/cards/tags/' + this.state.selectedTags
      })
      .then(res2 => {
        this.setState({ cards: res2.data })
      })
    }
  }

  getTags() {
    axios({
      method: 'get',
      url: '/users/1/tags'
    })
    .then(res => {
      this.setState({ tags: res.data })
    });
  }

  formatDate(date) {
    const currentDate = new Date(date);
    const day = currentDate.getDate().toString().padStart(2, '0');
    const monthNames = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    const month = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear()
    return day + ' ' + month + ' ' + year;
  }

  formatNotes(notes) {
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
                                    )
    let formattedNotes = markdown.render(notes);
    return formattedNotes;
  }

  save(currentCard) {
    const tags = currentCard.tags == undefined ? 'others' : currentCard.tags;
    if (currentCard.notes != undefined) {
      axios({
        method: 'post',
        url: '/users/1/cards',
        data: {
          userId: 1,
          cardId: currentCard.cardId,
          tags: tags,
          notes: currentCard.notes
        }
      })
      .then(res => {
        this.getCardsByTags();
        this.getTags();
      })
      .catch((error) => {
        console.log(error)
      })
    }
  }

  delete(cardId) {
    if (cardId != undefined) {
      axios({
        method: 'delete',
        url: '/users/1/cards',
        data: {
          cardId: cardId
        }
      })
      .then(res => {
        this.state.prevCard.setState({ editorMode: false });
        this.setState({ prevCard: null,
                        prevCardId: -1 }, () => { this.getCardsByTags(); })
      });
    }
  }

  addCard() {
    this.changeEditorMode(null);
    const cardsObj = Object.assign({}, this.state.cards);
    const todayDate = this.formatDate(Date.now());
    let emptyCard;
    if (this.state.selectedTags != 0) {
      emptyCard = {'id': null,
                   'user_id': 1,
                   'tags': this.state.tagName,
                   'notes': undefined
                  };
    } else {
      emptyCard = {'id': null,
                   'user_id': 1,
                   'tags': 'others',
                   'notes': undefined
                  };
    }

    if (!(todayDate in cardsObj)) {
      cardsObj[todayDate] = [emptyCard]
    } else {
      cardsObj[todayDate].push(emptyCard);
    }
    this.setState({ cards: cardsObj });
  }

  componentDidMount() {
    this.getCardsByDate();
    this.getTags();
  }

  render() {
    let cards = this.state.cards;
    let cardsKeys = Object.keys(cards);
    
    const renderCards = cardsKeys.map((key, index) => {
      return (
        <div key={index}>
          <h3 className={styles.date}>{key}</h3>
          {cards[key].map((card, index) =>
              <Card
                key={index}
                cardId={card.id}
                changeEditorMode={this.changeEditorMode}
                save={this.save}
                delete={() => this.delete(card.id)}
                close={this.close}
                index={index}
                notes={card.notes}
                formattedNotes={this.formatNotes(card.notes||"Click to add notes...")}
                tags={card.tags}
                editorMode={false}
                placeholder="Click here to start typing..."
              />
            
            
          )}
        </div>
      )
    })
    
    const renderTagOptions = this.state.tags.map((tag, index) => {
      return (<option key={index} value={tag.id}>{tag.name}</option>)
    })

    return (
        <div>
          <div className={styles.header}>
            <h1 className={styles.logo}>NOCOLI</h1>
            <p className={styles.tagline}>Note·Code·Link</p>
          </div>
          <div className={styles.mainContainer}>
            
            <form>
              <label>
                Search Tags: 
                <select value={this.state.selectedTags} onChange={(event) => this.setTags(event)}>
                  {renderTagOptions}
                </select>
              </label>
            </form>
            
              {renderCards}
            
            <button className={styles.addCardBtn} onClick={this.addCard}>Add Notes</button><br />
          </div>
        </div>
      
    );
  }
}

export default hot(module)(App);
