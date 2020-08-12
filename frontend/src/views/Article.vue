<template>
    <div class="Article container">
        <section>
            <div class="card border-secondary">
                <h5 class="card-header ">
                    Ajouté par : <router-link :to="'/user/'+article.user_id">{{ article.first_name }} {{ article.last_name }}</router-link>, {{ article.date_created | formatDateFromNow}}
                    <section v-if="article.user_id == user_id" class="post-title">
                        <button  class="btn btn-danger btn-sm" @click="modalShow = !modalShow"><i class="fa fa-trash" aria-hidden="true"></i> Supprimer</button> <button class="btn btn-secondary btn-sm" @click="inDev"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</button>
                    </section>
                </h5>
                <div class="card-body">
                    <h5 class="card-title">{{ article.title }}</h5>
                    <p class="card-text" v-html="article.content_txt"></p>
                    <div class="likes">
                        <button class="btn btn-success btn-sm" @click="inDev"><i class="fa fa-thumbs-up" aria-hidden="true"></i></button> <button class="btn btn-danger btn-sm" @click="inDev"><i class="fa fa-thumbs-down" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>

            <button class="btn btn-primary mt-5" @click="addReplyButton" id="comButton"><i class="fa fa-reply" aria-hidden="true"></i> {{ addComButton }}</button>
        </section>

        <section class="mt-4" v-if="showAddReply === true">
            <form @submit.prevent="addReply" class="form">
                <div class="form-group">
                    <label for="replyTxt">Contenu du commentaire :</label>
                    <VueTrix class="replyText" inputId="editor1" v-model="reply.replyText" placeholder="enter your content..."/>
                </div>
                <button class="btn btn-success"><i class="fa fa fa-share-square-o" aria-hidden="true"></i> Ajouter</button>
            </form>
        </section>

        <p class="formResponse">{{ formResponse }}</p>

        <section class="mt-3 mb-3" v-for="reply in replyPost" :key="reply.id">
            <div class="card">
                <div class="card-header reply-title">
                    Répondu {{ reply.date_created | formatDateFromNow }}
                    <section v-if="reply.user_id == user_id">
                        <button  class="btn btn-danger btn-sm" @click="deleteReply(reply.id)"><i class="fa fa-trash" aria-hidden="true"></i> Supprimer</button> <button class="btn btn-secondary btn-sm" @click="inDev"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</button>
                    </section>
                </div>
                <div class="card-body">
                    <blockquote class="blockquote mb-0">
                    <p v-html="reply.reply_txt"></p>
                    <footer class="blockquote-footer">
                        <router-link :to="'/user/'+reply.user_id">{{ reply.first_name }} {{ reply.last_name }}</router-link>
                    </footer>
                    </blockquote>
                    <div class="likes">
                        <button class="btn btn-success btn-sm" @click="inDev"><i class="fa fa-thumbs-up" aria-hidden="true"></i></button> <button class="btn btn-danger btn-sm" @click="inDev"><i class="fa fa-thumbs-down" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>
        </section>

        <b-modal ref="deleteArticle-modal" v-model="modalShow" hide-footer title="Voulez vous vraimnent supprimer l'article ?" hide-backdrop content-class="shadow">
            <b-button class="mt-3 col-6 offset-3" variant="danger" block @click="delPost">Supprimer</b-button>
            <b-button class="mt-2 col-6 offset-3" variant="secondary" block @click="hideModal">Annuler</b-button>
        </b-modal>
    </div>
</template>

<script>

import VueTrix from "vue-trix";

