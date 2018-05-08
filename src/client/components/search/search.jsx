/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';

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

  queryTVMazeAPI(query) {
    const url = 'http://api.tvmaze.com/search/shows?q=' + query;
    const result = fetch(url)
      .then((response) => response.json())
      .then((data) => data)
      .catch((err) => console.error(err))
    return result;
  }

 async searchMovie() {
    const formattedSearchTerm = this.state.searchTerm.toLowerCase().replace(/\s/g, '+');
    const moviesList = await this.queryTVMazeAPI(formattedSearchTerm);
    this.setState({ moviesList: moviesList });
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