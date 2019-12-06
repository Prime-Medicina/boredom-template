import Vue from 'vue';

import GAuth from 'vue-google-oauth2/index';
import { GOOGLE_CLIENT_ID } from '../config';

const gauthOptions = {
  clientId: GOOGLE_CLIENT_ID,
};

Vue.use(GAuth, gauthOptions);
