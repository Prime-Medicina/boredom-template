<template>
  <div class="home">
    {{ healthCheck }}
    {{ fail }}

    <el-row>
      <el-button
        type="primary"
        icon="fas fa-edit"
        @click="handleClickLogin"
        :disabled="!isInit"
      >get authCode</el-button>
      <el-button
        type="primary"
        icon="fas fa-edit"
        @click="handleClickSignIn"
        v-if="!isSignIn"
        :disabled="!isInit"
      >sign in</el-button>
      <el-button
        type="primary"
        icon="fas fa-edit"
        @click="handleClickSignOut"
        v-if="isSignIn"
        :disabled="!isInit"
      >sign out</el-button>
      <i class="fas fa-edit"></i>
      <p>isInit: {{isInit}}</p>
      <p>isSignIn: {{isSignIn}}</p>
    </el-row>
  </div>
</template>

<script>
import { healthCheck, fail } from '../modules/api';

export default {
  name: 'Home',

  data() {
    return {
      healthCheck: null,
      fail: null,
      isInit: false,
      isSignIn: false,
    };
  },

  watch: {
    isSignIn() {
      healthCheck().then((result) => {
        this.healthCheck = result;
      }).catch(console.error);

      fail({ code: 201, message: 'I failed :(' }).then((result) => {
        this.fail = result;
      }).catch(console.error);
    },
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
          this.isSignIn = this.$gAuth.isAuthorized;
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
          this.isSignIn = this.$gAuth.isAuthorized;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  created() {
    const that = this;
    const checkGauthLoad = setInterval(() => {
      that.isInit = that.$gAuth.isInit;
      that.isSignIn = that.$gAuth.isAuthorized;
      if (that.isInit) clearInterval(checkGauthLoad);
    }, 1000);
  },
};
</script>
