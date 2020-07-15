<template>
    <div class="app">
        <sdk-webm-list pullDown pullUp :completed="!more" @refresh="refresh" @load="load">
            <div class="app__item" @click="test()">点击打开</div>
            <div class="app__item" v-for="(item, index) in list" :key="index">{{ item }}</div>
        </sdk-webm-list>
        <sdk-webm-gallery ref="gallery"></sdk-webm-gallery>
    </div>
</template>
d
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
            test() {
                this.$refs.gallery.open(["https://sowth-visional-world.oss-cn-shenzhen.aliyuncs.com/20121217103620-0-0.jpg?x-oss-process=image/format,jpg/auto-orient,1", "https://sowth-visional-world.oss-cn-shenzhen.aliyuncs.com/20200620182943-109.120964-21.471888.jpg?x-oss-process=image/format,jpg/auto-orient,1", "https://sowth-visional-world.oss-cn-shenzhen.aliyuncs.com/20200620163527-109.053686-21.436967.jpg?x-oss-process=image/format,jpg/auto-orient,1", "https://sowth-visional-world.oss-cn-shenzhen.aliyuncs.com/20170120160746-108.317301-22.813334.jpg?x-oss-process=image/format,jpg/auto-orient,1"], 0);
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