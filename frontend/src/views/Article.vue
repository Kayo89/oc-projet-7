<template>
    <div class="Article container mb-4">
        <section>
            <router-link to="/"><button class="btn btn-primary see-more-article btn-sm mb-3">Voir tous les articles</button></router-link>
            <div class="card border-secondary">
                <h5 class="card-header card-title">
                    <span>Ajouté par 
                        <router-link :to="'/user/'+article.user_id" v-if="article.user_id != 0">
                            <img v-if="article.photo_url" :src="'/images/'+article.photo_url"> {{ article.first_name }} {{ article.last_name }}
                        </router-link>
                        <span v-else class="user-delete">Utilisateur Supprimé</span> • {{ article.date_created | formatDateFromNow}} 
                        <span v-if="article.date_edit" class="editDate">• Modifié {{ article.date_edit | formatDateFromNow}}</span>
                    </span>
                    <section v-if="article.user_id == user_id || perm === true" class="post-title">
                        <button  class="btn btn-danger btn-sm" v-if="replyPost == '' || perm === true" @click="modalShow = !modalShow"><i class="fa fa-trash" aria-hidden="true"></i> Supprimer</button> <button class="btn btn-secondary btn-sm" @click="modify(null, 'article')"><i class="fa fa-pencil" aria-hidden="true"></i> Modifier</button>
                    </section>
                </h5>
                <div class="card-body">
                    <h5 class="card-title">{{ article.title }}</h5>
                    <p class="card-text article-txt" v-html="article.content_txt"></p>
                    <div class="likes">
                        <button class="btn btn-success btn-sm" v-bind:style="likeButton" @click="like(1)">{{ article.likes }}&nbsp;<i  class="fa fa-thumbs-up" aria-hidden="true"></i></button> <button class="btn btn-danger btn-sm" v-bind:style="dislikeButton" @click="like(-1)">{{ article.dislikes }}&nbsp;<i class="fa fa-thumbs-down" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>

            <section class="mt-4" v-if="showAddReply === true">
                <form @submit.prevent="addReply" class="form">
                    <div class="form-group">
                        <label for="replyTxt">Contenu du commentaire :</label>
                        <VueTrix class="replyText" inputId="editor1" v-model="reply.replyText" placeholder="enter your content..."/>
                    </div>
                    <button class="btn btn-success"><i class="fa fa fa-share-square-o" aria-hidden="true"></i> Ajouter</button>
                </form>
            </section>
            <button class="btn btn-primary mt-5" @click="addReplyButton" id="comButton"><i class="fa fa-reply" aria-hidden="true"></i> {{ addComButton }}</button>
        </section>


        <b-alert v-model="showSucessReply" variant="success" dismissible class="mt-4">
            {{ formResponse }}
        </b-alert>

        <section class="mt-3 mb-3 reply" v-for="reply in replyPost" :key="reply.id">
            <div class="card">
                <div class="card-header card-title reply__title">
                    <span>
                        Répondu par 
                            <router-link :to="'/user/'+reply.user_id" v-if="reply.user_id != 0"><img v-if="reply.photo_url" :src="'/images/'+reply.photo_url"> {{ reply.first_name }} {{ reply.last_name }}</router-link>
                            <span v-else class="user-delete">Utilisateur Supprimé</span>
                    </span>
                    <section v-if="reply.user_id == user_id || perm === true">
                        <button  class="btn btn-danger btn-sm" @click="deleteReply(reply.id)"><i class="fa fa-trash" aria-hidden="true"></i> Supprimer</button> <button class="btn btn-secondary btn-sm"  @click="modify(reply.id, 'reply')"><i class="fa fa-pencil" aria-hidden="true"></i> Modifier</button>
                    </section>
                </div>
                <div class="card-body">
                    <p class="reply-txt" v-html="reply.reply_txt"></p>
                </div>
                <div class="card-footer text-muted footer-reply">
                    <span>Ajouté {{ reply.date_created | formatDateFromNow }}
                        <span v-if="reply.date_edit" class="editDate">| Modifié {{ reply.date_edit | formatDateFromNow}}</span>
                    </span>
                </div>
            </div>
        </section>

        <b-modal ref="deleteArticle-modal" v-model="modalShow" hide-footer centered title="Voulez vous vraiment supprimer cette article ?" hide-backdrop content-class="shadow">
            <b-button class="mt-3 col-6 offset-3" variant="danger" block @click="delPost">Supprimer</b-button>
            <b-button class="mt-2 col-6 offset-3" variant="secondary" block @click="hideModal">Annuler</b-button>
        </b-modal>
    </div>
</template>

<script>

import VueTrix from "vue-trix"

