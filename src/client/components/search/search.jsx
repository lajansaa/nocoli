/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';
import { results } from './results.js'

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      searchTerm: "",
      moviesList: []
    }
  }

  changeHandler(event) {
    this.setState({ searchTerm: event.target.value })
  }

  searchMovie() {
    const search = new RegExp(this.state.searchTerm, 'i');
    const movieList = results.filter(movie => search.test(movie.show.name));
    this.setState({ moviesList: movieList });
  }

  renderMoviesList() {
    return (this.state.moviesList.map((movie, index) => {
      return (
        <div key={index}>
          <div>
            <img src={movie.show.image.medium} />
          </div>
          <p>{movie.show.name}</p>
        </div>
      )
    })
  )}

  render() {
    return (
      <div>
        <input onChange={(event) => this.changeHandler(event)} placeholder={this.props.placeholder}/><br />
        <button onClick={() => this.searchMovie(this.state)} styles={styles.button}>Search</button>
        <div className={styles.results}>{this.renderMoviesList()}</div>
      </div>
    );
  }
}

Search.propTypes = {
  placeholder: PropTypes.string
}

export default Search;