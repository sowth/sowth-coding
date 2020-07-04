<template>
    <div class="app">
        <sdk-webm-list pullDown pullUp :completed="!more" @refresh="refresh" @load="load">
            <div class="app__item" v-for="(item,index) in list" :key="index">{{ item }}</div>
        </sdk-webm-list>
    </div>
</template>

<script>
    import Vue from "vue";
    export default {
        name: "app",
        data: () => ({
            list: [],
            more: true,
        }),
        methods: {
            refresh(done) {
                setTimeout(() => {
                    this.list = [];
                    this.$nextTick(() => {
                        for (let i = 0; i < 10; i++) {
                            this.list.push(i + 1);
                        }
                        this.more = true;
                        done();
                    });
                }, 300);
            },
            load(done) {
                setTimeout(() => {
                    for (let i = 0; i < 10; i++) {
                        this.list.push(this.list.length + 1);
                    }
                    this.more = this.list.length < 50;
                    done();
                }, 300);
            },
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

    .app__item {
        font-size: 24px;
        line-height: 2;
    }
</style>