<template>
    <div>
        <div ref="geoEcharts" class="container" v-loading="loading"></div>
        <div v-if="Visible" class="back">
            <el-icon :size='40' class="backButton" @click="backToFirst">
                <Back />
            </el-icon>
        </div>
        <div class="big">
            <el-icon :size='40' class="bigButton" @click="handleZoomIn">
                <Plus />
            </el-icon>
        </div>
        <div class="small">
            <el-icon :size="40" class="smallButton" @click="handleZoomOut">
                <Minus />
            </el-icon>
        </div>
        <div class="reset">
            <el-icon :size="40" class="resetButton" @click="reset">
                <Refresh />
            </el-icon>
        </div>

        <div class="searchIcon">
            <el-icon :size="40" class="searchButton" @click="dialogFormVisible = true">
                <Search />
            </el-icon>
        </div>
        <el-dialog v-model="dialogFormVisible" class="custom-dialog">
            <template #header>
                <div class="searchText">搜索目的地</div>
            </template>
            <el-autocomplete v-model="input" :fetch-suggestions="querySearch" placeholder="搜索省份或地级市"
                @select="handleSelect" style="width: 500px;margin-top:0;">
            </el-autocomplete>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="dialogFormVisible = false; searchdest()">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>

import axios from 'axios';
import * as echarts from 'echarts';
import { MarkLineComponent } from 'echarts/components'
import { request } from "../utils/request";
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { Search } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import { h } from "vue";

import { Back, Minus, Plus, Refresh } from "@element-plus/icons-vue";

