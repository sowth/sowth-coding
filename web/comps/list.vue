<template>
    <div class="sdk-web-list" :class="{ 'sdk-web-list--window': window, 'sdk-web-list--fluid': fluid }">
        <div class="sdk-web-list__sky" v-if="$slots.prepend || $scopedSlots.prepend">
            <slot name="prepend"></slot>
        </div>
        <div class="sdk-web-list__cloud" v-if="$slots.default || $scopedSlots.default">
            <slot></slot>
        </div>
        <div class="sdk-web-list__head" v-if="!getLayoutHidden('filters')">
            <template v-for="(filter, index1) in filters">
                <div class="filter" :key="index1" v-if="!getFilterHidden(filter)">
                    <template v-if="filter.type">
                        <div class="name">
                            <div v-html="filter.name"></div>
                            <div>：</div>
                        </div>
                    </template>
                    <template v-if="filter.type === 'input'">
                        <el-input class="value" size="small" clearable placeholder="请输入" :style="{ width: filter.width > 0 ? filter.width + 'px' : null }" :readonly="getFilterReadonly(filter)" v-model="filter.value" @change="onEvent('dirty', filter)"></el-input>
                    </template>
                    <template v-else-if="filter.type === 'select'">
                        <el-select class="value" size="small" :style="{ width: filter.width > 0 ? filter.width + 'px' : null }" :disabled="getFilterReadonly(filter)" v-model="filter.value" @change="onEvent('dirty', filter)">
                            <el-option label="不限" :value="null"></el-option>
                            <el-option v-for="(option, index2) in filter.options" :key="index2" :label="option.name" :value="option.value"></el-option>
                        </el-select>
                    </template>
                    <template v-else-if="filter.type === 'date'">
                        <el-date-picker class="value" type="date" size="small" clearable placeholder="请选择" format="yyyy-MM-dd" value-format="timestamp" :style="{ width: filter.width > 0 ? filter.width + 'px' : null }" :disabled="getFilterReadonly(filter)" v-model="filter.value" @change="onEvent('dirty', filter)"></el-date-picker>
                    </template>
                </div>
            </template>
            <div class="filter">
                <div class="name"></div>
                <el-button type="primary" size="small" @click="onEvent('search')">搜索</el-button>
                <el-button type="plain" size="small" @click="onEvent('reset')">重置</el-button>
            </div>
        </div>
        <div class="sdk-web-list__nect" v-if="!getLayoutHidden('tools')">
            <template v-for="(tool, index5) in tools">
                <el-button size="mini" :type="tool.type" :icon="'el-icon-' + tool.icon" :key="index5" @click.stop="callToolClick(tool)" v-if="!getToolHidden(tool)">{{ tool.name }}</el-button>
            </template>
        </div>
        <div class="sdk-web-list__body" :class="{ 'sdk-web-list__body--loading': id > 0 }" v-loading="id > 0" v-if="!getLayoutHidden('columns')">
            <el-table ref="table" size="mini" border :height="window ? '100%' : null" :data="list" @header-click="onEvent('click-header')" @row-click="onEvent('click-row', $event)" @selection-change="onEvent('selection', $event)">
                <template v-for="(column, index3) in columns">
                    <template v-if="!getColumnHidden(column)">
                        <template v-if="column.type === 'selection'">
                            <el-table-column type="selection" :key="index3" :resizable="false"></el-table-column>
                        </template>
                        <template v-else>
                            <el-table-column :key="index3" :label="column.name" :resizable="false" :width="column.width > 0 ? column.width : null" :min-width="column.minWidth > 0 ? column.minWidth : null">
                                <template #header>
                                    <div style="line-height: 1;" v-html="column.name"></div>
                                </template>
                                <template #default="scope">
                                    <template v-if="column.type === 'text'">{{ getColumnRowValue(column, scope.row) }}</template>
                                    <div v-else-if="column.type === 'html'" v-html="getColumnRowValue(column, scope.row)"></div>
                                    <template v-else-if="column.type === 'button'">
                                        <template v-for="(button, index4) in getColumnRowValue(column, scope.row)">
                                            <el-button size="mini" :type="button.type" :key="index4" @click.stop="callColumnRowButtonClick(column, scope.row, button)" v-if="!getColumnRowButtonHidden(column, scope.row, button)">{{ button.name }}</el-button>
                                        </template>
                                    </template>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                </template>
            </el-table>
        </div>
        <div class="sdk-web-list__foot" v-if="!getLayoutHidden('columns')">
            <el-pagination class="pages" background layout="total,sizes,prev,pager,next,jumper" :page-sizes="[10, 20, 30, 50, 100]" :page-size.sync="linage" :current-page.sync="page" :total="total" @size-change="onEvent('paging')" @current-change="onEvent('paging')"></el-pagination>
        </div>
        <div class="sdk-web-list__ground" v-if="$slots.append || $scopedSlots.append">
            <slot name="append"></slot>
        </div>
    </div>
