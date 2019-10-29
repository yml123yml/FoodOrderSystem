<template>
    <div class="header">
        <div class="content-wrapper">
            <div class="avatar">
                <img :src="seller.avatar">
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{ seller.name }}</span>
                </div>
                <div class="description">
                    {{ seller.description }}/{{ seller.deliveryTime }}分钟送达
                </div>
                <div v-if="seller.supports" class="support" >
                    <span class="icon"></span>
                    <span class="text">{{ seller.supports[0].description }}</span>
                </div>
            </div>
            <div v-if="seller.supports" class="support-count" @click="showDetail">
                <span class="count">{{ seller.supports.length }}个</span>
                <i class="iconfont icon-youjiantou"></i>
            </div>
        </div>
        <div class="bulletin-wrapper" @click="showDetail">
            <span class="bulletin-title"></span><span class="bulletin-text">{{ seller.bulletin }}</span>
            <i class="iconfont icon-youjiantou"></i>
            
        </div>
        <div class="background">
            <img :src="seller.avatar">
        </div>
        <transition name="fade">
            <div class="detail" v-show="detailShow">
                <div class="detail-wrapper clearfix">
                    <div class="detail-main">
                        <h1 class="name">{{ seller.name }}</h1>
                        <div class="star-wrapper">
                            <star :size="48" :score="seller.score"></star>
                        </div>
                        <!-- 两边是线 中间是内容  用flex -->
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">优惠信息</div>
                            <div class="line"></div>
                        </div>
                        <ul v-if="seller.supports" class="supports">
                            <li class="support-item" v-for="(item,index) in seller.supports" :key="item.id">
                                <span class="icon" :class="classMap[item.type]"></span>
                                <span class="text">{{ seller.supports[index].description }}</span>
                            </li>
                        </ul>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">商家公告</div>
                            <div class="line"></div>
                        </div>
                        <div class="bulletin">
                            <p class="content">{{ seller.bulletin }}</p>
                        </div>
                    </div>
                </div>
                <!-- 弹窗关闭按钮 -->
                <div class="detail-close" @click="hideDetail"> 
                    <i class="iconfont icon-dankuangguanbianniu"></i>
                </div>
            </div>
        </transition>
        
    </div>
