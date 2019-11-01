<template>
    <div class="shopcart">
        <div class="content" @click="toggleList">
            <!-- 购物车左 -->
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'highlight':totalCount>0}">
                      <i class="iconfont icon-gouwuchekong" :class="{'highlight':totalCount>0}"></i>
                    </div>
                    <div class="num" v-show="totalCount>0">{{ totalCount }}</div>
                </div>
                <div class="price" :class="{'highlight':totalPrice>0}">￥{{ totalPrice }}</div>
                <div class="desc">另需配送费￥{{ deliveryPrice }}元</div>
            </div>
            <!-- 购物车右 -->
            <!-- payDesc()控制显示内容，payClass()添加类调整显示样式 -->
            <div class="content-right" @click.stop.prevent="pay">
                <div class="pay" :class="payClass">
                    {{payDesc}}
                </div>  
            </div>
            <!-- 购物车详情页 -->
            <transition name="list">
                <div class="shopcart-list" v-show="listShow" @click="hideList">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty" @click="empty">清空</span>
                    </div>
                    <div class="list-content" ref="listContent">
                        <ul>
                            <li class="food" v-for="food in selectFoods" :key="food.id">
                                <span class="name">{{ food.name }}</span>
                                <div class="price">
                                    <span>¥{{ food.price * food.count }}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food"></cartcontrol>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
            <!--背景模糊-->
            <transition name="mask">
                <div class="list-mask" v-show="listShow"></div>
            </transition>
        </div>
    </div>
</template>

<script>
import cartcontrol from '../cartcontrol/cartcontrol.vue';
import BScroll from "better-scroll";

