/* eslint-disable */

import React from 'react';
import {hot} from 'react-hot-loader';
import Results from './components/results/results';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import styles from './style.scss';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      prevClickType: "index",
      pageNumber: 1,
      searchTerm: "",
      moviesList: []
    }
    this.handleOnScroll = this.handleOnScroll.bind(this);
  }

  changeHandler(event) {
    this.setState({ searchTerm: event.target.value })
  }

  queryTVMazeAPI(url) {
    const result = fetch(url)
      .then((response) => response.json())
      .then((data) => data)
      .catch((err) => console.error(err))
    return result;
  }

  async searchMovie() {
    const searchTerm = this.state.searchTerm.toLowerCase().replace(/\s/g, '+');
    const url = 'http://api.tvmaze.com/search/shows?q=' + this.state.searchTerm;
    const moviesList = await this.queryTVMazeAPI(url);
    this.setState({ prevClickType: 'search', moviesList: moviesList });
  }

  getAllMoviesClick() {
    if (this.state.prevClickType == 'search') {
      this.setState({pageNumber: 1}, this.getAllMovies);
      
    }
  }
  async getAllMovies() {
    const url = 'http://api.tvmaze.com/shows?page=' + this.state.pageNumber;
    const moviesList = await this.queryTVMazeAPI(url);
    if (this.state.prevClickType == 'search') {
      this.setState({ prevClickType: 'index', moviesList: moviesList });
    } else {
      this.setState({ prevClickType: 'index', moviesList: [...this.state.moviesList, ...moviesList] });
    }
  }

  componentDidMount() {
    this.getAllMovies();
    window.addEventListener('scroll', this.handleOnScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleOnScroll);
  }

  handleOnScroll() {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;

    const clientHeight = document.documentElement.clientHeight || window.innerHeight;

    const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if (this.state.prevClickType == 'index' && scrolledToBottom) {
      const pageNumber = this.state.pageNumber + 1;
      this.setState({pageNumber: pageNumber});
      this.getAllMovies();
    }
  }

  render() {
    return (
      <div>
        <h1><a onClick={() => this.getAllMoviesClick()}>TVMaze React</a></h1>
        <input onChange={(event) => this.changeHandler(event)} styles={styles.input} placeholder={this.props.placeholder}/><br />
        <button onClick={() => this.searchMovie()} >Search</button>
        <Results moviesList={this.state.moviesList} type={this.state.prevClickType} />
      </div>
    );
  }
}

export default hot(module)(App);
