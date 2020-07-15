<template>
    <div class="pswp sdk-webm-gallery">
        <div class="pswp__bg"></div>
        <div class="pswp__scroll-wrap">
            <div class="pswp__container">
                <div class="pswp__item"></div>
                <div class="pswp__item"></div>
                <div class="pswp__item"></div>
            </div>
            <div class="pswp__ui pswp__ui--hidden">
                <div class="pswp__top-bar">
                    <div class="pswp__counter"></div>
                    <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
                    <!-- <button class="pswp__button pswp__button--share" title="Share"></button> -->
                    <!-- <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button> -->
                    <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
                    <div class="pswp__preloader">
                        <div class="pswp__preloader__icn">
                            <div class="pswp__preloader__cut">
                                <div class="pswp__preloader__donut"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                    <div class="pswp__share-tooltip"></div>
                </div>
                <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
                <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
                <div class="pswp__caption">
                    <div class="pswp__caption__center"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "../basis/normalize-css.js";
    import "./temp/photoswipe/photoswipe.css";
    import "./temp/photoswipe/default-skin/default-skin.css";
    import PhotoSwipe from "./temp/photoswipe/photoswipe.min.js";
    import PhotoSwipeUI_Default from "./temp/photoswipe/photoswipe-ui-default.min.js";
    export default {
        name: "sdk-webm-gallery",
        props: {},
        data: () => ({
            gallery: null,
        }),
        methods: {
            open(pictures, index) {
                if (this.gallery !== null) return;
                this.gallery = new PhotoSwipe(this.$el, PhotoSwipeUI_Default, pictures.map((picture) => ({
                    src: picture,
                    msrc: picture + "/resize,w_200,h_200",
                    w: window.innerWidth,
                    h: window.innerHeight,
                })), {
                    index: index > -1 && index < pictures.length ? index : 0,
                    history: false,
                    tapToClose: true,
                    tapToToggleControls: false,
                    closeOnScroll: false,
                    maxSpreadZoom: 4,
                });
                this.gallery.init();
                this.gallery.listen("close", () => this.close());
            },
            close() {
                this.destroy();
            },
            destroy() {
                if (this.gallery === null) return;
                this.gallery.close();
                this.gallery = null;
            },
            init() {
                this.destroy();
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
    .sdk-webm-gallery {
        overflow: hidden;

        .pswp__img {
            object-fit: contain;
        }

        .pswp__ui {
            position: static;
        }

        @media (max-width: 425px) {
            .pswp__button--zoom,
            .pswp__button--arrow--left,
            .pswp__button--arrow--right {
                display: none;
            }
        }
    }
</style>