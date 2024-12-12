<template>
    <div>
        <div class="map">
            <ChineseMap />
        </div>

        <div class="page-container">
            <div class="container">
                <div class="statistics">
                    你最喜欢的是
                    <span :style="{ fontSize: '30px', fontWeight: 'bold' }">江苏省</span><br>
                    你的足迹遍布江苏省
                    <span :style="{ fontSize: '30px', fontWeight: 'bold' }">{{ cities.length }}</span>个市<br>
                    <span :style="{ fontSize: '30px', fontWeight: 'bold' }">{{ popularCityName
                    }}</span>是你足迹最深的城市<br>
                    你撰写了<span :style="{ fontSize: '30px', fontWeight: 'bold' }">{{ maxJournalNum }}</span>篇{{
                        popularCityName
                    }}的游记
                </div>
            </div>

            <div class="vertical-line">
                <!-- 点的样式 -->
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>


            <div class="picture-collection">
                <div class="show">
                    <div v-for="city in cities" :key="city.name">
                        <homePic :city_info="city" />
                    </div>
                </div>
            </div>


        </div>

        <div>
            <Footer />
        </div>

    </div>
</template>

<script>
import ChineseMap from "../components/ChineseMap.vue";
import Footer from "../components/Footer.vue";
import homePic from "../components/homePic.vue";
import index from "vuex";
import { request } from "../utils/request";
import add_pic from "../assets/add_pic.jpg"

export default {
    computed: {
        index() {
            return index
        }
    },
    mounted() {
        // this.len *= this.items.length;
        // let line = document.getElementById("line").style;
        // line.height = this.len + 'px'
    },
    name: "TravelHome",
    data() {
        return {
            len: 336.22,
            cities: [
                {
                    name: '徐州市',
                    largeImageUrl: './src/assets/bg_argentina.jpg',
                    smallImages: [ './src/assets/bg_argentina.jpg', './src/assets/bg_argentina.jpg', './src/assets/3.jpg',
                        './src/assets/1.jpg', './src/assets/3.jpg', './src/assets/bg_stars.jpg',
                        './src/assets/2.jpg', './src/assets/location.jpg']
                },
                {
                    name: '徐州市',
                    largeImageUrl: './src/assets/bg_argentina.jpg',
                    smallImages: [ './src/assets/bg_argentina.jpg', './src/assets/bg_argentina.jpg', './src/assets/3.jpg',
                        './src/assets/1.jpg', './src/assets/3.jpg', './src/assets/bg_stars.jpg',
                        './src/assets/2.jpg', './src/assets/location.jpg']
                },
                {
                    name: '徐州市',
                    largeImageUrl: './src/assets/bg_argentina.jpg',
                    smallImages: [ './src/assets/bg_argentina.jpg', './src/assets/bg_argentina.jpg', './src/assets/3.jpg',
                        './src/assets/1.jpg', './src/assets/3.jpg', './src/assets/bg_stars.jpg',
                        './src/assets/2.jpg', './src/assets/location.jpg']
                },
                {
                    name: '徐州市',
                    largeImageUrl: './src/assets/bg_argentina.jpg',
                    smallImages: [ './src/assets/bg_argentina.jpg', './src/assets/bg_argentina.jpg', './src/assets/3.jpg',
                        './src/assets/1.jpg', './src/assets/3.jpg', './src/assets/bg_stars.jpg',
                        './src/assets/2.jpg', './src/assets/location.jpg']
                }
                ,{
                    name: '南京市',
                    largeImageUrl: './src/assets/1.jpg',
                    smallImages: [ './src/assets/big2.jpg', './src/assets/2.jpg', './src/assets/3.jpg',
                        './src/assets/4.jpg', './src/assets/5.jpg', './src/assets/6.jpg',
                        './src/assets/7.jpg', './src/assets/big.jpg']
                }
        ],
            cityName: ['南京市', '徐州市', '苏州市', '常州市', '无锡市', '镇江市', '扬州市', '淮安市', '泰州市', '南通市', '宿迁市', '连云港市', '盐城市'],
            popularCityName: '南京市',
            maxJournalNum: 0
        }
    },
    components: {
        homePic,
        ChineseMap,
        Footer
    },

    methods: {
        extractImageSrc(htmlContent) {
            // 解析出图片地址
            const imgTags = htmlContent.match(/<img[^>]+src="([^"]+)"/g);
            if (imgTags) {
                return imgTags.map(tag => {
                    const match = tag.match(/src="([^"]+)"/);
                    return match ? match[1] : '';
                }).filter(src => src !== '');
            }
            return [];
        }
    },
    created() {
        this.cityName.forEach(async city => {
            let imageSrcs = [];
            let newCity = {
                name: '',
                largeImageUrl: add_pic,
                smallImages: Array(8).fill(add_pic)
            };
            let journalNum = 0
            if (city === '南京市') {
                newCity = this.cities[0]
            }
            const cityId = await request.get('/cities/' + city)

            request.get('/journal/city/' + cityId.result).then(response => {
                if (response.length !== 0) {
                    newCity.name = city
                    response.forEach(entry => {
                        journalNum++
                        imageSrcs = imageSrcs.concat(this.extractImageSrc(entry.content) || []);
                    });

                    if (journalNum > this.maxJournalNum) {
                        this.maxJournalNum = journalNum
                        this.popularCityName = city
                    }

                    // 填充 largeImageUrl 和 smallImages 数组
                    if (imageSrcs.length >= 1) {
                        newCity.largeImageUrl = imageSrcs[0];
                    }

                    for (let i = 0; i < Math.min(imageSrcs.length - 1, 8); i++) {
                        newCity.smallImages[i] = imageSrcs[i + 1];
                    }
                    if (city !== '南京市') {
                        this.cities.push(newCity)
                    }
                }
            })
        })

        // this.cities.forEach(async city => {
        //     let imageSrcs = [];
        //     const cityId = await request.get('/cities/' + city.name)

        //     request.get('/journal/city/' + cityId.result).then(response => {
        //         response.forEach(entry => {
        //             imageSrcs = imageSrcs.concat(this.extractImageSrc(entry.content) || []);
        //         });

        //         // 填充 largeImageUrl 和 smallImages 数组
        //         if (imageSrcs.length >= 1) {
        //             city.largeImageUrl = imageSrcs[0];
        //         }

        //         for (let i = 0; i < Math.min(imageSrcs.length - 1, 8); i++) {
        //             city.smallImages[i] = imageSrcs[i + 1];
        //         }
        //     })
        // })
    }
}

