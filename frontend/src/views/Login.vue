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
        <p id="errorRes" class="mt-3 text-danger">{{ message }}</p>
        <p class="mt-3 text-danger">{{ errorMessage }}</p>
        <p class="text-center mt-4">Vous n'avez pas encore de compte ? <router-link to="/signup">Créer un compte</router-link></p>
    </section>
</template>

<script>

export default {
    name: 'Login',
    props: {
        alertMessage: {
            type: String,
            require: true
        }
    },
    data() {
        return {
            errors: [],
            user: {},
            message: this.alertMessage,
            errorMessage: null,
        }
    },
    methods: {
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
                        return this.message = data.error;
                    }
                    let redirectUser = this.$router;
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('userId', data.userId);
                    redirectUser.push('/');
                    })
                .catch(() => this.message = "Une erreur de connection à l'API est survenue.")
        }
    }
}
</script>

<style lang="scss">
    .Login{ 
        text-align: center;
    }
</style>