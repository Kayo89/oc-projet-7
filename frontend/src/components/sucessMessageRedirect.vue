<template>
    <b-alert
            :show="dismissCountDown"
            class="mt-4"
            dismissible
            variant="success"
            @dismissed="dismissCountDown=0"
            @dismiss-count-down="countDownChanged"
        >
            <p>{{messageResponse}} ! Redirection dans {{ dismissCountDown }} seconds...</p>
            <b-progress
                variant="success"
                :max="dismissSecs"
                :value="dismissCountDown"
                height="4px"
            ></b-progress>
        </b-alert>
</template>

<script>
export default {
    props: ['dismissCountDown', 'dismissSecs', 'countDownChanged', 'messageResponse']
}
</script>