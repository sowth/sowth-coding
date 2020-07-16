<template>
    <div class="sdk-webm-list" @touchstart="onScroll" @touchmove="onScroll" @touchend="onScroll" @touchcancel="onScroll" @scroll="onScroll">
        <div class="sdk-webm-list__wrap" :style="{ transform: 'translateY(' + pullOffset + 'px)' }">
            <div class="sdk-webm-list__pulldown" v-if="pullDown">
                <img class="icon" src="./temp/loading.gif" v-show="refreshing" />
                <span class="text">{{ refreshing ? "正在刷新..." : pullOffset >= 50 ? "松开刷新" : "下拉刷新" }}</span>
            </div>
            <slot></slot>
            <div class="sdk-webm-list__pullup" v-if="pullUp">
                <img class="icon" src="./temp/loading.gif" v-show="loading" />
                <span class="text">{{ loading ? "加载中..." : completed ? "没有更多了" : "加载更多" }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import "../basis/normalize-css.js";
    export default {
        name: "sdk-webm-list",
        props: {
            pullDown: {
                type: Boolean,
                default: false,
            },
            pullUp: {
                type: Boolean,
                default: false,
            },
            completed: {
                type: Boolean,
                default: false,
            },
        },
        data: () => ({
            eventId: 0,
            refreshing: false,
            loading: false,
            pulling: false,
            pullOffset: 0,
            scrollTop: 0,
            firstScrollTop: 0,
            firstTouchY: 0,
            lastTouchY: 0,
            touchStartTime: 0,
            offsetBottom: 0,
            timer: null,
            count: 0,
        }),
        methods: {
            onScroll(event) {
                let [scroller, type, eventId] = [this.$el, event ? event.type : "", 0];
                if (type === "touchstart") {
                    this.pulling = false;
                    this.firstScrollTop = scroller.scrollTop;
                    this.firstTouchY = event.touches[0].clientY;
                    this.touchStartTime = Date.now();
                } else if (type === "touchmove") {
                    this.lastTouchY = event.touches[0].clientY;
                    if (this.refreshing || this.loading) return;
                    if (this.pullDown) {
                        if (this.pulling || (this.firstScrollTop === 0 && this.lastTouchY > this.firstTouchY)) {
                            event.preventDefault();
                            this.pulling = true;
                            this.pullOffset = Math.min(Math.max((this.lastTouchY - this.firstTouchY) / 2, 0), 50);
                        } else {
                            this.onScroll();
                        }
                    } else {
                        this.pulling = false;
                        this.pullOffset = 0;
                        this.onScroll();
                    }
                } else if (type === "touchend" || type === "touchcancel") {
                    if (this.refreshing || this.loading) return;
                    if (this.pullDown) {
                        if (this.pulling && this.pullOffset === 50 && Date.now() - this.touchStartTime > 300) {
                            this.eventId = eventId = Math.random();
                            this.refreshing = true;
                            this.pulling = false;
                            this.$emit("refresh", () => {
                                if (this.eventId !== eventId) return;
                                this.refreshing = false;
                                this.pullOffset = 0;
                                this.count = 0;
                                this.onScroll();
                            });
                        } else {
                            this.pulling = false;
                            this.pullOffset = 0;
                            this.onScroll();
                        }
                    } else {
                        this.pulling = false;
                        this.pullOffset = 0;
                        this.onScroll();
                    }
                } else {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.$emit("scroll", {
                            scrollTop: this.scrollTop = scroller.scrollTop,
                            offsetBottom: this.offsetBottom = scroller.scrollHeight - scroller.scrollTop - scroller.offsetHeight,
                            detectIntoView: (node) => {
                                let [outer, inner] = [scroller.getBoundingClientRect(), node.getBoundingClientRect()];
                                let outside = inner.top > outer.bottom || inner.right < outer.left || inner.bottom < outer.top || inner.left > outer.right;
                                return !outside;
                            }
                        });
                        if (!this.pullUp || this.completed) return;
                        if (this.refreshing || this.loading || this.pulling) return;
                        if (this.offsetBottom > 50) {
                            this.count = 0;
                        } else {
                            if (this.count >= 10) return;
                            this.eventId = eventId = Math.random();
                            this.loading = true;
                            this.count++;
                            this.$emit("load", () => {
                                if (this.eventId !== eventId) return;
                                this.loading = false;
                                this.count >= 10 && console.error("检测到列表组件可能陷入无限循环！");
                                this.onScroll();
                            });
                        }
                    }, 50);
                }
            },
            setScrollTop(value) {
                this.$el.scrollTop = value;
                this.onScroll();
            },
            destroy() {
                clearTimeout(this.timer);
                this.eventId = 0;
                this.refreshing = this.loading = this.pulling = false;
                this.pullOffset = this.scrollTop = this.offsetBottom = this.count = 0;
            },
            init() {
                this.destroy();
                this.setScrollTop(0);
            },
        },
        created() { },
        mounted() {
            this.init();
        },
        beforeDestroy() {
            this.destroy();
        },
    };
</script>

<style lang="scss">
    .sdk-webm-list {
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .sdk-webm-list__wrap {
        min-height: 100%;
        transition-duration: 0.3s;

        &:before,
        &:after {
            display: table;
            content: "";
        }
    }

    .sdk-webm-list__pulldown,
    .sdk-webm-list__pullup {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;

        & > .icon {
            margin-right: 5px;
            width: 20px;
            height: 20px;
            object-fit: contain;
        }

        & > .text {
            color: #aaa;
            font-size: 14px;
            line-height: 1;
        }
    }

    .sdk-webm-list__pulldown {
        position: absolute;
        top: -50px;
        left: 0;
        width: 100%;
    }
</style>