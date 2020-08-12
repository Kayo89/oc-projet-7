<template>
  <div class="home mt-5 container">
    <h1>Bienvenue sur notre page d'accueil !</h1>
    <br/>
    <section v-if="loginStatus == true">
      <button @click="getData" class="btn btn-primary">Voir les articles</button>
    </section>
    <section v-else class="mt-4">
      <p class="h4"><router-link to="/login" class="font-weight-bold">Connectez-vous ici !</router-link></p>
    </section>
  </div>
</template>

<script>

export default {
  name: 'Home',
  mounted: function(){
    if (!sessionStorage.getItem('token') || !sessionStorage.getItem('userId')){
      this.loginStatus = false;
    }
  },
  data(){
    return{
      loginStatus: true,
    }
  },
  methods: {
    getData(){
      this.$router.push('/articles')
    }
  }
}
</script>

<style lang="scss" scoped>
  .home{
    text-align: center;
  }
</style>