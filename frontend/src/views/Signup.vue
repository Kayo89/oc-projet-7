<template>
    <section class="sign-in col-md-8 offset-md-2 col-lg-6 offset-lg-3">
        <h2 class="sign-in--signin">Sign In</h2>
        <form @submit="signup" method="POST" action="">
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
            <p id="errorRes" class="mt-3 text-danger"></p>
            <p class="text-center small pt-3">Vous avez déjà un compte ? <router-link to='/login'>Connectez-vous</router-link></p>
        </form>
    </section>
</template>

<script>
export default {
    name: "Signup",
    data() {
        return {
            user: {}
        }
    },
    methods: {
        signup(e) {
            e.preventDefault();
            let redirectUser = this.$router;
            let request = new XMLHttpRequest();
            request.open("POST", "http://localhost:3000/api/auth/signup");
                request.setRequestHeader("Content-Type", "application/json");
                request.onreadystatechange = function() {
                    if (this.readyState == XMLHttpRequest.DONE){
                        if (this.status == 201){
                            redirectUser.push('/login');
                        }else{
                            let responseT = JSON.parse(this.responseText);
                            console.log(responseT.errorCode);
                            this.myResponse = responseT.error;
                            document.getElementById('errorRes').innerText = this.myResponse;
                        }
                    }
                }
                request.send(JSON.stringify(this.user));
        }
    }
    
}
</script>