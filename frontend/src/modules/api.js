import axios from 'axios';
import { API_URL } from '../config';

const request = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: localStorage.authCode,
  },
});

export const healthCheck = async () => (await request.get('/')).data;

export const fail = async ({ code, message }) => (await request.get(`/fail/${code}/${message}`)).data;

export const enquire = async (message) => {
  const { data } = await request.post('/enquire', message);
  return data;
};
