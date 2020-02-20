import axios from 'axios';
import { API_URL } from '@/config';
import authAdapter from './auth';
import chatAdapter from './chat';

const request = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: '',
  },
});

// Adaptation to avoid circular dependency
const retrieveAuthToken = () => import('@/store')
  .then(({ default: store }) => store.getters['auth/loggedUser'].response.idToken);

// Intercept requests and update auth token
request.interceptors.request.use(async (config) => {
  const idToken = await retrieveAuthToken();
  const newConfig = { ...config };

  newConfig.headers.Authorization = idToken;

  return newConfig;
}, Promise.reject);

const healthCheckAdapter = async (shadowRequest) => (await shadowRequest.get('/')).data;

export const healthCheck = healthCheckAdapter(request);
export const auth = authAdapter(request);
export const chat = chatAdapter(request);
