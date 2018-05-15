/* eslint-disable */

import React from 'react';
import {hot} from 'react-hot-loader';
import Card from './components/card/card';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import styles from './style.scss';
import axios from 'axios';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      cards: [],
      prevCard: null,
      selectedTags: 0,
      tags: []
    }
    this.changeEditorMode = this.changeEditorMode.bind(this);
    this.getCardsByTags = this.getCardsByTags.bind(this);
    this.nullPrevCard = this.nullPrevCard.bind(this);
    this.addCard = this.addCard.bind(this);
  }

  changeEditorMode(currentCard) {
    if (this.state.prevCard != null) {
      this.state.prevCard.save(this.state.prevCard.state.cardId);
      this.state.prevCard.setState({ editorMode: false });
    }
    this.setState({ prevCard: currentCard })
  }

  nullPrevCard(deletedCard) {
    const newCards = this.state.cards;
    newCards.splice(deletedCard.state.index, 1);
    this.setState({ cards: newCards });
  }

  getCardsByDate() {
    axios({
      method: 'get',
      url: '/users/1/cards/date/2018-05-13'
    })
    .then(res => {
      this.setState({ cards: res.data })
    });
  }

  getCardsByTags(event) {
    const tags = event.target.value;
    if (tags == 0) {
      this.setState({ selectedTags: 0 })
      this.getCardsByDate()
    } else {
      axios({
        method: 'get',
        url: '/users/1/cards/tags/' + tags
      })
      .then(res2 => {
        this.setState({ cards: res2.data, selectedTags: tags })
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

  addCard() {
    this.changeEditorMode(null);
    const cardsObj = Object.assign({}, this.state.cards);
    const todayDate = this.formatDate(Date.now());
    const emptyCard = {'id': null,
                       'user_id': 1,
                       'tags': 'others',
                       'notes': undefined
                      };
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
    
    let todayDate = this.formatDate(Date.now());
    let cards = this.state.cards;
    let cardsKeys = Object.keys(cards);
    
    const renderCards = cardsKeys.map((key, index) => {
      return (
        <div key={index}>
          <h3 className={styles.date}>{key}</h3>
          {cards[key].map((card, index) =>
            <Card
              key={index}
              changeEditorMode={this.changeEditorMode}
              nullPrevCard={this.nullPrevCard}
              index={index}
              notes={card.notes}
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
        </div>
        <div className={styles.mainContainer}>
          
          <form>
            <label>
              Search Tags: 
              <select value={this.state.selectedTags} onChange={this.getCardsByTags}>
                {renderTagOptions}
              </select>
            </label>
          </form>

          {renderCards}
        
          <button className={styles.button} onClick={this.addCard}>Add Card</button><br />
        </div>
      </div>
    );
  }
}

export default hot(module)(App);