</template>
<script>
import star from '../star/star.vue';
export default {
    data() {
        return {
            detailShow: false
        }
    },
    created() {
        this.classMap = ['decrease','discount','special','invoice','guarantee'];
    },
    components: {
        star
    },
    methods: {
        showDetail() {
            this.detailShow = true;
        },
        hideDetail() {
            this.detailShow = false;
        }
    },
    props: {
        seller: {
            type: Object
        }
    }
}
</script>
<style lang="scss" scoped>
    .header {
        color:#fff;
        position: relative;
        background: rgba(7, 17, 27, 0.5);
        overflow: hidden;
        .content-wrapper {
            padding: 24px 12px 18px 24px;
            font-size: 0;
            position: relative;
            .avatar {
                display: inline-block;
                vertical-align: top;
                img {
                    width: 64px;
                    height: 64px;
                    border-radius: 2px;
                }
            }
            .content {
                display: inline-block;
                font-size: 14px;
                margin-left: 16px;
                .title {
                    margin:2px 0 8px 0;
                    .brand {
                        display: inline-block;
                        vertical-align: top;/*向上对齐 */
                        width: 30px;
                        height: 18px;
                        background-image: url("./img/brand@2x.png");
                        background-size: 30px 18px;
                    }
                    .name {
                        display: inline-block;
                        margin-left: 6px;
                        font-size: 16px;
                        line-height: 18px;
                        font-weight: bold;
                    }
                }
                .description {
                    margin-bottom: 10px;
                    line-height: 12px;
                    font-size: 12px;
                }
                .support {
                    .icon {
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        margin-right: 4px;
                        background-size: 12px 12px;
                        background-repeat: no-repeat;
                        &.decrease {
                            background-image: url('./img/decrease_2@2x.png');
                        }
                        &.discount {
                            background-image: url('./img/discount_2@2x.png');
                        }
                        &.guarantee {
                            background-image: url('./img/guarantee_1@2x.png');
                        }
                        &.invoice {
                            background-image: url('./img/invoice_2@2x.png');
                        }
                        &.special {
                            background-image: url('./img/special_1@2x.png');
                        }
                    }
                    .text {
                        display: inline-block;
                        font-size: 10px;
                        line-height: 12px;
                        margin-top: 3px;
                        vertical-align: top;
                    }
                }
            }
            .support-count {
                position: absolute;
                right: 12px;
                bottom: 18px;
                padding: 0 8px;
                height: 24px;
                line-height: 24px;
                border-radius: 14px;
                background: rgba(0, 0, 0, 0.2);
                text-align: center;
                .count {
                    font-size: 12px;
                    vertical-align: top;
                }
                .iconfont {
                    margin-left: 5px;
                    font-size: 10px;
                    height: 24px;
                    line-height: 24px;
                }
            }
        }
        .bulletin-wrapper {
            height: 28px;
            line-height: 28px;
            padding: 0 22px 0 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            position: relative;
            background: rgba(7, 17, 27, 0.2);
            .bulletin-title {
                display: inline-block;
                width: 22px;
                height: 12px;
                background: url("./img/bulletin@2x.png");
                background-size: 22px 12px;
                background-repeat: no-repeat;
                vertical-align: top;
                margin-top: 7px;
            }
            .bulletin-text {
                font-size: 10px;
                margin: 0 4px;
                vertical-align: top;
            }
            .iconfont {
                position: absolute;
                font-size: 10px;
                right: 12px;
                bottom: -1px;
                
            }
        }
        .background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            filter: blur(10px);// 模糊背景
            img {
                width: 100%;
                height: 100%;
            }
        }
        .fade-enter,
        .fade-leave-to {
            opacity: 0;
            background: rgba(7, 17, 27, 0);
        }
        .fade-enter-active,
        .fade-leave-active {
            transition: 2s all ease;
        }
        .detail {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100;
            width: 100%;
            height: 100%;
            overflow: auto;
            background: rgba(7, 17, 27, 0.8);
            z-index: 999;
            backdrop-filter: blur(10px);//背景模糊
            .clearfix {
                display: inline-block;
            }
            .clearfix:after {
                display: block;
                height: 0;
                content: "";
                line-height: 0;
                clear: both;
                visibility: hidden;
            }
            .detail-wrapper {
                min-height: 100%;
                width: 100%;
                .detail-main {
                    margin-top: 64px;
                    padding-bottom: 64px;
                    .name {
                        line-height: 16px;
                        text-align: center;
                        font-size: 16px;
                        font-weight: 700;
                    }
                    .star-wrapper {
                        margin-top: 18px;
                        padding: 2px 0;
                        text-align: center;
                    }
                    .title {
                        display: flex;
                        width: 80%;
                        margin: 24px auto;
                        .line {
                            flex: 1;
                            position: relative;
                            top: -11px;
                            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                        }
                        .text {
                            padding: 0 12px;
                            font-size: 14px;
                            font-weight: 700;

                        }
                    }
                    .supports {
                        width: 80%;
                        margin: 0 auto;//水平居中
                        .support-item {
                            padding: 0 12px;
                            margin-bottom: 12px;
                            font-size: 0;
                            &:last-child {
                                margin-bottom: 0;
                            }
                            .icon {
                                display: inline-block;
                                width: 16px;
                                height: 16px;
                                vertical-align: top;
                                margin-right: 16px;
                                background: url('./img/decrease_1@2x.png');
                                background-size: 16px 16px;
                                
                            }
                            .text {
                                line-height: 16px;
                                font-size: 18px;
                            }
                        }
                    }
                    .bulletin {
                        width: 80%;
                        margin: 0 auto;
                        .content {
                            padding: 0 12px;
                            line-height: 24px;
                            font-size: 12px;
                            font-family: "微软雅黑";
                            color: #ffffff;
                        }
                    }
                }
            }
            .detail-close {
                position: relative;
                width: 32px;
                height: 32px;
                margin: -64px auto;
                clear: both;
                font-size: 32px;
                .iconfont {
                    position: absolute;
                    font-size: 44px;
                    top: -70px;
                    left: -12px;
                    color: #fff;
                    z-index: 10;
                }
            }
        }
    }
</style>