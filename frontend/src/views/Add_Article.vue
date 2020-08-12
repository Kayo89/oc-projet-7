<template>
    <section class="login col-md-8 col-lg-7 mx-auto add-article">
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
        <ErrorMess 
            :showErrorRes="showError"
            :errorMessage="errorMessage"
        />
        <b-alert
            :show="dismissCountDown"
            class="mt-4"
            dismissible
            variant="success"
            @dismissed="dismissCountDown=0"
            @dismiss-count-down="countDownChanged"
        >
            <p>{{ formRes }} {{ dismissCountDown }} seconds...</p>
            <b-progress
                variant="success"
                :max="dismissSecs"
                :value="dismissCountDown"
                height="4px"
            ></b-progress>
        </b-alert>
    </section>
</template>

<script>

import VueTrix from 'vue-trix'
import ErrorMess from '../components/errorMessage'

export default {
    name: 'add-article',
    data() {
        return{
            article: {
                contentTxt: ""
            },
            errorMessage: "",
            formRes: "",
            showSucessRes: false,
            showError: false,
            dismissSecs: 3,
            dismissCountDown: 0,
        }
    },
    components: {
        VueTrix,
        ErrorMess
    },
    mounted: function(){
        if (!sessionStorage.getItem('token') || !sessionStorage.getItem('userId')){
            this.$router.push('/login')
        }
    },
    updated: function(){
        if(this.showSucessRes == true){
            if (this.dismissCountDown == 0){
                this.$router.push('/articles');
            }
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
                        this.showError = true;
                        return this.errorMessage = data.error;
                    }
                    this.showAlert();
                    this.formRes = "Article Créé ! Redirection dans "
                    })
                .catch(() => this.errorMessage = "Une erreur de connection à l'API est survenue.")
        },
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown
        },
        showAlert() {
            this.showSucessRes = true;
            this.dismissCountDown = this.dismissSecs
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
</style>