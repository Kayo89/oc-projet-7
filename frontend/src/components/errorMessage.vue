<template>
    <div class="error-mess">
        <b-alert v-model="showErrorRes" variant="danger" dismissible class="mt-4">
            {{ errorMessage }}
        </b-alert>
    </div>
</template>

<script>
export default {
    name: "ErrorMess",
    props: ["errorMessage", "showErrorRes"]
}
</script>