<template lang="pug">
  v-container#_playground(fluid)

    v-expansion-panels

      v-expansion-panel
        v-expansion-panel-header Backend Integration
        v-expansion-panel-content: v-row

            v-col(cols="12"): v-card
              v-card-title Authentication
              v-card-text
                v-row
                  v-col(cols="6"): v-text-field(label="Auth token" :value="integration.authToken")
                  v-col: v-btn(
                    small
                    color="primary"
                    @click="handleClickLogin"
                    :disabled="!integration.isInit"
                  ) Get AuthCode
                  v-col(v-if="!integration.isSignIn"): v-btn(
                    small
                    color="primary"
                    @click="handleClickSignIn"
                    :disabled="!integration.isInit"
                  ) Sign in
                  v-col(v-if="integration.isSignIn"): v-btn(
                    small
                    color="secondary"
                    @click="handleClickSignOut"
                    :disabled="!integration.isInit"
                  ) Sign out
                  v-col: v-checkbox(label="Is initialized?" v-model="integration.isInit")
                  v-col: v-checkbox(label="Is signed in?" v-model="integration.isSignIn")

            v-col(cols="12"): v-card
              v-card-title Requests
              v-card-text
                v-row
                  v-col(cols="2"): v-combobox(
                    label="HTTP Method"
                    v-model="integration.method"
                    :items="integration.methods"
                  )
                  v-col: v-text-field(label="Url" v-model="integration.url")

                v-row
                  v-col: v-textarea(label="Headers" v-model="integration.headers")
                  v-col: v-textarea(label="Body" v-model="integration.body")
                  v-col: v-textarea(label="Response" v-model="integration.response")

                v-row
                  v-col: v-btn(
                      small
                      color="primary"
                      @click="doRequest"
                      :loading="integration.loading"
                    ) Execute

      v-expansion-panel
        v-expansion-panel-header Chat
        v-expansion-panel-content: v-row

          v-col(cols="12"): v-card
            v-card-text
              Chat
</template>

<script>
import axios from 'axios';
import { API_URL } from '../config';
import Chat from '../components/Chat/index.vue';

export default {
  name: 'Home',

  components: {
    Chat,
  },

  data() {
    return {
      integration: {
        isInit: false,
        isSignIn: false,
        authToken: null,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        method: 'GET',
        url: API_URL,
        headers: null,
        body: null,
        response: null,
        loading: false,
      },
    };
  },

  created() {
    const checkGauthLoad = setInterval(() => {
      this.integration.isInit = this.$gAuth.isInit;
      this.integration.isSignIn = this.$gAuth.isAuthorized;
      if (this.isInit) clearInterval(checkGauthLoad);
    }, 1000);
  },

  methods: {
    handleClickLogin() {
      this.$gAuth
        .getAuthCode()
        .then((authCode) => {
          console.log('authCode', authCode);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    handleClickSignIn() {
      this.$gAuth
        .signIn()
        .then((GoogleUser) => {
          // on success do something
          console.log('GoogleUser', GoogleUser);
          console.log('getId', GoogleUser.getId());
          console.log('getBasicProfile', GoogleUser.getBasicProfile());
          console.log('getAuthResponse', GoogleUser.getAuthResponse());
          console.log(
            'getAuthResponse',
            this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse(),
          );
          window.localStorage.authCode = this
            .$gAuth.GoogleAuth.currentUser.get().getAuthResponse().id_token;
          this.integration.isSignIn = this.$gAuth.isAuthorized;
          this.integration.authToken = this.$gAuth.GoogleAuth.currentUser
            .get().getAuthResponse().id_token;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    handleClickSignOut() {
      this.$gAuth
        .signOut()
        .then(() => {
          // on success do something
          this.integration.isSignIn = this.$gAuth.isAuthorized;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    async doRequest() {
      try {
        this.integration.loading = true;
        const {
          method, url, headers, body,
        } = this.integration;
        const response = await axios({
          method,
          url,
          headers: JSON.parse(headers),
          data: JSON.parse(body),
        });
        this.integration.response = JSON.stringify({
          status: response.status,
          headers: response.headers,
          body: response.data,
        }, null, 2);
      } catch (err) {
        const { response } = err;
        this.integration.response = JSON.stringify({
          status: response.status,
          headers: response.headers,
          body: response.data,
        }, null, 2);
      } finally {
        this.integration.loading = false;
      }
    },
    exampleRequest() {
      this.integration.method = 'GET';
      this.integration.url = `${API_URL}`;
      this.integration.headers = JSON.stringify({
        Authorization: localStorage.authCode,
      }, null, 2);
      this.doRequest();
    },
  },

  watch: {
    'integration.isSignIn': function integrationIsSignIn(isSignIn) {
      if (!isSignIn) return;
      this.exampleRequest();
    },
  },
};
</script>