export default {
    components: { Minus, Plus, Search, Back, Refresh },
    setup() {
        const store = useStore();
        const provinces = computed(() => store.state.provinces);
        const initData = computed(() => store.state.initData);
        const nameMap = computed(() => store.state.nameMap);
        const cities = computed(() => store.state.city_jiangsu);
        return {
            provinces,
            initData,
            nameMap,
            cities,
        }
    },
    data() {
        return {
            provinceName: null,
            isUpdating: false,
            name: "china",
            zoom: 1.4,
            Visible: false,
            geoMapInstance: null,
            data: this.initData,
            input: '',
            dialogTableVisible: false,
            dialogFormVisible: false,
            loading: ref(true),
        }
    },
    created() {
        // 监听窗口缩放事件
        window.addEventListener('resize', this.handleResize);
        // this.handleResize();
        this.init();
    },
    beforeDestroy() {
        // 在组件销毁时移除窗口缩放事件监听
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        async fetchData(provinceName, cityName) {
            try {
                let provinceId = '';
                let cityId = '';

                // 使用 await 等待异步请求结果
                const provinceRes = await request.get('/provinces/' + provinceName);
                provinceId = provinceRes.result;

                const cityRes = await request.get('/cities/' + cityName);
                cityId = cityRes.result;
                console.log('/picture_collection/' + provinceId + '/' + cityId)

                // 在获取到所有数据后再打开新窗口
                window.open('/picture_collection/' + provinceId + '/' + cityId);
            } catch (err) {
                // 错误处理
                console.error(err);
            }
        },
        querySearch(queryString, cb) {
            console.log(queryString)
            const provinceresults = queryString
                ? Object.keys(this.provinces).filter(province =>
                    province.includes(queryString)
                    // 结果映射到一个对象数组，每个对象都有一个 value 属性
                ).map(province => ({ value: province }))
                : [];
            const cityresults = queryString
                ? Object.keys(this.cities).filter(city =>
                    city.includes(queryString)
                ).map(city => ({ value: city }))
                : [];
            const results = [...provinceresults, ...cityresults];
            // console.log(results);
            cb(results);
        },
        searchdest() {
            console.log("搜索的目的地是" + this.input);
            if (Object.prototype.hasOwnProperty.call(this.provinces, this.input)) {
                console.log("find" + this.input)

                this.showProvince(this.provinces[this.input])
                this.input = '';
            } else if (Object.prototype.hasOwnProperty.call(this.cities, this.input)) {
                console.log("find" + this.input)
                this.showProvince("jiangsu")
                this.input = '';
            } else if (this.input === '') {
                ElNotification({
                    title: '查询失败',
                    message: h('i', { style: 'color: teal' }, '请输入目的地'),
                })
            } else {
                ElNotification({
                    title: '查询失败',
                    message: h('i', { style: 'color: teal' }, '找不到这个地方：' + this.input),
                })
                this.input = '';
            }
        },
        handleSelect(item) {
            console.log("选中的项目: ", item);
        },

        handleResize() {
            // 获取当前窗口的宽度
            const windowWidth = window.innerWidth;

            // 根据窗口宽度调整 zoom 值，你可以根据实际需求定义调整逻辑
            this.zoom = windowWidth / 1000 * 1.4; // 这里的 1000 是你期望的基准宽度
            console.log("I do it " + this.zoom);
            // 在这里可以执行其他你想要的操作，比如更新数据或触发其他行为
            console.log(`更新后的 zoom 值: ${this.zoom}`);
            location.reload();
        },
        reset() {
            if (localStorage.getItem("isLogin") === "false") {
                this.initGeoEcharts(this.name, this.name + '.json')
            } else if (this.name === "china") {
                this.loadData();
            } else {
                this.showProvince(this.name)
            }
        },
        init() {
            console.log(localStorage.getItem("isLogin"))
            this.Visible = false;
            if (localStorage.getItem("isLogin") === "true") {
                this.loadData();
            } else {
                this.initGeoEcharts('china', 'china.json');
            }
        },
        handleZoomIn() {

            if (this.zoom < 5) {
                this.geoMapInstance.setOption({
                    geo: {
                        zoom: this.zoom + 0.1,
                    },
                });
                this.zoom += 0.1;
            }
        },
        handleZoomOut() {

            if (this.zoom > 0.5) {
                this.geoMapInstance.setOption({
                    geo: {
                        zoom: this.zoom - 0.1,
                    },
                });
                this.zoom -= 0.1;
            }
        },
        backToFirst() {

            this.provinceName = null;
            this.name = 'china'
            if (localStorage.getItem("isLogin") === "true") {
                this.loadData();
            } else {
                this.data = this.initData;
                this.initGeoEcharts('china', 'china.json');
            }
            this.Visible = false;
        },

        async loadData() {
            await this.getData();
            this.initGeoEcharts('china', 'china.json');
        },
        async getData() {
            try {
                let url = "/provinces";
                const res = await request.get(url);
                console.log(res);
                this.data = res.map(item => ({
                    name: item.name,
                    value: item.value,
                }));
                console.log(this.data);
            } catch (error) {
                // 处理错误
                console.error("Error fetching data:", error);
            }
        },
        showProvince(eName) {
            this.zoom = 1.4;
            let chineseName = Object.keys(this.provinces).find(key => this.provinces[key] === eName);
            console.log("chineseName ： " + chineseName)
            let url = "/cities/byProvince/" + chineseName
            request.get(url).then(res => {
                console.log(res)
                const mapData = res.map(item => ({
                    name: item.name,
                    value: item.value,
                }));
                console.log(mapData)
                this.data = mapData;
                this.initGeoEcharts(eName, eName + ".json")
            })
        },
        initGeoEcharts(map, url) {
            this.zoom = 1.4;
            if (map !== 'china') this.Visible = true
            axios.get(url.toString()).then(res => {
                echarts.registerMap(map.toString(), res.data)
                echarts.use([MarkLineComponent])
                this.$nextTick(() => {
                    if (this.geoMapInstance) {
                        this.geoMapInstance.dispose();
                    }
                    this.geoMapInstance = echarts.init(this.$refs['geoEcharts'], null, { renderer: 'svg' });
                    // this.geoMapInstance.on('georoam', this.onGeoRoam);
                    const option = {
                        top: 'middle',
                        left: 'center',
                        tooltip: {
                            trigger: 'item',
                            padding: [8, 12.5, 8, 12.5],
                            backgroundColor: 'rgb(7, 40, 85, 0.7);',
                            borderColor: '#53B4FF',
                            textStyle: {
                                color: "white" //设置文字颜色
                            },
                            triggerOn: 'mousemove',
                            formatter: function (params) {
                                return '<div>' + params.name + '</div>';
                            },
                        },
                        //整个地图
                        geo: {
                            roam: "move",
                            scaleLimit: {
                                min: 0.5,
                                max: 5,
                            },
                            left: '35%',
                            top: '5%',
                            show: true,
                            map: map,
                            zoom: 1.4,
                            nameMap: this.nameMap,
                            label: {
                                show: false,
                                formatter: function () {
                                    return '';
                                }
                                // color: 'black',
                                // position: "inside",
                                // distance: 0,
                                // fontSize: 14,
                            },
                            emphasis: {
                                itemStyle: {
                                    // 改触碰后颜色
                                    areaColor: '#FF8C004D',
                                    shadowColor: 'rgba(0,0,0,0.4)',
                                    shadowBlur: 5,
                                    shadowOffsetY: 5
                                }
                            },
                        },
                        visualMap: {
                            type: 'piecewise',
                            min: 0,
                            x: '21%',
                            y: '75%',
                            z: 999,
                            pieces: [
                                { min: 30, label: '如家', color: '#4169E1' },
                                { min: 21, max: 30, label: '亲切', color: '#6495ED' },
                                { min: 6, max: 20, label: '旅行', color: '#87CEFA' },
                                { min: 1, max: 5, label: '路过', color: '#AFEEEE' },
                                { min: 0, max: 0, label: '没去过', color: '#add8e6' }
                            ],
                            show: true,
                            textStyle: {
                                color: '000000',
                                fontWeight: 'bold',
                                fontSize: 14,
                            },
                        },

                        series: [
                            {
                                // name : '熟悉度',// 系列名称
                                type: 'map',//图表类型
                                geoIndex: 0,
                                z: 2,
                                data: this.data
                            },],

                    }

                    if (this.name === 'hainan') {
                        option.geo.center = [109.844902, 19.0392];//中心位置
                        option.geo.layoutCenter = ['50%', '40%'];//地图相对容器偏移
                        option.geo.layoutSize = "400%";//地图放大比例
                    } else { //非显示海南时，将设置的参数恢复默认值
                        option.geo.center = undefined;
                        option.geo.layoutCenter = undefined;
                        option.geo.layoutSize = undefined;
                    }
                    this.loading = false;
                    this.geoMapInstance.setOption(option, true);
                    this.geoMapInstance.on("click", (param) => {
                        console.log(param);
                        console.log(param.name)
                        if (param.name in this.provinces) {
                            // 处理省模块
                            let names = param.name;
                            for (let key in this.provinces) {
                                this.provinceName = param.name;
                                console.log("name:" + name + "key:" + key);
                                if (names === key) {
                                    this.name = this.provinces[key];
                                    console.log("this.provinces[key]" + " " + this.provinces[key]);
                                    this.showProvince(this.provinces[key]);
                                    break;
                                }
                            }
                        } else {
                            this.fetchData(this.provinceName, param.name)
                        }
                    });
                    // 不允许点击visualMap
                    this.geoMapInstance.on('datarangeselected', (e) => {
                        const selected = { 0: true, 1: true, 2: true, 3: true, 4: true } //* 因为这边只分了五段，故写死
                        if (JSON.stringify(selected) !== JSON.stringify(e.selected)) { //* 判断是否为全部选中，全部选中则不用设置。如果不判断则会死循环
                            console.log(this.$refs);
                            console.log(e);
                            this.geoMapInstance.dispatchAction({ //* 调用action方法将图例重新设置为全部选中
                                type: 'selectDataRange',
                                // 连续型 visualMap 和 离散型 visualMap 不一样
                                // 连续型的是一个表示数值范围的数组。
                                // 离散型的是一个对象，键值是类目或者分段的索引。值是`true`或`false`
                                selected: { 0: true, 1: true, 2: true, 3: true, 4: true }
                            })
                        }
                    })
                })
            })
        },
    },
}
</script>

