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
      prevCard: null
    }
    this.changeEditorMode = this.changeEditorMode.bind(this);
  }

  changeEditorMode(currentCard) {
    if (this.state.prevCard != null) {
      this.state.prevCard.save(this.state.prevCard.cardId);
      this.state.prevCard.setState({editorMode: false});
    }
    this.setState({ prevCard: currentCard })
  }

  getNotes() {
    axios({
      method: 'get',
      url: '/users/1/notes/2018-05-13'
    })
    .then(res => {
      this.setState({ cards: res.data })
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

  componentDidMount() {
    this.getNotes();
  }

  render() {
    let currentDate = null;
    const renderCards = this.state.cards.map((card, index) => {
      const formattedDate = this.formatDate(card.created_at);
      if (formattedDate != currentDate) {
        currentDate = formattedDate;
        return (
          <div key={index}>
            <h3 className={styles.date}>{formattedDate}</h3>
            <Card
              changeEditorMode={this.changeEditorMode}
              cardId={card.id}
              tags={card.tags}
              notes={card.notes}
              editorMode={false}
            />
          </div>
        )
      } else {
        return (
          <div key={index}>
            <Card
              changeEditorMode={this.changeEditorMode}
              cardId={card.id}
              tags={card.tags}
              notes={card.notes}
              editorMode={false}
            />
          </div>
        )
      }
    })
    const todayDate = this.formatDate(Date.now());
    let displayCurrentDate;
    if (currentDate != todayDate) {
      displayCurrentDate = (<h3 className={styles.date}>
                              {todayDate}
                            </h3>
                           );
    }  
    
    return (
      <div>
        <div className={styles.header}>
          <h1 className={styles.logo}>NOCOLI</h1>
        </div>
        <div className={styles.mainContainer}>
          {renderCards}
          {displayCurrentDate}
          <Card
            changeEditorMode={this.changeEditorMode}
            cardId={null}
            tags="others"
            notes="Click here to start typing..."
            editorMode={false}
          />
        </div>
      </div>
    );
  }
}

export default hot(module)(App);
