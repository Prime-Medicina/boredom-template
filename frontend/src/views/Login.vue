<template lang="pug">
  v-form.login(style="height: 100%")
    v-container(fluid style="height: 100%")

      v-row(justify="center" align="center" heigth="100%" style="height: 100%")
        div#google-signin-button
</template>

<script>
import { GOOGLE_CLIENT_ID } from '@/config';

export default {
  name: 'Login',

  async mounted() {
    this.initGoogleAuth();
    this.renderGoogleSignInButton();
  },

  methods: {
    async initGoogleAuth() {
      return new Promise((resolve) => {
        window.gapi.load('auth2', () => {
          window.gapi.auth2.init({
            client_id: GOOGLE_CLIENT_ID,
          });
          resolve();
        });
      });
    },

    renderGoogleSignInButton() {
      window.gapi.signin2.render('google-signin-button', {
        scope: 'profile email',
        width: 240,
        height: 50,
        longtitle: true,
        theme: 'dark',
        onsuccess: this.onGoogleLoginSuccess,
        onfailure: this.onGoogleLoginFailure,
      });
    },

    onGoogleLoginSuccess(googleUser) {
      const basicProfile = googleUser.getBasicProfile();
      const authResponse = googleUser.getAuthResponse();
      const profile = {
        name: basicProfile.getName(),
        givenName: basicProfile.getGivenName(),
        familyName: basicProfile.getFamilyName(),
        imageUrl: basicProfile.getImageUrl(),
        email: basicProfile.getEmail(),
      };
      const response = {
        accessToken: authResponse.access_token,
        idToken: authResponse.id_token,
        scope: authResponse.scope,
        expiresIn: authResponse.expires_in,
        firstIssuedAt: authResponse.first_issued_at,
        expiresAt: authResponse.expires_at,
      };
      const user = {
        profile,
        response,
      };
      this.$store.dispatch('auth/login', user);
      this.$router.push({ name: 'main' });
    },

    onGoogleLoginFailure(error) {
      console.error(error);
      this.$noty.error('Authentication failed');
    },
  },
};
</script>

<style scoped>
</style>
