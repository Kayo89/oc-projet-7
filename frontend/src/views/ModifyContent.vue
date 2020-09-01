<template>
    <div class="EditArticle contrainer col-md-8 col-lg-7 mx-auto">
        <section>
            <ModifyArticle v-if="this.$store.state.modify.content === 'article'"
                :showAlert="showAlert" 
            />
            <ModifyReply v-else-if="this.$store.state.modify.content === 'reply'"
                :showAlert="showAlert" 
            />
            <button class="btn btn-secondary mt-2" @click="cancel">Annuler</button>
        </section>
        <SucessMessage 
            :dismissCountDown="dismissCountDown"
            :dismissSecs="dismissSecs"
            :countDownChanged="countDownChanged"
        />
    </div>
</template>

<script>
import ModifyArticle from "../components/Modify_Article"
import ModifyReply from "../components/Modify_Reply"
import SucessMessage from "../components/sucessMessageRedirect"

export default {
    name: "EditArticle",
    data(){
        return {
            dismissSecs: 1,
            dismissCountDown: 0,
            showSucessRes: false
        }
    },
    components: {
        ModifyArticle,
        SucessMessage,
        ModifyReply
    },
    updated: function(){
        if(this.showSucessRes == true){
            if (this.dismissCountDown == 0){
                this.$router.push('/article/' + this.$store.state.article.id);
            }
        }
    },
    methods: {
        cancel(){
            this.$router.push('/article/' + this.$store.state.article.id);
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