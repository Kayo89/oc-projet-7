<template>
    <div class="modify-article">
        <form @submit.prevent="save" class="mt-5" >
                    <div class="form-row">
                        <div class="form-group col-12">
                            <label for="title">Titre de l'article</label>
                            <input class="form-control" type="text" placeholder="Titre de l'article ..." v-model="form.title" id="title" required>
                        </div>
                        <div class="form-group col-12">
                            <label for="content">Contenu de l'article</label>
                            <VueTrix class="areaText" inputId="editor1" v-model="form.content_txt" placeholder="votre message..."/>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary" v-if="form.content_txt.length > 15">Enregistrer</button>
        </form>
        <ErrorMess
            :showErrorRes="showErrorRes"
            :errorMessage="errorMessage"
        />
    </div>
</template>

<script>

import VueTrix from "vue-trix"
import ErrorMess from './errorMessage'

export default {
    name: "ModifyArticle",
    props: ['showAlert'],
    data() {
        return{
             form: {
                title: '',
                content_txt: '',
                articleId: this.$store.state.article.id,
                userId: parseInt(sessionStorage.getItem('userId'))
            },
            showErrorRes: false,
            errorMessage: null
        }
    },
    components: {
        VueTrix,
        ErrorMess
    },
    mounted: function(){
        this.getArticle();
    },
    methods: {
        save(){
            const requestOptions = {
                method: "PUT",
                headers: {  "Content-Type": "application/json", 
                            "Authorization": "Bearer " + sessionStorage.getItem('token') },
                body: JSON.stringify( this.form )
            }
            fetch("/api/article/edit", requestOptions)
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                        this.showErrorRes = true
                        return this.errorMessage = data.error;
                    }
                    this.showAlert();
                    })
                .catch(() => {
                    this.showErrorRes = true
                    this.errorMessage = "Une erreur de connection à l'API est survenue."
                    })
        },
        getArticle(){
            if (!this.form.articleId){
                this.showErrorRes = true
                return this.errorMessage = "Erreur, aucun article à modifier"
            }
            const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }
            fetch("/api/article/" + this.form.articleId, { headers })
                .then(async response => {
                    const data = await response.json();

                    if (!response.ok) {
                        const error = (data && data.message) || response.statusText;
                        return Promise.reject(error);
                    }
                    if (!data.article){
                        this.errorMessage = {title: "Erreur Article Introuvable"}
                    }else{
                        this.form.title = data.article.title;
                        this.form.content_txt = data.article.content_txt;
                    }
                   
                })
                .catch(error => {
                    this.showErrorRes = true
                    this.errorMessage = error;
                    console.error("There was an error!", error);
                });
        }
    }
}
</script>