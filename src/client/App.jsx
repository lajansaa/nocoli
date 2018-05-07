/* eslint-disable */

import React from 'react';
import {hot} from 'react-hot-loader';

import Search from './components/search/search';
import styles from './style.scss';

class App extends React.Component {
  // constructor() {
  //   super();
  //   this.state = {
  //   };
  // }

  render() {
    return (
      <div>
        <h1>TVMaze React</h1>
        <Search
          placeholder="Enter a Movie Title"
        />
      </div>
    );
  }
}

export default hot(module)(App);
