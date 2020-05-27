<template>
  <q-page class="q-pa-lg">
    <div v-if="user==undefined">
      <h5 class="q-mt-none">Login</h5>
      <section id="firebaseui-auth-container"></section>
    </div>
    <div v-else>
      <h5 class="q-mt-none">Logout</h5>
      <div class="card horizontal" style="max-width:400px;margin:0 auto;" v-if="user">
        <div class="card-image" style="margin-top:25px;margin-left:10px;">
          <img
            :src="user.photoURL"
            style="width:75px;height:75px;border-radius:50%;border:4px solid #333"
          />
        </div>
        <div class="card-stacked">
          <div class="card-content">
            <p>
              name:
              <strong>{{user.displayName}}</strong>
              <br />email:
              <strong>{{user.email}}</strong>
              <br />uid:
              <strong>{{user.uid}}</strong>
              <!--
              <br />provider:
              <strong class="teal-text">{{user.providerData[0].providerId}}</strong>
              -->
            </p>
          </div>
        </div>
      </div>

      <q-btn @click="logout">Logout</q-btn>
    </div>
  </q-page>
</template>

<script>
import firebase from "firebase";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

export default {
  data() {
    return {
      user: null,
      newTask: "",
      tasks: []
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("Login Changed :: ", user);
        this.user = user;
      }
    });
  },
  methods: {
    login() {
      var vm = this;
      let ui = firebaseui.auth.AuthUI.getInstance();
      if (!ui) {
        ui = new firebaseui.auth.AuthUI(firebase.auth());
      }
      //var ui = new firebaseui.auth.AuthUI(firebase.auth());
      var uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            console.log("signInSuccessWithAuthResult", authResult, redirectUrl);

            vm.user = authResult.user;
            console.log("USER::", vm.user);

            firebase
              .auth()
              .currentUser.updateProfile(user)
              .then(res => {
                vm.$router.go();
              });
          },
          signInFailure: function(error) {
            console.log("signInFailure", error);
            alert(error.message);
            vm.$router.go();
          }
        },
        autoUpgradeAnonymousUsers: true,
        signInFlow: "redirect",
        signInSuccessUrl: "/",
        //signInFlow: "popup",
        //signInSuccessUrl: "/#/todo",
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ]
      };
      ui.start("#firebaseui-auth-container", uiConfig);
    },
    logout() {
      var vm = this;
      this.user = undefined;
      if (!firebase.auth().currentUser) {
        alert("signOut 1", this.user);
        return;
      }
      firebase
        .auth()
        .signOut()
        .then(function(res) {
          vm.login();
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  mounted() {
    this.login();
  }
};
</script>
