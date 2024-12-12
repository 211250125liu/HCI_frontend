import { createStore } from 'vuex';

export default createStore({
    state() {
        return {
            provinces: {
                // 23个省
                台湾: "taiwan",
                河北: "hebei",
                山西: "shanxi",
                辽宁: "liaoning",
                吉林: "jilin",
                黑龙江: "heilongjiang",
                江苏: "jiangsu",
                浙江: "zhejiang",
                安徽: "anhui",
                福建: "fujian",
                江西: "jiangxi",
                山东: "shandong",
                河南: "henan",
                湖北: "hubei",
                湖南: "hunan",
                广东: "guangdong",
                海南: "hainan",
                四川: "sichuan",
                贵州: "guizhou",
                云南: "yunnan",
                陕西: "shaanxi",
                甘肃: "gansu",
                青海: "qinghai",
                // 5个自治区
                新疆: "xinjiang",
                广西: "guangxi",
                内蒙古: "neimenggu",
                宁夏: "ningxia",
                西藏: "xizang",
                // 4个直辖市
                北京: "beijing",
                天津: "tianjin",
                上海: "shanghai",
                重庆: "chongqing",
                // 2个特别行政区
                香港: "xianggang",
                澳门: "aomen",
            },
            city_jiangsu: {
                南京市: "jiangsu",
                无锡市: "jiangsu",
                徐州市: "jiangsu",
                常州市: "jiangsu",
                苏州市: "jiangsu",
                南通市: "jiangsu",
                连云港市: "jiangsu",
                淮安市: "jiangsu",
                盐城市: "jiangsu",
                扬州市: "jiangsu",
                镇江市: "jiangsu",
                泰州市: "jiangsu",
                宿迁市: "jiangsu",
            },
            initData : [
                { name: '北京', value: 1 },
                { name: '天津', value: 2 },
                { name: '上海',  value: 3 },
                { name: '重庆',  value: 4 },
                { name: '河北',  value: 5 },
                { name: '河南',  value: 6 },
                { name: '云南',  value: 7 },
                { name: '辽宁',  value: 8 },
                { name: '黑龙江',  value: 9 },
                { name: '湖南',  value: 10 },
                { name: '安徽',  value: 11 },
                { name: '山东',  value: 12 },
                { name: '新疆',  value: 13 },
                { name: '江苏',  value: 14 },
                { name: '浙江',  value: 15 },
                { name: '江西',  value: 16 },
                { name: '湖北',  value: 17 },
                { name: '广西',  value: 18 },
                { name: '甘肃',  value: 19 },
                { name: '山西',  value: 20 },
                { name: '内蒙古',  value: 21 },
                { name: '陕西',  value: 22 },
                { name: '吉林',  value: 23 },
                { name: '福建',  value: 24 },
                { name: '贵州',  value: 25 },
                { name: '广东',  value: 26 },
                { name: '青海',  value: 27 },
                { name: '西藏',  value: 28 },
                { name: '四川',  value: 29 },
                { name: '宁夏',  value: 30 },
                { name: '海南',  value: 31 },
                { name: '台湾',  value: 32 },
                { name: '香港',  value: 33 },
                { name: '澳门',  value: 34 },
                { name: '南海诸岛', value: 0},
            ],
            nameMap: {
                "新疆维吾尔自治区": "新疆",
                "西藏自治区": '西藏',
                "甘肃省": "甘肃",
                "宁夏回族自治区": "宁夏",
                "广西壮族自治区": "广西",
                "内蒙古自治区": "内蒙古",
                "香港特别行政区": "香港",
                "澳门特别行政区": "澳门",
                "江苏省": "江苏",
                "黑龙江省": "黑龙江",
                "青海省": "青海",
                "山西省": "山西",
                "陕西省": "陕西",
                "北京市": "北京",
                "天津市": "天津",
                "吉林省": "吉林",
                "辽宁省": "辽宁",
                "山东省": "山东",
                "河南省": "河南",
                "安徽省": "安徽",
                "上海市": "上海",
                "湖北省": "湖北",
                "浙江省": "浙江",
                "江西省": "江西",
                "湖南省": "湖南",
                "福建省": "福建",
                "云南省": "云南",
                "广东省": "广东",
                "四川省": "四川",
                "重庆市": "重庆",
                "贵州省": "贵州",
                "台湾省": "台湾",
                "海南省": "海南",
                "河北省": "河北",
            },
        }
    },
    mutations: {
    },
});