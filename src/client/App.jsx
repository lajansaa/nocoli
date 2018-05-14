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

  componentDidMount() {
    this.getNotes();
  }

  render() {
    const renderCards = this.state.cards.map((card, index) => {
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
    })

    return (
      <div>
        <div className={styles.header}>
          <h1 className={styles.logo}>NOCOLI</h1>
        </div>
        <div className={styles.mainContainer}>
          {renderCards}
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