export default {
    name: 'Article',
    data() {
        return{
            article: {},
            checkUser: null,
            user_id: parseInt(sessionStorage.getItem('userId')),
            replyPost: {},
            showAddReply: false,
            reply: {},
            formResponse: null,
            addComButton: "Ajouter un commentaire",
            updateContent: null,
            modalShow: false,
            showSucessReply: false,
            likeStatus: null,
            dislikeBool: false,
            likeBool: false,
            perm: null,
            likeButton: {
                opacity: 1
            },
            dislikeButton: {
                opacity: 1
            }
        }
    },
    components: {
        VueTrix
    },
    mounted: function(){
        this.getArticle()
    },
    updated: function(){
        if (this.updateContent == true){
            this.getArticle()
        }
    },
    methods: {
        delPost(){
            const articleId = this.$route.params.id;
            const requestOptions = {
                method: "DELETE",
                headers: this.$store.state.requestHeaders,
                body: JSON.stringify({ userId: this.user_id })
            }
            fetch("/api/article/" + articleId, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                        return this.message = data.error;
                    }
                    
                    this.$router.push('/');
                    })
                .catch(() => this.message = "Une erreur de connection à l'API est survenue.")
        },
        like(status){
            const notation = {likeStatus: status, articleId: this.article.id }
            const requestOptions = {
                method: "POST",
                headers: this.$store.state.requestHeaders,
                body: JSON.stringify( notation )
            }
            fetch("/api/article/notation", requestOptions)
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                        return this.message = data.error;
                    }
                    this.getArticle()
                })
                .catch(() => this.message = "Une erreur de connection à l'API est survenue.")
        },
        modify(replyId, content){
            if (content == "reply"){
                this.$store.commit("setReplyId", { replyId: replyId })
            }
            this.$store.commit("setArticleId", { articleId: this.article.id })
            this.$store.commit("whatToModify", { content: content})
            this.$router.push('/edit')
        },
        hideModal() {
            this.$refs['deleteArticle-modal'].hide()
        },
        deleteReply(id){
            this.updateContent = true;
            const articleId = { replyId: id, userId: this.user_id };
            const requestOptions = {
                method: "DELETE",
                headers: this.$store.state.requestHeaders,
                body: JSON.stringify( articleId )
            }
            fetch("/api/article/reply", requestOptions)
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                        return this.message = data.error;
                    }
                    this.showSucessReply = true;
                    this.formResponse = "Commentaire supprimé !"
                    })
                .catch(() => this.message = "Une erreur de connection à l'API est survenue.")
        },
        getArticle(){
            const id = this.$route.params.id;
            const requestOptions = {
                method: "GET",
                headers: this.$store.state.requestHeaders
            }
            fetch("/api/article/" + id, requestOptions)
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
                        this.perm = data.permission;
                        this.likeList();
                        this.updateContent = false;
                    }
                })
                .catch(error => {
                    this.errorMessage = error;
                    console.error("There was an error!", error);
                });
        },
        likeList(){
            if (this.article.dislikedUsers){
                let userListDislike = this.article.dislikedUsers.split(',')
                for (let user of userListDislike){
                    if (this.user_id == user){
                        this.likeButton.opacity = 0.6;
                        return this.dislikeButton.opacity = 1;
                    }else{
                        this.likeButton.opacity = 1;
                    }
                }
            }else{
                this.likeButton.opacity = 1;
            }

            if (this.article.likedUsers){
                let userListLike = this.article.likedUsers.split(',')
                for (let user of userListLike){
                    if (this.user_id == user){
                         this.dislikeButton.opacity = 0.6;
                         return this.likeButton.opacity = 1;
                    }else{
                        this.dislikeButton.opacity = 1;
                    }
                }
            }else{
                this.dislikeButton.opacity = 1;
            }
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
            this.updateContent = true;
            this.reply.userId = parseInt(sessionStorage.getItem('userId'));
            this.reply.articleId = this.article.id;
            const requestOptions = {
                method: "POST",
                headers: this.$store.state.requestHeaders,
                body: JSON.stringify( this.reply )
            }
            fetch("/api/article/reply", requestOptions)
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                        return this.message = data.error;
                    }
                    this.showSucessReply = true;
                    this.reply.replyText = null;
                    this.formResponse = "Commentaire ajouté !"
                    this.showAddReply = false;
                    this.addComButton = "Ajouter un commentaire"
                    document.getElementById('comButton').classList.remove('btn-danger')
                })
                .catch(() => this.message = "Une erreur de connection à l'API est survenue.")
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
        .card-title{
            img{
                width: 35px;
                border-radius: 50%;
            }
        }
        .reply{
            &__title{
                display: flex;
                justify-content: space-between;
                align-items: center;
                img{
                    width: 30px;
                    border-radius: 50%;
                }
                
            }
        }
    }
    .footer-reply{
        display: flex;
        justify-content: space-between;
        font-size: .8rem;
        align-items: center;
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
    .editDate{
        font-size: .8rem;
    }
        .user-delete{
        font-style: italic;
    }
</style>