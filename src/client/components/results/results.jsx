/* eslint-disable */
import React from 'react';
import styles from './style.scss';

class Results extends React.Component {
  renderList(moviesList) {
    return (moviesList.map((movie, index) => {
      if (this.props.type == 'search') {
        return (
          <div key={index}>
            <div>
              <img src={movie.show.image == null ? '#' : movie.show.image.medium } />
            </div>
            <p>{movie.show.name}</p>
          </div>
        )
      } else {
        return (
          <div key={index}>
            <div>
              <img src={movie.image == null ? '#' : movie.image.medium} />
            </div>
            <p>{movie.name}</p>
          </div>
        )
      }
    })
  )}
  render() {
    return (
      <div className={styles.results} type={this.props.type} >{this.renderList(this.props.moviesList)}</div>
    )
  }
}

export default Results;