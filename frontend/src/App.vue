<template>
  <div id="app">
    <div id="nav">
      <span><router-link  to="/">Home</router-link> | </span>
      <span v-show="showAddArticle"><router-link to="/add-article">Ajouter Article</router-link> | </span>
      <span v-show="showProfile"><router-link to="/profile">Profile</router-link> | </span>
      <span v-show="showLogin"><router-link to="/login">Login</router-link></span>
      <span v-show="showDiscon" @click="logOut" class="font-weight-bold logout">Déconnexion</span>
    </div>
    <img alt="Goupomania logo" src="./assets/logo.png" class="logo-img">
    <router-view/>
  </div>
</template>

<script>
export default {
  data(){
    return{
      showDiscon: false,
      showAddArticle: false,
      showProfile: false,
      showLogin: true,
    }
  },
  mounted: function(){
    this.navStatus()
  },
  updated: function(){
    this.navStatus()
  },
  methods: {
    navStatus(){
      if (!sessionStorage.getItem('token') || !sessionStorage.getItem('userId')){
        this.showDiscon = false
        this.showAddArticle = false
        this.showProfile = false
      }else{
        this.showProfile = true
        this.showDiscon = true
        this.showLogin = false
        this.showAddArticle = true
      }
    },
    logOut(){
      if(confirm("Se déconnecter ?")){
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        this.$router.push('/login')
      }
    }
  }
}

</script>

<style lang="scss">
body{
  background-color: rgb(175, 231, 235);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.logout{
  cursor: pointer;
  &:hover{
    color: darkred !important;
  }
}

.logo-img{
    width: 380px;
    margin: 1.1rem auto;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
