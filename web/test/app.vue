<template>
    <div class="app">
        <sdk-web-list :fetch="fetchList">
            <sdk-web-dialog ref="d" title="标题" width="80vw" height="80vh">内容</sdk-web-dialog>
        </sdk-web-list>
    </div>
</template>

<script>
    import Vue from "vue";
    export default {
        name: "app",
        data: () => ({
            fetchList: null,
        }),
        methods: {
            init() {
                this.fetchList = () => new Promise((resolve) => {
                    this.$refs.d.open();
                    resolve({
                        list: [{}, {}, {}],
                        total: 3,
                    });
                });
            },
        },
        mounted() {
            this.init();
        },
        setup() {
            new Vue(this).$mount("#app");
        }
    };
</script>

<style lang="scss">
    .app {
        height: 100%;
        overflow: hidden;
    }
</style>