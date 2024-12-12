<template>
    <div class="footer">
        <div class="footer-content">
            <div class="footer-text1">
                <h3>关于</h3>
                <p>关于我们</p>
                <p>合作单位</p>
            </div>
            <div class="footer-text2">
                <h3>关于旅游</h3>
                <p>旅游推荐</p>
                <p>注意事项</p>
            </div>
            <div class="footer-text3">
                <p>联系我们: 211250125@smail.nju.edu.cn</p>
                <p>友情链接: <a href="https://software.nju.edu.cn/">https://software.nju.edu.cn/</a></p>
                <p>网站备案号: 本网站尚未备案</p>
            </div>
            <div class="footer-image">
                <img src="/src/assets/pay.png" alt="联系方式" />
                <p>支持我们</p>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'Footer'
}
</script>

<style scoped>
.footer {
    /*background-color: #727272;*/
    background-color: #cad7ef;
    color: #000000;
    text-align: center;
    padding: 20px 0;
    font-family: 'Arial', sans-serif;
    /*margin-top: 0px;*/
}

.footer p {
    margin: 5px 0; /* 调整段落间距 */
    font-size: 14px; /* 调整字体大小 */
}

.footer a {
    color: #6272a4; /* 选择与背景协调的颜色 */
    text-decoration: none; /* 移除下划线 */
}

.footer a:hover {
    text-decoration: underline; /* 鼠标悬停时添加下划线 */
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
}

.footer-text1 {
    width: 20%;
}

.footer-text2 {
    width: 20%;
}

.footer-text3 {
    width: 40%;
}

.footer-image {
    width: 20%;
}

.footer-image img {
    width: 25%; /* 让图片填满容器 */
    height: auto; /* 保持图片的纵横比 */
}
</style>

