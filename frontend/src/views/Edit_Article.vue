<template>
    <div class="EditArticle contrainer col-md-8 col-lg-7 mx-auto">
        <section v-if="this.showError == false">
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
            <button class="btn btn-secondary mt-2" @click="cancel">Annuler</button>
        </section>
        <b-alert v-model="showError" variant="danger" dismissible class="mt-4">
            {{ errorMessage }}
        </b-alert>

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
            formRes: null,
            showError: false,
            dismissSecs: 3,
            dismissCountDown: 0,
            showSucessRes: false
        }
    },
    components: {
        VueTrix
    },
    mounted: function(){
        this.getArticle();
    },
    updated: function(){
        if(this.showSucessRes == true){
            if (this.dismissCountDown == 0){
                this.$router.push('/article/' + this.form.articleId);
            }
        }
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
                        this.showError = true
                        return this.errorMessage = data.error;
                    }
                    this.showAlert();
                    this.formRes = "Article Modifié ! Redirection dans "
                    })
                .catch(() => {
                    this.showError = true
                    this.errorMessage = "Une erreur de connection à l'API est survenue."
                    })
        },
        getArticle(){
            if (!this.form.articleId){
                this.showError = true
                return this.errorMessage = "Erreur, aucun article à modifier"
            }
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
                        sessionStorage.removeItem('articleId_edit');
                    }
                })
                .catch(error => {
                    this.showError = true
                    this.errorMessage = error;
                    console.error("There was an error!", error);
                });
        },
        cancel(){
            this.$router.push('/article/' + this.form.articleId);
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