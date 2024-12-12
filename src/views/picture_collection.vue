<template>
    <div class="page-container">
        <div class="container">
            <div class="show">{{ provinceName }}-{{ cityName }}</div>
            <div class="city-description">
                {{ provinceIntroduction }}
            </div>
            <div class="near-city">
                {{ cityIntroduction }}
            </div>
        </div>
        <div class="right-wrapper">
            <PictureList :list="journalData" />
        </div>

        <!-- Add a button for "Add Footprint" -->
        <div class="add-footprint-btn">
            <button class="button" @click="addFootprint">添加足迹</button>
        </div>
    </div>
</template>

<script>
import PictureList from "../components/PictureList.vue";
import { request } from "../utils/request";

export default {
    name: "picture_collection",
    components: {
        PictureList,
    },
    data() {
        return {
            journalData: [],
            provinceId: '',
            cityId: '',
            provinceName: '江苏',
            cityName: '',
            cityIntroduction: null,
            nanjing: "南京市，简称“宁”，古称金陵、建康，江苏省辖地级市、省会、副省级市、特大城市、南京都市圈核心城市，国务院批复确定的中国东部地区重要的中心城市、全国重要的科研教育基地和综合交通枢纽\n" +
                "                。截至2022年，全市下辖11个区，总面积6587.02平方千米 ，建成区面积868.28平方千米 ，常住人口949.11万人，城镇人口825.80万人，城镇化率87.01%。",
            provinceIntroduction: "江苏省，简称“苏”，是中华人民共和国省级行政区，省会南京，位于长江三角洲地区， 中国大陆东部沿海，地跨北纬30°45'～35°08'，东经116°21'～121°56'，与上海市、浙江省、安徽省、山东省接壤。总面积10.72万平方千米。截至2021年末，江苏省共有13个设区市，95个县（市、区）。 2022年末全省常住人口8515万人，城镇化率达74.4%。",
        };
    },
    created() {
        this.cityId = this.$route.params.cityId;
        this.provinceId = this.$route.params.provinceId;
        console.log(this.provinceId + " " + this.cityId);
        let url = "/cities/introduction/" + this.cityId
        request.get(url).then(res => {
            console.log("res " + res.result)
            this.cityIntroduction = res.result;
        })
        request.get('/journal/city/' + this.cityId).then(res => {
            this.journalData = res
            console.log("res " + JSON.stringify(res[0]))
        })

        request.get('/cities/name/' + this.cityId).then(response => {
            this.cityName = response.result
        });
    },
    methods: {
        addFootprint() {
            // Implement the functionality to add a footprint
            // This method will be triggered when the button is clicked

            window.open("/journal/" + this.provinceId + "/" + this.cityId);
            console.log("Footprint added!");
            // You can add your logic here to handle adding a footprint
        },
    },
};
</script>

<style scoped>
.container {
    position: fixed;
    width: 20%;
    display: flex;
    flex-direction: column;
    float: left;
    margin-left: 3%;
    margin-top: 20px;
}

.city-description {
    background-color: white;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.near-city {
    background-color: white;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-left: auto;
    margin-top: auto;
}

.right-wrapper {
    width: 75%;
    /* border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
    float: right;
    margin-top: 20px;
}


.add-footprint-btn {
    position: fixed;
    top: 80px;
    right: 50px;
}

/*.add-footprint-btn {*/
/*    position: absolute;*/
/*    top: 30px;*/
/*    !* 距离顶部的距离 *!*/
/*    right: 50px;*/
/*    !* 距离右侧的距离 *!*/
/*}*/

.button {
    background-color: #409EFF;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.list-container {
    text-align: right;
}

.edit-button {
    background-color: #409EFF;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.page-container {
    margin: 0;
    background-color: #efefef;
}

.show {
    text-align: center;
    font-size: 25px;
    margin-bottom: 10px;

}
</style>
