<template>
    <div class="ListArticles container">
        <h1>Tous les articles disponible :</h1>
        <router-link to="/add-article"><button class="btn btn-primary new-article btn-sm"><i class="fa fa-plus" aria-hidden="true"></i> Nouvel Article</button></router-link>
        <Articles
          :articles="articles"
        />
        <ErrorMess 
            :showErrorRes="showErrorRes"
            :errorMessage="errorMessage"
        />
    </div>
</template>
<script>

import ErrorMess from '../components/errorMessage'
import Articles from '../components/Articles'

export default {
    name: "ListArticles",
    data(){
        return{
            articles: null,
            showErrorRes: false,
            errorMessage: null
        }
  },
  components: {
      ErrorMess,
      Articles
  },
  mounted: function(){
        if (!sessionStorage.getItem('token') || !sessionStorage.getItem('userId')){
            this.$router.push('/login')
        }
        const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }
        fetch("/api/article", { headers })
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
  }
}
</script>

<style lang="scss">
    .ListArticles{
        h1{
            text-align: center;
        }
    }
    .new-article{
            margin-top: 2rem;
            margin-left: 1rem;
    }
</style>