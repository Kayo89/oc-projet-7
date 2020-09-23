<template>
  <div class="home mt-5 mb-4 container">
    <h1>Bienvenue sur notre page d'accueil !</h1>
    <br/>
    <section v-if="loginStatus == true" class="row">
      <div class="col-md-10 mx-auto">
        <b-tabs 
          card
          content-class="mt-3" 
          align="center"
          active-nav-item-class="font-weight-bold text-uppercase text-danger"
          class="testing"
          >
          <b-tab title="Nouveauté" active>
            <Articles
              :articles="lastArticles"
            />
          </b-tab>
          <b-tab title="Populaires">
            <Articles
              :articles="mostReplyArticles"
            />
          </b-tab>
          <b-tab title="Top Likes">
            <Articles
              :articles="mostLikesArticles"
            />
          </b-tab>
          <b-tab title="Tous les articles">
            <Articles
              :articles="allArticles"
            />
          </b-tab>
        </b-tabs>
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
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Articles,
    ErrorMess
  },
    data(){
    return{
      loginStatus: true,
      lastArticles: null,
      mostLikesArticles: null,
      showErrorRes: false,
      errorMessage: null,
      mostReplyArticles: null,
      allArticles: null,
    }
  },
  mounted: async function(){
    if (!sessionStorage.getItem('token') || !sessionStorage.getItem('userId')){
      this.loginStatus = false;
    }else{
      this.lastArticles = await this.getArticles('date_created')
      this.mostLikesArticles = await this.getArticles('likes')
      this.mostReplyArticles = await this.getArticles('replyCount')
      this.allArticles = await this.getAllArticles()
    }
  },
  methods: {
    async getArticles(sort){
      let data = { sort: sort }
      try{
        let result = await axios.post('/api/article/sort', data, { headers: this.$store.state.requestHeaders })
        return await result.data.articles
      }catch(err){
        this.showErrorRes = true 
        this.errorMessage = "Une erreur de connection à l'API est survenue.";
      }
    },
    async getAllArticles(){
      try{
        let result = await axios.get('/api/article/', { headers: this.$store.state.requestHeaders })
        return await result.data.DATA
      }catch(err){
        this.showErrorRes = true 
        this.errorMessage = "Une erreur de connection à l'API est survenue.";
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  .home{
    h2{
      font-size: 1.6rem;
    }
    .nav-item{
      font-size: 3rem;
    }
  }
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
  .testing{
    background-color: lighten($color: rgb(202, 234, 236), $amount: 2);
    border: 1px solid darken($color: rgb(202, 234, 236), $amount: 10);
    border-radius: 10px;
    box-shadow: 5px 5px 5px darken($color: rgb(202, 234, 236), $amount: 10);
  }
</style>