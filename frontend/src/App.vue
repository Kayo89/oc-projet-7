<template>
  <div id="app">
    <div id="nav">
      <span><router-link  to="/"><i class="fa fa-home" aria-hidden="true"></i> Home</router-link> | </span>
      <span v-show="showLogMenu"><router-link  to="/add-article"><i class="fa fa-plus" aria-hidden="true"></i> Nouvel Article</router-link> | </span>
      <span v-show="showLogMenu"><router-link to="/profile"><i class="fa fa-user-circle-o" aria-hidden="true"></i> Profile</router-link> | </span>
      <span v-show="showLogin"><router-link to="/login"><i class="fa fa-sign-in" aria-hidden="true"></i> Login</router-link></span>
      <span v-show="showLogMenu" @click="modalShow = !modalShow" class="font-weight-bold logout">Déconnexion <i class="fa fa-sign-out" aria-hidden="true"></i></span>
      <router-link  to="/"><img alt="Goupomania logo" src="./assets/logo.png" class="logo-img col-12"></router-link>
      <hr />
    </div>

    <b-modal ref="logout-modal" v-model="modalShow" hide-footer title="Voulez vous vraimnent vous deconnecter ?" hide-backdrop content-class="shadow">
      <b-button class="mt-3 col-6 offset-3" variant="danger" block @click="logOut">Se déconnecter</b-button>
      <b-button class="mt-2 col-6 offset-3" variant="secondary" block @click="hideModal">Annuler</b-button>
    </b-modal>
    <router-view/>
  </div>
</template>

<script>

export default {
  data(){
    return{
      showLogMenu: false,
      showLogin: true,
      modalShow: false,
      errorMessage: null,
      showError: false
    }
  },
  mounted: function(){
    this.navStatus();
  },
  updated: function(){
    this.navStatus();
  },
  methods: {
    hideModal() {
        this.$refs['logout-modal'].hide()
    },
    navStatus(){
      if (!sessionStorage.getItem('token') || !sessionStorage.getItem('userId')){
        this.showLogMenu = false
        this.showLogin = true
      }else{
        this.showLogMenu = true
        this.showLogin = false
      }
    },
    logOut(){
        this.hideModal();
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        this.$store.commit("setRequestHeaders", { token: null, userId: null })
        this.$router.push('/login')
    }
  }
}

</script>

<style lang="scss">
body{
  background-color: rgb(202, 234, 236);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.logout{
  cursor: pointer;
  &:hover{
    color: darkred !important;
  }
}

.logo-img{
    max-width: 380px;
    display: block;
    margin: 2rem auto;
}

#nav {
  padding: 30px;
  text-align: center;
  hr{
    max-width: 380px;
    border: 1px solid black;
  }
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.areaText{
  background-color: white;
  border: 1px black solid;
  padding: .5rem;
}
.article-txt, .reply-txt{
  img{
      max-width: 300px;
      height: auto;
    }
  @media (min-width: 576px){
    img{
      max-width: 310px;
      height: auto;
    }
  }
  @media (min-width: 768px){
    img{
      max-width: 620px;
      height: auto;
    }
  }
  @media (min-width: 992px){
    img{
      max-width: 840px;
      height: auto;
    }
  }
  @media (min-width: 1200px){
    img{
      max-width: 1000px;
      height: auto;
    }
  }
}
</style>