<style scoped>
.container {
    position: absolute;
    width: 100%;
    height: 550px;
    margin: auto;
    padding: 0;
}

.back {
    position: absolute;
    top: 5%;
    right: 20%;
    z-index: 10;
    opacity: 0.5;
}

.big {
    opacity: 0.5;
    position: absolute;
    top: 8%;
    left: 20%;
    z-index: 10;
}

.bigButton {
    background-color: black;
    color: white;
    width: 50px;
    height: 50px;
    padding: 4px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 30px;
}

.backButton {
    background-color: black;
    color: white;
    width: 50px;
    height: 50px;
    font-size: 30px;
    padding: 4px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}

.small {
    opacity: 0.5;
    position: absolute;
    top: 20%;
    left: 20%;
    z-index: 10;
}

.reset {
    opacity: 0.5;
    position: absolute;
    top: 32%;
    left: 20%;
    z-index: 10;
}

.resetButton {
    background-color: black;
    color: white;
    width: 50px;
    height: 50px;
    padding: 4px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    font-size: 18px;
}

.smallButton {
    background-color: black;
    color: white;
    width: 50px;
    height: 50px;
    padding: 4px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    font-size: 30px;
}

/*.backButton:hover{*/
/*    background-color: orange;*/
/*}*/

:deep(.el-dialog) {
    background-color: rgb(15, 39, 56, 0.8);
    /* Semi-transparent black background */
    height: 220px;
    /* Example height */
}

.searchIcon {
    opacity: 0.5;
    position: absolute;
    top: 44%;
    left: 20%;
    z-index: 10;
}

.searchButton {
    background-color: black;
    color: white;
    width: 50px;
    height: 50px;
    padding: 4px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    font-size: 18px;
}

.searchText {
    font-size: larger;
    color: white;
}

.example-showcase .el-loading-mask {
    z-index: 20;
}
</style>
