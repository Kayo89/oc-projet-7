<template>
    <div class="modify-reply">
        <form @submit.prevent="save" class="mt-5" >
                    <div class="form-row">
                        <div class="form-group col-12">
                            <label for="content">Contenu de l'article</label>
                            <VueTrix class="areaText" inputId="editor1" v-model="form.reply_txt" placeholder="votre message..."/>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary" v-if="form.reply_txt.length > 15">Enregistrer</button>
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
    name: "ModifyReply",
    props: ['showAlert'],
    data() {
        return {
            form: {
                reply_txt: '',
                replyId: this.$store.state.reply.id,
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
    mounted: function() {
        this.getReply()
    },
    methods: {
        getReply(){
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('token') },
                body: JSON.stringify( { replyId: this.$store.state.reply.id } )
            }
            fetch("/api/article/reply/modify", requestOptions)
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                        const error = (data && data.message) || response.statusText;
                        return Promise.reject(error);
                    }
                    if (!data.reply){
                        this.errorMessage = {title: "Erreur Article Introuvable"}
                    }else{
                        this.form.reply_txt = data.reply[0].reply_txt;
                    }
                })
                .catch(error => {
                    this.showErrorRes = true
                    this.errorMessage = error;
                    console.error("There was an error!", error);
                });
        },
        save(){
            const requestOptions = {
                method: "PUT",
                headers: {  "Content-Type": "application/json", 
                            "Authorization": "Bearer " + sessionStorage.getItem('token') },
                body: JSON.stringify( this.form )
            }
            fetch("/api/article/reply", requestOptions)
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
        }
    }
}
</script>