<template>
  <div class="home mt-5 container">
    <h1>Bienvenue sur notre page d'accueil !</h1>
    <br/>
    <section v-if="loginStatus == true">
        <h2>Les derniers articles disponible :</h2>
        <div class="button--top">
          <router-link to="/add-article"><button class="btn btn-primary new-article btn-sm"><i class="fa fa-plus" aria-hidden="true"></i> Nouvel Article</button></router-link>
        </div>
        <Articles
          :articles="articles"
        />
        <div class="button--bottom">
          <router-link to="/articles"><button class="btn btn-primary see-more-article btn-sm ">Voir plus d'articles</button></router-link>
        </div>
    </section>
    <section v-else class="mt-4">
      <p class="h4"><router-link to="/login" class="font-weight-bold">Connectez-vous ici !</router-link></p>
    </section>
    <ErrorMess 
      :showErrorRes="showErrorRes"
      :errorMessage="errorMessage"
    />
  </div>
</template>

<script>

import Articles from '../components/Articles'
import ErrorMess from '../components/errorMessage'

export default {
  name: 'Home',
  components: {
    Articles,
    ErrorMess
  },
  mounted: function(){
    if (!sessionStorage.getItem('token') || !sessionStorage.getItem('userId')){
      this.loginStatus = false;
    }
    const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('token') },
                body: ""
            }
        fetch("/api/article/new/", requestOptions)
            .then(async response => {
                const data = await response.json();
                if (!response.ok) {
                    const error = (data && data.message) || response.statusText;
                    return Promise.reject(error);
                }
                this.articles = data.DATA;
            })
            .catch(error => {
                this.showErrorRes = true 
                this.errorMessage = "Une erreur de connection à l'API est survenue.";
                console.error("There was an error!", error);
            });
  },
  data(){
    return{
      loginStatus: true,
      articles: null,
      showErrorRes: false,
      errorMessage: null
    }
  }
}
</script>

<style lang="scss" scoped>
  h1, h2, p{
    text-align: center;
  }
  .button--top{
    display: flex;
    justify-content: space-between;
      button{
            margin-top: 2rem;
            margin-right: 1rem;
            margin-left: 1rem;
      }
  }
  .button--bottom{
    display: flex;
    justify-content: flex-end;
    margin-right: 1rem;
  }
</style>