</template>

<script>
    import "../basis/normalize-css.js";
    import "../basis/element-ui.js";
    export default {
        name: "sdk-web-list",
        props: {
            window: {
                type: Boolean,
                default: false,
            },
            layout: {
                type: String,
                default: "",
            },
            fluid: {
                type: Boolean,
                default: true,
            },
            filters: {
                type: Array,
                default: () => [{
                    type: "input",
                    name: "姓名",
                    key: "name",
                    value: null,
                    options: null,
                    width: 160,
                    hidden: false,
                    readonly: false,
                    onchange: () => { },
                }, {
                    type: "select",
                    name: "状态",
                    key: "status",
                    value: null,
                    options: [{
                        name: "有效",
                        value: 1,
                    }, {
                        name: "无效",
                        value: 0,
                    }],
                    width: 100,
                    hidden: false,
                    readonly: false,
                    onchange: () => { },
                }],
            },
            tools: {
                type: Array,
                default: () => [{
                    type: "primary",
                    icon: "plus",
                    name: "添加",
                    key: "op1",
                    hidden: false,
                    onclick: () => { },
                }, {
                    type: "warning",
                    icon: "edit",
                    name: "编辑",
                    key: "op2",
                    hidden: false,
                    onclick: () => { },
                }, {
                    type: "danger",
                    icon: "delete",
                    name: "删除",
                    key: "op3",
                    hidden: () => { },
                    onclick: () => { },
                }],
            },
            columns: {
                type: Array,
                default: () => [{
                    type: "selection",
                    key: "selection",
                    hidden: false,
                }, {
                    type: "text",
                    name: "姓名",
                    key: "name",
                    value: "姓名",
                    width: 0,
                    minWidth: 0,
                    hidden: false,
                }, {
                    type: "text",
                    name: "状态",
                    key: "status",
                    value: () => "状态",
                    width: 0,
                    minWidth: 0,
                    hidden: () => { },
                }, {
                    type: "button",
                    name: "操作",
                    key: "operation",
                    value: [{
                        type: "plain",
                        name: "操作1",
                        key: "op1",
                        hidden: false,
                        onclick: () => { },
                    }, {
                        type: "plain",
                        name: "操作2",
                        key: "op2",
                        hidden: () => { },
                        onclick: () => { },
                    }],
                    width: 0,
                    minWidth: 0,
                    hidden: false,
                }],
            },
            displayFilters: {
                type: String,
                default: "",
            },
            hiddenFilters: {
                type: String,
                default: "",
            },
            displayTools: {
                type: String,
                default: "",
            },
            hiddenTools: {
                type: String,
                default: "",
            },
            displayColumns: {
                type: String,
                default: "",
            },
            hiddenColumns: {
                type: String,
                default: "",
            },
            fetch: {
                type: Function,
                default: () => Promise.reject(new Error("component prop fetch is not defined.")),
            },
        },
        data: () => ({
            id: 0,
            total: 0,
            linage: 10,
            page: 1,
            list: [],
            selects: [],
            handlers: {},
        }),
        methods: {
            onEvent(type, data) {
                let [filters, columns, table, id] = [this.filters, this.columns, this.$refs.table, 0];
                if (type === "reset") {
                    filters.forEach((filter) => {
                        if (filter.readonly) return;
                        let [value, onchange] = [filter.value, filter.onchange];
                        filter.value = null;
                        filter.value !== value && typeof onchange === "function" && onchange.apply(filter, [filters, filter]);
                    });
                    this.onEvent("dirty");
                    this.onEvent("search");
                } else if (type === "search") {
                    if (typeof this.fetch === "function") {
                        this.id = id = Math.random();
                        this.fetch(this.getQuery()).then((data) => {
                            if (this.id !== id) return;
                            if (data) {
                                this.id = 0;
                                if (this.page > 1 && data.list.length === 0) {
                                    this.onEvent("dirty");
                                    this.onEvent("search");
                                } else {
                                    this.total = data.total;
                                    this.list = data.list;
                                }
                            } else {
                                this.onEvent("dirty");
                            }
                        }).catch((error) => {
                            console.error(error.name + ": " + error.message);
                            this.onEvent("dirty");
                        });
                    } else {
                        this.onEvent("dirty");
                    }
                } else if (type === "dirty") {
                    let filter = data && filters.find((filter) => filter === data);
                    this.id = 0;
                    this.total = 0;
                    this.page = 1;
                    this.list = [];
                    this.selects = [];
                    filter && typeof filter.onchange === "function" && filter.onchange(filters, filter);
                    filter && this.onEvent("search");
                } else if (type === "paging") {
                    this.id = 0;
                    this.list = [];
                    this.selects = [];
                    this.onEvent("search");
                } else if (type) {
                    let valid = columns.some((column) => column.type === "selection" && !this.getColumnHidden(column));
                    if (type === "click-header") {
                        table && valid ? table.toggleAllSelection() : this.selects = [];
                    } else if (type === "click-row") {
                        table && valid ? table.toggleRowSelection(data) : this.selects = [];
                    } else if (type === "selection") {
                        this.selects = table && valid && Array.isArray(data) ? data : [];
                    }
                }
                table && table.doLayout();
            },
            getQuery() {
                return this.filters.reduce((query, filter) => {
                    query[filter.key] = filter.value;
                    query.total = this.id > 0 ? 0 : this.total;
                    query.linage = this.linage;
                    query.page = this.page;
                    return query;
                }, {});
            },
            getLayoutHidden(name) {
                let hidden1 = this.layout.length > 0 && !this.layout.split(",").includes(name);
                let hidden2 = ["filters", "tools", "columns"].includes(name) && this[name].length === 0;
                return hidden1 || hidden2;
            },
            getFilterHidden(filter) {
                return typeof filter.hidden === "function" ? filter.hidden(this.filters, filter) : filter.hidden;
            },
            getFilterReadonly(filter) {
                return typeof filter.readonly === "function" ? filter.readonly(this.filters, filter) : filter.readonly;
            },
            getToolHidden(tool) {
                return typeof tool.hidden === "function" ? tool.hidden(this.tools, tool) : tool.hidden;
            },
            callToolClick(tool) {
                typeof tool.onclick === "function" && tool.onclick(this.list, this.selects, this.getQuery());
            },
            getColumnHidden(column) {
                return typeof column.hidden === "function" ? column.hidden(this.columns, column) : column.hidden;
            },
            getColumnRowValue(column, row) {
                let [type, key, value] = [column.type, column.key, column.value];
                value = typeof value === "function" ? value.apply(column, [row]) : [null, undefined].includes(value) ? row[key] : value;
                return type === "button" && !Array.isArray(value) ? [value] : value;
            },
            getColumnRowButtonHidden(column, row, button) {
                let [type, hidden] = [column.type, button.hidden];
                return type === "button" && typeof hidden === "function" ? hidden.apply(button, [row]) : hidden;
            },
            callColumnRowButtonClick(column, row, button) {
                let [type, onclick] = [column.type, button.onclick];
                type === "button" && typeof onclick === "function" && onclick.apply(button, [row, this.list, this.selects, this.getQuery()]);
            },
            init() {
                this.id = 0;
                this.total = 0;
                this.page = 1;
                this.list = [];
                this.selects = [];
                ["filters", "tools", "columns"].forEach((name) => {
                    let keys1 = this["display" + name[0].toUpperCase() + name.substr(1)].split(",");
                    let keys2 = this["hidden" + name[0].toUpperCase() + name.substr(1)].split(",");
                    let result = this[name];
                    keys1.reduce((list, key) => {
                        let index = key.length > 0 ? list.findIndex((data) => data.key === key) : -1;
                        if (index > -1) result.push(list.splice(index, 1)[0]);
                        return list;
                    }, result.splice(0)).forEach((data) => result.push(data));
                    keys2.forEach((key) => {
                        let data = key.length > 0 && result.find((data) => data.key === key);
                        if (data) data.hidden = true;
                    });
                });
                this.onEvent("search");
            },
        },
        created() {
            window.addEventListener("resize", this.handlers.onWindowResize = () => this.onEvent());
        },
        mounted() { },
        beforeDestroy() {
            window.removeEventListener("resize", this.handlers.onWindowResize);
            this.onEvent("dirty");
        },
    };