</script>

<style scoped>
.map {
    position: relative;
    /*margin: auto;*/
    width: 100%;
    height: 550px;
    /*float: right;*/

    /*background-color: #F2F6ff;*/
    background-image: url('/src/assets/bg_darkblue.jpg')
}

.picture-collection {
    display: flex;
    flex-direction: row;
    justify-content: center;
    /* margin-right: 10%; */
    margin-left: 5%;

    /* float: right; */
    /* width: 75%; */
    /*margin-top: 48px;*/
    /*margin-bottom: 10px;*/
    /*margin-inside: 10px;*/
}

.statistics {
    text-align: right;
}

.show {
    margin-left: 10px;
}

.page-container {
    width: 100%;
    margin: 0;
    background-color: #fffafa;
    position: relative;
}

.container {
    position: absolute;
    display: flex;
    flex-direction: column;
    margin-left: 2%;
    margin-top: 20px;
    width: 20%;
}

.vertical-line {
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(20% + 3.5%);
    /* 根据你的布局调整垂直线的位置 */
    width: 3px;
    /* 设置垂直线的宽度 */
    background-color: #d6d6d6;
    /* 设置垂直线的颜色 */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

/* 点的样式 */
.dot {
    width: 10px;
    height: 10px;
    background-color: #d6d6d6;
    border-radius: 50%;
    margin-top: 30px;
    /* 设置点之间的间距 */
}

/* 通过 nth-child 来设置点的位置与对应文字一一对应 */
.dot:nth-child(1) {
    position: absolute;
    top: 12px;
    /* 调整第一个点的垂直位置 */
}

.dot:nth-child(2) {
    position: absolute;
    top: 62px;
    /* 调整第二个点的垂直位置 */
}

.dot:nth-child(3) {
    position: absolute;
    top: 112px;
    /* 调整第三个点的垂直位置 */
}

.dot:nth-child(4) {
    position: absolute;
    top: 162px;
    /* 调整第四个点的垂直位置 */
}
</style>
