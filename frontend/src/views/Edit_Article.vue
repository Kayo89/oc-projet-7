<template>
    <div class="EditArticle contrainer col-md-8 col-lg-7 mx-auto">
        <form @submit.prevent="save" class="mt-5">
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
        
        <p class="text-success">{{ formRes }}</p>
        <p class="text-danger">{{ errorMessage }}</p>
    </div>
</template>

<script>

import VueTrix from "vue-trix";

export default {
    name: "EditArticle",
    data(){
        return {
            form: {
                title: '',
                content_txt: '',
                articleId: sessionStorage.getItem('articleId_edit')
            },
            errorMessage: null,
            formRes: null
        }
    },
    components: {
        VueTrix
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
            fetch("http://192.168.1.16:3000/api/article/edit", requestOptions)
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                        return this.errorMessage = data.error;
                    }
                    this.formRes = "Article Modifié ! Redirection en cours ..."
                    setTimeout(() => {
                        this.$router.push('/article/' + this.form.articleId);
                    },500)
                    })
                .catch(() => this.errorMessage = "Une erreur de connection à l'API est survenue.")
        },
        getArticle(){
            const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }
            fetch("http://192.168.1.16:3000/api/article/" + this.form.articleId, { headers })
                .then(async response => {
                    const data = await response.json();

                    if (!response.ok) {
                        const error = (data && data.message) || response.statusText;
                        return Promise.reject(error);
                    }
                    if (!data.article){
                        this.article = {title: "Erreur Article Introuvable"}
                    }else{
                        this.form.title = data.article.title;
                        this.form.content_txt = data.article.content_txt;
                    }
                })
                .catch(error => {
                    this.errorMessage = error;
                    console.error("There was an error!", error);
                });
        }
    }
}
</script>