<template>
  <div class="home mt-5">
    <h1>Bienvenue sur notre page d'accueil !</h1>
    <br/>
    <section v-if="loginStatus == true">
      <button @click="getData" class="btn btn-primary">Voir article</button>
      <table v-if="displayTable === true" class="shadow">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Utilisateur</th>
          </tr>
        </thead>
        <tr v-for="article in articles" :key="article.id">
          <td><router-link :to="'/article/'+article.id"> {{ article.title }} </router-link></td>
          <td>Créé par : {{ article.first_name }} {{ article.last_name }}</td>
        </tr>
      </table>
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
      //this.$router.push('/login')
      this.loginStatus = false;
    }
  },
  data(){
    return{
      item: [],
      articles: null,
      displayTable: false,
      loginStatus: true
    }
  },
  methods: {
    getData(){
      // var xhttp = new XMLHttpRequest();
      // xhttp.onreadystatechange = function() {
      //     if (this.readyState == 4 && this.status == 200) {
      //       let data_res = JSON.parse(this.responseText);
      //       this.item = data_res.DATA;
      //       this.articles = this.responseText;
      //       document.getElementById('allArticle').innerText = this.articles;
      //       //console.log(this.item)
      //     }
      // };
      // xhttp.open("GET", "http://localhost:3000/api/article", true);
      // xhttp.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
      // xhttp.send();
      // console.log(this.item)

      const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }
      fetch("http://localhost:3000/api/article", { headers })
        .then(async response => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response statusText
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
          }

          this.articles = data.DATA;
          this.displayTable = true;
          console.log(this.articles);
        })
        .catch(error => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
    }
  }
}
</script>

<style lang="scss" scoped>
  table{
    margin: 5rem auto;
    text-align: left;
    width: 500px;
    border: 2px solid black;
  }
  td, th{
    border: 1px solid black;
    padding: 0.5rem;
  }
</style>