export default {
    data() {
        return {
            // 购物车小球动画
            // balls :[
            //     {
            //         show: false
            //     },
            //     {
            //         show: false
            //     },
            //     {
            //         show: false
            //     },
            //     {
            //         show: false
            //     },
            //     {
            //         show: false
            //     }
            // ],
            // dropBall: []
            fold: true
        }
    },
    props: {
        //选择了多少商品：定义成数组，底栏其余部分的变化都基于这个对象的变化而变化
        selectFoods: {
            type: Array,
            default() {
                return [{price: 25, count: 1}];
            }
        },
        deliveryPrice: {
            type: Number,
            default: 0
        },
        minPrice: {
            type: Number,
            default: 0
        }
    },
    computed: {
        //计算总价，超过起送额度后提示可付款
        totalPrice() {
            let total = 0;
            this.selectFoods.forEach((food) => {
                total += food.price * food.count;
            });
            return total;
        },
        //计算选中的food数量，在购物车图标处显示，采用绝对定位，top：0；right：0；显示在购物车图标右上角
        totalCount() {
            let count = 0;
            this.selectFoods.forEach((food) => {
                count += food.count;
            });
            return count;
        },
        payDesc() {
            if (this.totalPrice === 0) {
                return `￥${this.minPrice}元起送`; //这里使用的是es6中的反引号
            } 
            else if (this.totalPrice < this.minPrice) {
                let diff = this.minPrice - this.totalPrice;
                return `还差￥${diff}元起送`;
            } 
            else {
                return '去结算';   //单引号，单引号和反引号不同
            }
        },
        payClass() {
            if (this.totalPrice < this.minPrice) {
                return 'not-enough';
            } 
            else {
                return 'enough';
            }
        },
        listShow() {
            console.log(this.totalCount);
            if(!this.totalCount){     
                //totalCount==0时，折叠
                this.fold = true;
                return false;
            }
            let show = !this.fold;
            console.log("show:"+show);
            if(show) {
                //如果显示详情页s
                this.$nextTick(() => {
                    if(!this.scroll){
                        console.log(this.scroll);   
                        //如果实例不存在，新建
                        this.scroll = new BScroll(this.$refs.listContent,{
                            click: true
                        });
                    }else {
                        //实例存在，直接调用refresh接口
                        this.scroll.refresh();
                    }
                });
            }
            return show;
        }
    },
    methods: {
        // 购物车详情
        //清空购物车
        empty() {
            this.selectFoods.forEach((food) => {
                food.count = 0;
            });
        },
        //切换购物车详情展开折叠
        toggleList() {
            if(!this.totalCount) 
                return;
            this.fold = !this.fold;
        },
        hideList() {
            this.fold = true;
        },
        pay() {
            if(this.totalprice < this.minPrice) {
                return;
            }
            window.alert(`支付${ this.totalPrice }元`);
        }


        // 购物车小球动画
    },
    components: {
        cartcontrol//注册组件
    }
}
</script>
<style lang="scss" scoped>
    .shopcart {
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 50;
        width: 100%;
        height: 48px;
        .content {
            display: flex;
            background: #141d27;
            font-size: 0;
            .content-left {
                position: relative;
                flex: 1;
                .logo-wrapper {
                    display: inline-block;
                    position: relative;
                    top: -10px;
                    margin: 0 12px;
                    padding: 6px;
                    width: 56px;
                    height: 56px;
                    box-sizing: border-box;
                    vertical-align: top;
                    border-radius: 50%;
                    background: #141d27;
                    .logo {
                        width: 100%;
                        height: 100%;
                        text-align: center;
                        border-radius: 50%;
                        background: #2d343c;
                        &.highlight {
                            background: rgb(0, 160, 220);
                        }
                    }
                    .icon-gouwuchekong {
                        color: #80858a;
                        font-size: 24px;
                        line-height: 44px;
                        &.highlight {
                            color: #fff;
                        }
                    }
                    .num {
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 24px;
                        height: 24px;
                        line-height: 16px;
                        text-align: center;
                        border-radius: 16px;
                        font-size: 9px;
                        font-weight: 700;
                        color: #fff;
                        background: rgb(240, 20, 20);
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .4);
                    }
                }
                .price {
                    display: inline-block;
                    line-height: 24px;
                    margin-top: 12px;
                    box-sizing: border-box;
                    padding-right: 12px;
                    color: rgba(255, 255, 255, .4);
                    border-right: 1px solid rgba(255, 255, 255, .1);
                    font-size: 16px;
                    font-weight: 700;
                    &.highlight {
                        color: #fff;
                    }
                }
                .desc {
                    display: inline-block;
                    line-height: 24px;
                    margin-left: 12px;
                    color: rgba(255, 255, 255, .4);
                    font-size: 10px;
                }
            }
            .content-right {       
                position: relative;       
                flex: 0 0 105px;
                width: 105px;
                .pay {
                    font-size: 14px;
                    height: 48px;
                    line-height: 48px;
                    color: rgba(255, 255, 255, .4);
                    text-align: center;
                    background: #2b333b;
                    &.not-enough {
                        background:#2b333b; 
                    }
                    &.enough {
                        background: #00b43c;
                        color: #fff;
                    }
                }
            }     
            .shopcart-list {
                position: absolute;
                left: 0;
                top: 0;
                z-index: 2;
                width: 100%;
                transform: translate3d(0, -100%, 0);
                background: #fff;
                &.list-enter-active,&.list-leave-active {
                    transition: all 1s;
                    opacity: 1;
                }
                &.list-enter,&.list-leave-to {
                    transform: translate3d(0,0,0);
                    opacity: 0;
                }
                .list-header {
                    height: 40px;
                    line-height: 40px;
                    padding: 0 18px;
                    background: #f3f5f7;
                    border-bottom: 1px solid rgba(7,17,27,0.1);
                    .title {
                        float: left;
                        font-size: 14px;
                        color: rgb(7,17,27);
                    }
                    .empty {
                        float: right;
                        font-size: 12px;
                        color: rgb(0,160,220);
                    }
                }
                .list-content {
                    padding: 0 18px;
                    max-height: 217px;
                    background: #fff;
                    overflow: hidden;
                    .food {
                        position: relative;
                        padding: 12px 0;
                        box-sizing: border-box;
                        border-bottom: 1px solid rgba(7,17,27,0.1);
                        .name {
                            line-height: 24px;
                            font-size: 14px;
                            color: rgb(7,17,27);
                        }
                        .price {
                            position: absolute;
                            right: 90px;
                            bottom: 12px;
                            line-height: 24px;
                            font-size: 14px;
                            font-weight: 700;
                            color: rgb(240,20,20);
                        }
                        .cartcontrol-wrapper {
                            position: absolute;
                            right: 0;
                            bottom: 6px;
                        }      
                    }
                }
            } 
            .list-mask {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
                backdrop-filter: blur(10px);
                background: rgba(7,17,27,0.6);
                &.mask-enter-active, &.mask-leave-active {
                    transition: all 0.5s;
                }    
                &.mask-enter, &.mask-leave-to {
                    background: rgba(7, 17, 27, 0);
                }
                    
            }
        }
    }
      
      
      
      


            // 购物车小球动画
            // .ball-container {
            //     .ball {
            //         position: fixed;
            //         left: 32px;
            //         bottom: 22px;
            //         z-index: 200;
            //         transition: all 0.6s cubic-bezier(0.49, -0.29, 0.75, 0.41);
            //     }
            //     .inner {
            //         width: 16px;
            //         height: 16px;
            //         border-radius: 50%;
            //         background: rgb(0, 160, 220);
            //         transition: all 0.4s linear;
            //     }
            // }

</style>