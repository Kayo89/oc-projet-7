<template>
    <div class="sign-in container">
        <section class="col-md-8 col-lg-7 mx-auto">
            <h2 class="sign-in--signin">Sign In</h2>
            <form @submit.prevent="signup" id="signup-form">
                <div class="form-row">
                    <div class="form-group col-12">
                        <label for="email">Email</label>
                        <input class="form-control" type="email" placeholder="Email" name="email" id="email" v-model="user.email" required>
                    </div>
                    <div class="form-group col-12">
                        <label for="password">Password</label>
                        <input class="form-control" type="password" placeholder="Password" name="password" id="password" v-model="user.password" required>
                    </div>
                    <div class="form-group col-6">
                        <label for="first-name">Prénom</label>
                        <input class="form-control" type="text" placeholder="Prénom" name="first-name" id="first-name" v-model="user.firstName" required>
                    </div>
                    <div class="form-group col-6">
                        <label for="last-name">Nom</label>
                        <input class="form-control" type="text" placeholder="Nom" name="last-name" id="last-name" v-model="user.lastName" required>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary sign-in--button">Sign In</button>
                <p class="mt-3 text-danger">{{ message }}</p>
                <p class="text-center small pt-3">Vous avez déjà un compte ? <router-link to='/login'>Connectez-vous</router-link></p>
            </form>
        </section>
            <ErrorMess 
                :showErrorRes="showError"
                :errorMessage="errorMessage"
            />
            <p class="accountCreated">{{ accountCreated }}</p>
    </div>
</template>

<script>

import ErrorMess from '../components/errorMessage'

export default {
    name: "Signup",
    data() {
        return {
            user: {},
            accountCreated: "",
            message: "",
            showError: false,
            errorMessage: null
        }
    },
    components: {
        ErrorMess
    },
    methods: {
        signup() {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( this.user )
            }
            fetch("http://192.168.1.16:3000/api/auth/signup", requestOptions)
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                        this.showError = true
                        return this.errorMessage = data.error;
                    }
                    this.accountCreated = "Compte créé !";
                    document.getElementById('signup-form').style.display = "none";
                    setTimeout(() => {
                        this.login();
                    },1200)
                })
                .catch(() => {
                    this.showError = true
                    this.errorMessage = "Une erreur de connection à l'API est survenue."
                    })
        },
        login() {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( this.user )
            }
            fetch("http://192.168.1.16:3000/api/auth/login", requestOptions)
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
    .sign-in{
        h2, button{
            display: block;
            margin: 2rem auto;
            text-align: center;
        }
        .accountCreated{
            display: block;
            color: darkgreen;
            font-weight: bold;
            border-bottom: 1px solid;
            width: fit-content;
            margin: 5rem auto;
            font-size: 1.5rem;
        }
    }
</style>