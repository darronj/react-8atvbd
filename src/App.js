import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { getFilms, getFilm, createFilm, updateFilm, deleteFilm } from './api';

function App() {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    loadFilms();
  }, []);

  const loadFilms = async () => {
    const response = await getFilms();
    setFilms(response.data.results);
  };

  const deleteHandler = async (id) => {
    await deleteFilm(id);
    loadFilms();
  };

  const createHandler = async (film) => {
    await createFilm(film);
    loadFilms();
  };

  const updateHandler = async (id, film) => {
    await updateFilm(id, film);
    loadFilms();
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/create">Create Film</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/create">
            <CreateFilm createHandler={createHandler} />
          </Route>
          <Route path="/edit/:id">
            <EditFilm updateHandler={updateHandler} />
          </Route>
          <Route path="/films/:id">
            <FilmDetails deleteHandler={deleteHandler} />
          </Route>
          <Route path="/">
            <FilmsList films={films} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function FilmsList({ films }) {
  return (
    <div>
      <h2>Films List</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Director</th>
            <th>Release Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {films.map((film) => (
            <tr key={film.url}>
              <td>
                <Link to={`/films/${film.url.split('/').slice(-2)[0]}/`}>
                  {film.title}
                </Link>
              </td>
              <td>{film.director}</td>
              <td>{film.release_date}</td>
              <td>
                <Link to={`/edit/${film.url.split('/').slice(-2)[0]}/`}>
                  Edit
                </Link>{' '}
                |{' '}
                <button
                  onClick={() =>
                    deleteHandler(film.url.split('/').slice(-2)[0])
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FilmDetails({ match, deleteHandler }) {
  const [film, setFilm] = useState(null);

  useEffect(() => {
    const fetchFilm = async () => {
      const response = await getFilm(match.params.id);
      setFilm(response.data);
    };
    fetchFilm();
  }, [match.params.id]);

  if (!film) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{film.title}</h2>
      <p>Director: {film.director}</p>
      <p>Release Date: {film.release_date}</p>
      <p>Opening Crawl: {film.opening_crawl}</p>
      <button onClick={() => deleteHandler(match.params.id)}>Delete</button>
    </div>
  );
}

function CreateFilm({ createHandler }) {
  const [film, setFilm] = useState({});

  const submitHandler = (e) => {
    e.preventDefault();
    createHandler(film);
  };

  const changeHandler = (e) => {
    setFilm({ ...film, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Create Film</h2>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" name="title" onChange={changeHandler} />
        </div>
        <div>
          <label htmlFor="director">Director:</label>
          <input type="text" name="director" onChange={changeHandler} />
        </div>
        <div>
          <label htmlFor="release_date">Release Date:</label>
          <input type="text" name="release_date" onChange={changeHandler} />
        </div>
        <div>
          <label htmlFor="opening_crawl">Opening Crawl:</label>
          <textarea name="opening_crawl" onChange={changeHandler}></textarea>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

function EditFilm({ match, updateHandler }) {
  const [film, setFilm] = useState(null);

  useEffect(() => {
    const fetchFilm = async () => {
      const response = await getFilm(match.params.id);
      setFilm(response.data);
    };
    fetchFilm();
  }, [match.params.id]);

  const submitHandler = (e) => {
    e.preventDefault();
    updateHandler(match.params.id, film);
  };

  const changeHandler = (e) => {
    setFilm({ ...film, [e.target.name]: e.target.value });
  };

  if (!film) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Edit Film</h2>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            name="title"
            value={film.title}
            onChange={changeHandler}
          />
        </div>
        <div>
          <label htmlFor="director">Director:</label>
          <input
            type="text"
            name="director"
            value={film.director}
            onChange={changeHandler}
          />
        </div>
        <div>
          <label htmlFor="release_date">Release Date:</label>
          <input
            type="text"
            name="release_date"
            value={film.release_date}
            onChange={changeHandler}
          />
        </div>
        <div>
          <label htmlFor="opening_crawl">Opening Crawl:</label>
          <textarea
            name="opening_crawl"
            value={film.opening_crawl}
            onChange={changeHandler}
          ></textarea>
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

function App() {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    const fetchFilms = async () => {
      const response = await getAllFilms();
      setFilms(response.data.results);
    };
    fetchFilms();
  }, []);

  const createHandler = async (film) => {
    const response = await createFilm(film);
    setFilms([...films, response.data]);
  };

  const updateHandler = async (id, film) => {
    const response = await updateFilm(id, film);
    setFilms(
      films.map((f) => (f.url === response.data.url ? response.data : f))
    );
  };

  const deleteHandler = async (id) => {
    await deleteFilm(id);
    setFilms(
      films.filter((f) => f.url !== 'https://swapi.dev/api/films/${id}/')
    );
  };

  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/create/">Create Film</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route exact path="/">
          <FilmsList films={films} deleteHandler={deleteHandler} />
        </Route>
        <Route path="/create/">
          <CreateFilm createHandler={createHandler} />
        </Route>
        <Route path="/edit/:id/">
          <EditFilm updateHandler={updateHandler} />
        </Route>
        <Route path="/films/:id/">
          <FilmDetails deleteHandler={deleteHandler} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
