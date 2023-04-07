import axios from 'axios';

const API_URL = 'https://swapi.dev/api/';

export const getFilms = () => {
  return axios.get(API_URL + 'films/');
};

export const getFilm = (id) => {
  return axios.get(API_URL + `films/${id}/`);
};

export const createFilm = (film) => {
  return axios.post(API_URL + 'films/', film);
};

export const updateFilm = (id, film) => {
  return axios.put(API_URL + `films/${id}/`, film);
};

export const deleteFilm = (id) => {
  return axios.delete(API_URL + `films/${id}/`);
};
