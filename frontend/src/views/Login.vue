<template>
    <section class="login col-md-8 col-lg-6 mx-auto">
        <h1 class="login--title m-4">Connectez-vous à votre compte</h1>
    
        <form @submit.prevent="login" id="login-form" class="mt-5" v-if="errorCode < 40003">
            <div class="form-row">
                <div class="input-group col-10 mx-auto mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><font-awesome-icon icon="envelope" /></span>
                    </div>
                    <input class="form-control" type="email" placeholder="Email" v-model="user.email" name="email" id="email" required>
                </div>
                <div class="input-group col-10 mx-auto mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><font-awesome-icon icon="lock" /></span>
                    </div>
                    <input class="form-control" type="password" placeholder="Password" v-model="user.password" name="password" id="password" required>
                </div>
            </div>
            <button type="submit" class="btn btn-primary login--button" id="logButton">Se connecter</button>
            <p class="text-center mt-4">Vous n'avez pas encore de compte ? <router-link to="/signup">Créer un compte</router-link></p>
        </form>
        <ErrorMess 
            :showErrorRes="showError"
            :errorMessage="errorMessage"
        />
        <p v-if="errorCode > 40003" class="font-weight-bold mt-4">
            Vous pouvez nous contactez à cette adresse mail : 
            <br /><br />
            <a href="mailto:support@groupomania.com">support@groupomania.com</a>
        </p>
    </section>
</template>

<script>

import ErrorMess from '../components/errorMessage'

export default {
    name: 'Login',
    data() {
        return {
            user: {},
            errorMessage: null,
            errorCode: null,
            showError: false,
            connexionTry: 0
        }
    },
    components: {
        ErrorMess
    },
    methods: {
        login() {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( this.user )
            }
            fetch("/api/auth/login", requestOptions)
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                        this.showError = true
                        if (data.errorCode){
                            this.errorCode = data.errorCode
                        }
                        this.connexionTry ++
                        if (this.errorCode == 40005 || this.errorCode == 40004){
                            return this.errorMessage = data.error
                        }
                        return this.errorMessage = data.error + ' (' + this.connexionTry + ')';
                    }
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('userId', data.userId);
                    this.$store.commit("setRequestHeaders", { token: data.token, userId: data.userId })
                    this.$router.push('/');
                    })
                .catch(() => {
                    this.showError = true
                    this.errorMessage = "Une erreur de connection à l'API est survenue."
                })
                    
        }
    }
}
</script>

<style lang="scss">
    .login{ 
        text-align: center;
        &--title{
            font-size: 1.9rem;
        }
    }
</style>