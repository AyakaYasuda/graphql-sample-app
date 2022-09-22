import React, { useState } from 'react';
import { useQuery, useLazyQuery, useMutation, gql } from '@apollo/client';

const QUERY_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      username
      age
      nationality
    }
  }
`;

const QUERY_ALL_MOVIES = gql`
  query GetAllMovies {
    movies {
      id
      name
      yearOfPublication
      isInTheaters
    }
  }
`;

const QUERY_MOVIE_BY_NAME = gql`
  query Movie($name: String!) {
    movie(name: $name) {
      name
      yearOfPublication
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      username
      age
      nationality
    }
  }
`;

const DisplayData = () => {
  const [inputMovie, setInputMovie] = useState('');

  // create user state
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState();
  const [nationality, setNationality] = useState('');

  // query
  const { data, loading, refetch } = useQuery(QUERY_ALL_USERS);
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
  const [fetchMovie, { data: searchedMovieData, error: movieSearchingError }] =
    useLazyQuery(QUERY_MOVIE_BY_NAME);

  // mutation
  const [createUser] = useMutation(CREATE_USER_MUTATION);

  if (loading) {
    return <p>Data is loading...</p>;
  }

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Name..."
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username..."
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age..."
          onChange={(e) => setAge(Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="Nationality..."
          onChange={(e) => setNationality(e.target.value.toUpperCase())}
        />
        <button
          onClick={() => {
            createUser({
              variables: {
                input: {
                  name,
                  username,
                  age,
                  nationality,
                },
              },
            });

            refetch();
          }}
        >
          CREATE USER
        </button>
      </div>

      {data &&
        data.users.map((user) => (
          <div>
            <p>Name: {user.name}</p>
            <p>Username: {user.username}</p>
            <p>Age: {user.age}</p>
            <p>Nationality: {user.nationality}</p>
          </div>
        ))}

      {movieData &&
        movieData.movies.map((movie) => (
          <div>
            <p>MovieName: {movie.name}</p>
          </div>
        ))}

      <div>
        <input
          type="text"
          placeholder="Interstellar..."
          onChange={(e) => setInputMovie(e.target.value)}
        />
        <button
          onClick={() => {
            fetchMovie({
              variables: {
                name: inputMovie,
              },
            });
          }}
        >
          FETCH DATA
        </button>
        <div>
          <h2>Search Result</h2>
          {searchedMovieData && (
            <div>
              <p>MovieName: {searchedMovieData.movie.name}</p>
              <p>
                Year of publication: {searchedMovieData.movie.yearOfPublication}
              </p>
            </div>
          )}
          {movieSearchingError && <p>There was an error when searching data</p>}
        </div>
      </div>
    </div>
  );
};

export default DisplayData;
