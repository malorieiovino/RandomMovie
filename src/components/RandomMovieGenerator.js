import React, { useState, useEffect } from 'react';
import './RandomMovieGenerator.css';

const RandomMovieGenerator = () => {
  // State for movies list and the selected movie
  const [movies, setMovies] = useState([]);
  const [randomMovie, setRandomMovie] = useState(null);
  const [newMovie, setNewMovie] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Sample movies to start with
  const [useDefaultMovies, setUseDefaultMovies] = useState(true);
  const defaultMovies = [
    "The Shawshank Redemption",
    "The Godfather",
    "Pulp Fiction",
    "The Dark Knight",
    "Forrest Gump",
    "Inception",
    "The Matrix",
    "Interstellar",
    "Parasite",
    "The Lion King"
  ];
  
  // Load saved movies from localStorage or use defaults
  useEffect(() => {
    const savedMovies = localStorage.getItem('movieList');
    const savedDefaultSetting = localStorage.getItem('useDefaultMovies');
    
    if (savedMovies) {
      setMovies(JSON.parse(savedMovies));
      setUseDefaultMovies(savedDefaultSetting === 'true');
    } else if (useDefaultMovies) {
      setMovies(defaultMovies);
    }
  }, []);
  
  // Save movies to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('movieList', JSON.stringify(movies));
    localStorage.setItem('useDefaultMovies', useDefaultMovies.toString());
  }, [movies, useDefaultMovies]);

  // Function to add a movie to the list
  const addMovie = () => {
    if (newMovie.trim() === '') {
      setErrorMessage('Please enter a movie title');
      return;
    }
    
    // If this is the first custom movie, clear defaults
    if (useDefaultMovies) {
      setMovies([newMovie]);
      setUseDefaultMovies(false);
    } else {
      setMovies([...movies, newMovie]);
    }
    
    setNewMovie('');
    setErrorMessage('');
  };

  // Function to remove a movie from the list
  const removeMovie = (index) => {
    const updatedMovies = [...movies];
    updatedMovies.splice(index, 1);
    setMovies(updatedMovies);
  };
  
  // Function to clear all movies
  const clearMovies = () => {
    setMovies([]);
    setRandomMovie(null);
    setUseDefaultMovies(false);
  };
  
  // Function to reset to default movies
  const resetToDefaults = () => {
    setMovies(defaultMovies);
    setRandomMovie(null);
    setUseDefaultMovies(true);
  };

  // Function to generate a random movie
  const generateRandomMovie = () => {
    if (movies.length === 0) {
      setErrorMessage('Please add some movies first');
      return;
    }
    
    try {
      const randomIndex = Math.floor(Math.random() * movies.length);
      setRandomMovie(movies[randomIndex]);
      
      // Save the last selected movie to localStorage
      localStorage.setItem('lastRandomMovie', movies[randomIndex]);
      setErrorMessage('');
    } catch (error) {
      console.error('Error generating random movie:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };
  
  // Load the last generated movie when the app starts
  useEffect(() => {
    const lastMovie = localStorage.getItem('lastRandomMovie');
    if (lastMovie) {
      setRandomMovie(lastMovie);
    }
  }, []);

  // Handle key press for adding movies
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addMovie();
    }
  };

  return (
    <div className="container">
      <h1 className="title">Random Movie Generator</h1>
      
      {/* Input for adding movies */}
      <div className="input-container">
        <div className="input-group">
          <input
            type="text"
            value={newMovie}
            onChange={(e) => setNewMovie(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a movie title"
            className="movie-input"
          />
          <button
            onClick={addMovie}
            className="add-button"
          >
            Add
          </button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      
      {/* Action buttons */}
      <div className="button-group">
        <button
          onClick={generateRandomMovie}
          className="generate-button"
        >
          Generate Random Movie
        </button>
        <button
          onClick={clearMovies}
          className="clear-button"
        >
          Clear All
        </button>
        <button
          onClick={resetToDefaults}
          className="reset-button"
        >
          Reset
        </button>
      </div>
      
      {/* Display random movie */}
      {randomMovie && (
        <div className="result-container">
          <h2 className="result-title">You should watch:</h2>
          <p className="result-movie">{randomMovie}</p>
        </div>
      )}
      
      {/* Display movie list */}
      <div className="movie-list-container">
        <h2 className="list-title">Your Movie List ({movies.length}):</h2>
        {movies.length > 0 ? (
          <ul className="movie-list">
            {movies.map((movie, index) => (
              <li key={index} className="movie-item">
                <span>{movie}</span>
                <button
                  onClick={() => removeMovie(index)}
                  className="remove-button"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-message">No movies in your list. Add some above!</p>
        )}
      </div>
    </div>
  );
};

export default RandomMovieGenerator;
