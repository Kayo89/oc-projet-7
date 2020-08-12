<template>
    <div class="Articles container">
        <h1>Tous les articles disponible :</h1>
        <router-link to="/add-article"><button class="btn btn-primary new-article btn-sm"><i class="fa fa-plus" aria-hidden="true"></i> Nouvel Article</button></router-link>
        <div class="table-responsive">
            <table class="table table-hover table-dark mt-2">
                <thead>
                <tr>
                    <th scope="col">Titre des articles</th>
                    <th scope="col">Créé par</th>
                    <th scope="col">Réponses</th>
                    <th scope="col">Ajouté</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="article in articles" :key="article.id">
                    <td><router-link :to="'/article/'+article.id"> {{ article.title }} </router-link></td>
                    <td><router-link :to="'/user/'+article.user_id">{{ article.first_name }} {{ article.last_name }}</router-link></td>
                    <td><i class="fa fa-reply" aria-hidden="true"></i> {{ article.replyCount }}</td>
                    <td>{{ article.date_created | formatDateFromNow }}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <ErrorMess 
            :showErrorRes="showErrorRes"
            :errorMessage="errorMessage"
        />
    </div>
</template>

<script>

import ErrorMess from '../components/errorMessage'

export default {
    name: "Articles",
    data(){
        return{
            articles: null,
            showErrorRes: false
        }
  },
  components: {
      ErrorMess
  },
  mounted: function(){
        if (!sessionStorage.getItem('token') || !sessionStorage.getItem('userId')){
            this.$router.push('/login')
        }
        const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }
        fetch("http://192.168.1.16:3000/api/article", { headers })
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
    .Articles{
        h1{
            text-align: center;
        } 
        .new-article{
            margin-top: 2rem;
            margin-left: 1rem;
        }
        a{
            color: lightblue;
            font-weight: bold;
        }
    }
</style>