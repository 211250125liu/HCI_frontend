<template>
    <div class="image-container">
        <!-- 大字标题 -->
        <div class="title">
            <h1>{{ city_info.name }}<span class="album-text">Album</span></h1>
        </div>

        <!-- 大图片 -->
        <div class="large-image" @click="fetchData('江苏', city_info.name)">
            <img :src="city_info.largeImageUrl" alt="Large Image" loading="lazy">
        </div>

        <!-- 小图片 -->
        <div class="small-images" @click="fetchData('江苏', city_info.name)">
            <div v-for="(image, index) in city_info.smallImages" :key="index" class="small-image">
                <!-- <img :src="image.url" :alt="'Small Image ' + (index + 1)" @click="handleImageClick(index)"> -->
                <img :src="image" loading="lazy" alt="">
            </div>
        </div>
    </div>
</template>


<script>
import { request } from "../utils/request";

export default {
    props: ['city_info'],
    methods: {
        async fetchData(provinceName, cityName) {
            try {
                let provinceId;
                let cityId;

                // 使用 await 等待异步请求结果
                const provinceRes = await request.get('/provinces/' + provinceName);
                provinceId = provinceRes.result;

                const cityRes = await request.get('/cities/' + cityName);
                cityId = cityRes.result;

                // 在获取到所有数据后再打开新窗口
                window.open('/picture_collection/' + provinceId + '/' + cityId, '_blank');
            } catch (err) {
                // 错误处理
                console.error(err);
            }
        },
        extractImageSrc(htmlContent) {
            // 解析出图片地址
            const parser = new DOMParser();
            const parsedHtml = parser.parseFromString(htmlContent, 'text/html');

            const images = parsedHtml.querySelectorAll('img');
            const imageUrls = [];

            images.forEach((img) => {
                const imageUrl = img.getAttribute('src');
                imageUrls.push(imageUrl);
            });

            return imageUrls
        }
    },
    created() {
        console.log("cities", this.city_info)
    }
};
</script>

<style scoped>
.large-image {
    flex: 1;
    margin-right: 10px;
    margin-left: 30px;
    margin-top: 20px;
    margin-bottom: 25px;
    width: 250px;
    height: 250px;
    /* 设置大图片最大宽度 */
}

.large-image img {
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.small-images {
    display: flex;
    flex-wrap: wrap;
    max-width: 550px;
    margin-top: 15px;
    margin-right: 20px;
    justify-content: space-between;
    /* 设置小图片容器最大宽度 */
    /* 设置小图片之间的间距 */
}

.small-image {
    flex: calc(25% - 10px);
    margin: 5px;
    height: 120px;
    /* 每张小图片占据四分之一的宽度并考虑间距 */
    /* 调整小图片之间的间距 */
}

.small-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
}

.image-container {
    position: relative;
    display: flex;
    align-items: flex-start;
    /* 添加相对定位，使得内部元素可以基于其定位 */
    background-color: white;
    width: 855px;
    height: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding-top: 60px;
    /* 给标题留出空间 */
}

.title {
    position: absolute;
    /* 绝对定位 */
    top: 0;
    /* 距离顶部的位置 */
    left: 0;
    /* 距离左侧的位置 */
    margin-left: 30px;
    margin-top: 20px;
    /* 添加一些内边距 */
    /* 设置与父容器一致的背景色 */
    z-index: 1;
    /* 保证标题位于其他内容之上 */
}

.title h1 {
    font-size: 24px;
    font-weight: bold;
    /* 设置标题字体大小 */
    margin: 0;
}

.large-image {
    flex: 1;
    margin-right: 10px;
    max-width: 250px;
    position: relative;
    /* 添加相对定位 */
    z-index: 0;
    /* 确保图片位于标题下方 */
}

.album-text {
    font-size: 24px;
    /* 根据需要调整字体大小 */
    margin-left: 5px;
    color: #999999;
    font-weight: 500;
    /* 调整单词"album"与标题之间的间距 */
}
</style>
