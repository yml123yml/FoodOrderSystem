<template>
    <div class="cartcontrol">
        <transition name="move">   <!--减号和数字平移动画-->
            <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)">
                <i class="iconfont icon-jian"></i>
            </div>
        </transition>  
        <div class="cart-count" v-show="food.count>0">{{ food.count }}</div>
        <div class="cart-add" @click.stop.prevent="addCart">
            <i class="iconfont icon-jia"></i>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
export default {
    props: {
        food: {
            type: Object
        }
    },
    methods: {
        addCart(event) {
            // 去掉自带click事件的点击
            if (!event._constructed) {
                return;
            }
            if (!this.food.count) {
                //使用set接口，通过vue.set()添加属性，当它变化时就能被检测到，从而父组件能获取到count值（遍历选中的商品时使用）
                Vue.set(this.food, 'count', 1);
            } 
            else {
                this.food.count++;
            }
        },
        decreaseCart(event) {
            if (!event._constructed) {
                // 去掉自带click事件的点击
                return;
            }
            if(this.food.count) {
                this.food.count--;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .cartcontrol {
        font-size: 0;
        .move-enter-active,.move-leave-active {
            opacity: 1;
            transform: translate3d(0,0,0);
            transition: all 0.4s linear;
            transform: rotate(0);
        }    
        .move-enter,.move-leave-to {
            opacity: 0;
            transform: translate3d(17px,0,0);
        }
        .cart-decrease {
            display: inline-block;
            padding: 6px;  
            .icon-jian {
                line-height: 17px;
                font-size: 17px;
                background: rgb(0, 160, 220);
                color: #fff;
                border-radius: 50%;
            }
        }
        .cart-count {
            display: inline-block;
            vertical-align: top;
            width: 12px;
            padding-top: 6px;
            line-height: 17px;
            text-align: center;
            font-size: 10px;
            color: rgb(147, 153, 159);
        }
        .cart-add {
            display: inline-block;
            padding: 6px;
            .icon-jia {
                line-height: 17px;
                font-size: 17px;
                background: rgb(0, 160, 220);
                color: #fff;
                border-radius: 50%;
            }
        }
    }
</style>