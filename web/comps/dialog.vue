<template>
    <el-dialog class="sdk-dialog" :title="title" :visible.sync="acting" top="0" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" @opened="onEvent('opened')" @closed="onEvent('closed')">
        <div class="sdk-dialog__body" :style="{ width: width, height: height }">
            <template v-if="!closed">
                <slot></slot>
            </template>
        </div>
    </el-dialog>
</template>

<script>
    import "../basis/normalize-css.js";
    import "../basis/element-ui.js";
    export default {
        name: "sdk-dialog",
        props: {
            title: {
                type: String,
                default: "",
            },
            width: {
                type: String,
                default: "",
            },
            height: {
                type: String,
                default: "",
            },
        },
        data: () => ({
            acting: false,
            closed: true,
        }),
        methods: {
            onEvent(type) {
                if (!type) return;
                if (type === "opened") {
                    this.$emit("open");
                } else if (type === "closed") {
                    this.closed = true;
                    this.$emit("close");
                }
            },
            open() {
                this.acting = true;
                this.closed = false;
            },
            close() {
                this.acting = false;
            },
        },
    };
</script>

<style lang="scss">
    .sdk-dialog {
        &.el-dialog__wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .el-dialog {
            flex: 0 0 auto;
            display: flex;
            flex-direction: column;
            margin-bottom: 0;
            width: auto;
        }

        .el-dialog__header {
            flex: 0 0 auto;
            box-sizing: border-box;
            padding: 10px;
            height: 40px;
            line-height: 20px;
            background-color: #f0f0f0;
        }

        .el-dialog__title {
            font-size: 16px;
        }

        .el-dialog__headerbtn {
            box-sizing: border-box;
            top: 0;
            right: 0;
            padding: 10px;
            width: 40px;
            height: 40px;
            font-size: 20px;
            line-height: 20px;
        }

        .el-dialog__close {
            vertical-align: middle;
        }

        .el-dialog__body {
            flex: 1 1 auto;
            box-sizing: border-box;
            padding: 10px;
            overflow: auto;
        }
    }

    .sdk-dialog__body {
        max-width: 80vw;
        max-height: 80vh;
        overflow: auto;
    }
</style>