</script>

<style lang="scss">
    .sdk-web-list {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 5px;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .sdk-web-list__sky {
        flex: 0 0 auto;
        margin: 5px;
    }

    .sdk-web-list__cloud {
        flex: 0 0 auto;
    }

    .sdk-web-list__head {
        flex: 0 0 auto;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 5px;
        border-radius: 4px;
        padding: 5px;
        background-color: #f6f7f8;

        & > .filter {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            margin: 5px;
            margin-right: 10px;

            & > .name {
                flex: 0 0 auto;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                width: 100px;
                color: #333;
                font-size: 14px;
                line-height: 1;
                text-align: right;
                overflow: hidden;
            }

            & > .value {
                flex: 0 0 auto;
                width: 180px;
            }
        }
    }

    .sdk-web-list__nect {
        flex: 0 0 auto;
        margin: 5px;

        .el-button--mini {
            padding: 7px 10px;
            font-size: 14px;
        }
    }

    .sdk-web-list__body {
        flex: 0 0 auto;
        margin: 5px;

        .el-table {
            thead {
                color: black;
            }

            .cell {
                font-size: 14px;
                text-overflow: initial;

                a[href] {
                    color: #0300cc;
                    cursor: pointer;

                    &:hover {
                        text-decoration: underline;
                    }
                }

                .el-button--mini {
                    margin: 5px;
                    padding: 5px 10px;
                    font-size: 13px;
                }
            }
        }

        .el-table__empty-text {
            font-size: 14px;
        }
    }

    .sdk-web-list__body--loading {
        .el-table__empty-text {
            opacity: 0;
        }
    }

    .sdk-web-list__foot {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        margin: 5px;

        & > .pages {
            flex: 1 1 0;
            text-align: right;
        }
    }

    .sdk-web-list__ground {
        flex: 0 0 auto;
        margin: 5px;
    }

    .sdk-web-list--window {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        .sdk-web-list__body {
            flex: 1 1 0;

            .el-table {
                position: absolute;
                top: 0;
                left: 0;
            }
        }
    }

    .sdk-web-list--fluid {
        .sdk-web-list__head {
            & > .filter {
                & > .name {
                    width: auto;
                }
            }
        }
    }
</style>