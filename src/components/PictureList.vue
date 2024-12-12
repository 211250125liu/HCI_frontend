<template>
    <ul class="list">
        <li v-for="(item, index) in list" :key="item.url">
            <div class="picture-list-item">
                <div class="image_preview">
                    <el-image :src="extractImageSrc(item.content)[0]" style="width: 1000px; height: 580px;" :zoom-rate="1.2"
                        :max-scale="7" :min-scale="0.2" :preview-src-list="extractImageSrc(item.content)" :initial-index="0"
                        fit="cover" :close-on-press-escape="true" />
                </div>
                <div class="content" @click="openDetail(index)">
                    <div class="title">{{ item.title }}</div>
                    <div class="date-location">
                        <div class="date">{{ item.createTime }}</div>
                        <div class="location-container">
                            <img src="../../public/image/location.jpg" alt="Location" class="location-img" />
                            <p class="location">江苏 {{ cityName }}</p>
                        </div>
                    </div>
                    <p class="description">{{ extractFirstParagraph(item.content)[0] }}</p>
                </div>
            </div>
        </li>
    </ul>
</template>
<script>
import logo from "../../public/image/river.jpeg"
import { request } from "../utils/request";

export default {
    props: ["list"],
    data() {
        return {
            cityName: ''
        }
    },
    methods: {
        extractFirstParagraph(htmlContent) {
            // 解析出第一个段落的文本内容
            // const match = htmlContent.match(/<p[^>]*>[\s\S]*?[\u4e00-\u9fa5]+[\s\S]*?<\/p>/);
            // return match ? match[0].replace(/<[^>]+>/g, '') : '';
            const parser = new DOMParser();
            const parsedHtml = parser.parseFromString(htmlContent, 'text/html');

            const textNodes = parsedHtml.querySelectorAll('p:not(:has(img))');
            const texts = [];

            textNodes.forEach((node) => {
                const text = node.textContent.trim();
                texts.push(text);
            });

            return texts
        },
        extractImageSrc(htmlContent) {
            // 解析出图片地址
            // const imgTags = htmlContent.match(/<img[^>]+src="([^"]+)"/g);
            // if (imgTags) {
            //     return imgTags.map(tag => {
            //         const match = tag.match(/src="([^"]+)"/);
            //         return match ? match[1] : '';
            //     }).filter(src => src !== '');
            // }
            // return [];

            const parser = new DOMParser();
            const parsedHtml = parser.parseFromString(htmlContent, 'text/html');

            const images = parsedHtml.querySelectorAll('img');
            const imageUrls = [];

            images.forEach((img) => {
                const imageUrl = img.getAttribute('src');
                imageUrls.push(imageUrl);
            });

            return imageUrls

        },
        openDetail(index) {
            window.open('/details/' + this.$props.list[index].id, '_blank')
        }
    },
    watch: {
        list(newV, oldV) {
            request.get('/cities/name/' + this.$props.list[0].cityId).then(response => {
                this.cityName = response.result
                console.log("shit", this.cityName)
            });
        }
    }
}
</script>

<style scoped>
.list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.picture-list-item {
    display: flex;
    align-items: center;
    /* Align items to the start */
    flex-direction: column;
    align-items: flex-start;
    /* Add some spacing between items */
}

.image_preview {
    width: 1000px;
    height: 580px;
    margin-left: 50px;
}

.content {
    flex: 1;
    margin-left: 50px;
    margin-right: 180px;
    width: 1000px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    /* Adjust padding as needed */
}

.description {
    word-break: break-all;
    margin-left: 48px;
    margin-right: 48px;
    word-wrap: break-word;
    margin-bottom: 30px;
    text-align: left;
    font-size: 18px;
    /* Increase the font size for description */
}

.location-container {
    display: flex;
    align-items: center;
}

.location-img {
    width: auto;
    /* Adjust the width of the location icon */
    height: 15px;
    /* Maintain aspect ratio */
    margin-right: 5px;
    margin-top: -10px;
    /* Adjust spacing between icon and text */
}

.location {
    word-break: break-all;
    word-wrap: break-word;
    margin-bottom: 10px;
    text-align: left;
    font-size: 14px;
    /* Adjust font size for location */
}

.title {
    font-weight: bold;
    color: #409EFF;
    font-size: 20px;
    margin-left: 48px;
    margin-right: 48px;
    margin-bottom: 10px;
    margin-top: 10px;
    text-align: left;
}

.date {
    font-weight: normal;
    font-size: 16px;
    margin-bottom: 10px;
    text-align: left;
    margin-right: 10px;
}

.date-location {
    display: flex;
    align-items: center;
    margin-left: 48px;
}
</style>
