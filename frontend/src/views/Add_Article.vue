<template>
    <section class="login col-md-8 offset-md-2 col-lg-6 offset-lg-3 add-article">
        <h1 class="m-4">Ajouter un article</h1>

        <form @submit="addArticle" class="mt-5">
            <div class="form-row">
                <div class="form-group col-12">
                    <label for="title">Titre de l'article</label>
                    <input class="form-control" type="text" placeholder="Titre de l'article ..." v-model="article.title" id="title" required>
                </div>
                <div class="form-group col-12">
                    <label for="content">Votre message</label>
                    <textarea class="form-control" type="text" v-model="article.contentTxt" id="content" rows="5">
                        Votre message ...
                    </textarea>
                </div>
            </div>
            <button type="submit" class="btn btn-primary">Poster !</button>
        </form>
        <p id="errorRes" class="mt-3 text-danger"></p>
        <p id="succesRes" class="mt-3 text-success font-weight-bold"></p>
    </section>
</template>

<script>
export default {
    name: 'add-article',
    data() {
        return{
            article: {}
        }
    },
    mounted: function(){
        if (!sessionStorage.getItem('token') || !sessionStorage.getItem('userId')){
            this.$router.push('/login')
        }
    },
    methods: {
        addArticle(e) {
            e.preventDefault();
            //let userId = {"userId": sessionStorage.getItem('userId')}
            this.article.userId = parseInt(sessionStorage.getItem('userId'));
            let redirectUser = this.$router;
            let request = new XMLHttpRequest();
            request.open("POST", "http://localhost:3000/api/article");
                request.setRequestHeader("Content-Type", "application/json");
                request.onreadystatechange = function() {
                    console.log(this.status)
                    if (this.readyState == XMLHttpRequest.DONE){
                        if (this.status == 201){
                            document.getElementById('succesRes').innerText = "Article Créé ! Redirection ...";
                            setTimeout(() => {
                                redirectUser.push('/');
                            },2500)
                            //redirectUser.push('/');
                        }else{
                            let responseT = JSON.parse(this.responseText);
                            this.myResponse = responseT.error;
                            document.getElementById('errorRes').innerText = this.myResponse;
                        }
                    }
                }
                request.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
                console.log(this.article)
                request.send(JSON.stringify(this.article));
        }
    }
}
</script>