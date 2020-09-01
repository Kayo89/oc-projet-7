<template>
    <section class="login col-md-8 offset-md-2 col-lg-6 offset-lg-3 Login" id="login">
        <h1 class="login--title m-4">Login</h1>

        <form @submit.prevent="login" id="login-form" class="mt-5">
            <div class="form-row">
                <div class="form-group col-12">
                    <label for="email">Email</label>
                    <input class="form-control" type="email" placeholder="Email" v-model="user.email" name="email" id="email" required>
                </div>
                <div class="form-group col-12">
                    <label for="password">Password</label>
                    <input class="form-control" type="password" placeholder="Password" v-model="user.password" name="password" id="password" required>
                </div>
            </div>
            <button type="submit" class="btn btn-primary login--button" id="logButton">Log in</button>
        </form>
        <ErrorMess 
            :showErrorRes="showError"
            :errorMessage="errorMessage"
        />
        <p class="text-center mt-4">Vous n'avez pas encore de compte ? <router-link to="/signup">Créer un compte</router-link></p>
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
            showError: false
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
                        return this.errorMessage = data.error;
                    }
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('userId', data.userId);
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
    .Login{ 
        text-align: center;
    }
</style>