<template>
    <section class="login col-md-8 offset-md-2 col-lg-6 offset-lg-3 add-article">
        <h1 class="m-4">Ajouter un article</h1>

        <form @submit.prevent="addArticle" class="mt-5">
            <div class="form-row">
                <div class="form-group col-12">
                    <label for="title">Titre de l'article</label>
                    <input class="form-control" type="text" placeholder="Titre de l'article ..." v-model="article.title" id="title" required>
                </div>
                <div class="form-group col-12">
                    <label for="content">Contenu de l'article</label>
                    <VueTrix class="areaText" inputId="editor1" v-model="article.contentTxt" placeholder="votre message..."/>
                </div>
            </div>
            <button type="submit" class="btn btn-primary" v-if="article.contentTxt.length > 15">Poster !</button>
        </form>
        <p class="mt-3 text-danger">{{ errorMessage }}</p>
        <p class="mt-3 text-success font-weight-bold">{{ formRes }}</p>
    </section>
</template>

<script>

import VueTrix from 'vue-trix'

export default {
    name: 'add-article',
    data() {
        return{
            article: {
                contentTxt: ""
            },
            errorMessage: "",
            formRes: ""
        }
    },
    components: {
        VueTrix
    },
    mounted: function(){
        if (!sessionStorage.getItem('token') || !sessionStorage.getItem('userId')){
            this.$router.push('/login')
        }
    },
    methods: {
        addArticle() {
            this.article.userId = parseInt(sessionStorage.getItem('userId'));
            const requestOptions = {
                method: "POST",
                headers: {  "Content-Type": "application/json", 
                            "Authorization": "Bearer " + sessionStorage.getItem('token') },
                body: JSON.stringify( this.article )
            }
            fetch("http://192.168.1.16:3000/api/article", requestOptions)
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                        return this.errorMessage = data.error;
                    }
                    this.formRes = "Article Créé ! Redirection ..."
                    setTimeout(() => {
                        this.$router.push('/articles');
                    },1500)
                    })
                .catch(() => this.errorMessage = "Une erreur de connection à l'API est survenue.")
        }
    }
}
</script>

<style lang="scss">
    .add-article{
        h1, p{
            text-align: center;
        }
    }
    .areaText{
        background-color: white;
        border: 1px black solid;
        padding: .5rem;
        
    }
</style>