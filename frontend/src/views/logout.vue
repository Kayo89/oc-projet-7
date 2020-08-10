<template>
    <div class="Logout"></div>
</template>

<script>
export default {
    name: 'Logout',
    mounted: function(){
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        this.$router.push('/login')
    }
}
</script>