export default {
    name: 'Article',
    data() {
        return{
            article: {},
            checkUser: null,
            user_id: sessionStorage.getItem('userId'),
            replyPost: {},
            showAddReply: false,
            reply: {},
            formResponse: null,
            addComButton: "Ajouter un commentaire",
            updateContent: true,
            modalShow: false
        }
    },
    components: {
        VueTrix
    },
    mounted: function(){
        this.getArticle()
    },
    updated: function(){
        if(this.updateContent == true){
            this.getArticle()
        }
    },
    methods: {
        delPost(){
            const articleId = this.$route.params.id;
            this.updateContent = false;
            const requestOptions = {
                method: "DELETE",
                headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('token') },
                body: ""
            }
            fetch("http://192.168.1.16:3000/api/article/" + articleId, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                        this.updateContent = true;
                        return this.message = data.error;
                    }
                    
                    this.$router.push('/articles');
                    })
                .catch(() => this.message = "Une erreur de connection à l'API est survenue.")
        },
        hideModal() {
            this.$refs['deleteArticle-modal'].hide()
        },
        inDev(){
            this.formResponse = "[EN DEV 🛠]"
        },
        deleteReply(id){
            const articleId = { replyId: id };
            const requestOptions = {
                method: "DELETE",
                headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('token') },
                body: JSON.stringify( articleId )
            }
            fetch("http://192.168.1.16:3000/api/article/reply", requestOptions)
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                        this.updateContent = true;
                        return this.message = data.error;
                    }
                    this.formResponse = "Commentaire supprimé !"
                    })
                .catch(() => this.message = "Une erreur de connection à l'API est survenue.")
        },
        getArticle(){
            const id = this.$route.params.id;
            const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }
            fetch("http://192.168.1.16:3000/api/article/" + id, { headers })
                .then(async response => {
                    const data = await response.json();

                    if (!response.ok) {
                        const error = (data && data.message) || response.statusText;
                        return Promise.reject(error);
                    }
                    if (!data.article){
                        this.article = {title: "Erreur Article Introuvable"}
                    }else{
                        this.article = data.article;
                        this.checkUser = data.article.user_id;
                        this.replyPost = data.reply;
                    }
                })
                .catch(error => {
                    this.errorMessage = error;
                    console.error("There was an error!", error);
                });
        },
        addReplyButton(){
            if(!this.showAddReply){
                this.showAddReply = true
                this.addComButton = "Annuler le commentaire"
                document.getElementById('comButton').classList.add('btn-danger')
            }else{
                this.showAddReply = false
                this.addComButton = "Ajouter un commentaire"
                document.getElementById('comButton').classList.remove('btn-danger')
            }
        },
        addReply(){
            this.reply.userId = parseInt(sessionStorage.getItem('userId'));
            this.reply.articleId = this.article.id;
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('token') },
                body: JSON.stringify( this.reply )
            }
            fetch("http://192.168.1.16:3000/api/article/reply", requestOptions)
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                        return this.message = data.error;
                    }
                    this.formResponse = "Commentaire ajouté !"
                    this.showAddReply = false;
                    this.addComButton = "Ajouter un commentaire"
                    document.getElementById('comButton').classList.remove('btn-danger')
                    })
                .catch(() => this.message = "Une erreur de connection à l'API est survenue.")
        },
        testText(){
            console.log(this.editorContent)
        }
    }
}
</script>

<style lang="scss" scoped>
    .article-post{
        border: 2px solid black;
        width: 450px;
        padding: 2rem;
        margin: 2rem auto;
        border-radius: 25px;
    }
    .Article{
        .post-title{
            display: flex;
            justify-content: flex-end;
            button{
                margin: 0 .2rem 0 .2rem;
            }
        }
        .reply-title{
            display: flex;
            justify-content: space-between;
        }
    }
    .likes{
        display: flex;
        justify-content: right;
        button{
            margin: .2rem;
        }
    }
    .formResponse{
        display: block;
        color: darkgreen;
        font-weight: bold;
        border-bottom: 1px solid;
        width: fit-content;
        margin: 2rem auto;
        font-size: 1.3rem;
    }
    .replyText{
        background-color: white;
        border: 1px black solid;
        padding: .2rem;
    }
</style>