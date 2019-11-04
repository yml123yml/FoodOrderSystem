<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" />
          <div class="back" @click="hide">
            <i class="iconfont icon-fanhui"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{ food.name }}</h1>
          <div class="detail">
            <span class="sell-count">月售{{ food.sellCount }}份</span>
            <span class="rating">好评率{{ food.rating }}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{ food.price }}</span>
            <span class="old" v-show="food.oldPrice">￥{{ food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div
              @click.stop.prevent="addFirst"
              class="buy"
              v-show="!food.count || food.count===0"
            >加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text">{{ food.info }}</p>
        </div>
        <split></split>
        <div class="rating">
            <h1 class="title">商品评价</h1>
            <!--  ratings对应被点击的food的ratings-->
            <ratingselect @increment="incrementTotal" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
            <!-- 评价列表-->
            <div class="rating-wrapper">
              <!-- ratings不无空 显示列表 -->
              <ul v-show="food.ratings && food.ratings.length">
                <!-- rateType关联：全部 、推荐、吐槽按钮；text关联：只看有内容的评价 -->
                <li v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings" :key="rating.id" class="rating-item">
                  <div class="user">
                    <span class="name">{{ rating.username }}</span>
                    <img class="avatar"  width="12" height="12" :src="rating.avatar">
                  </div>
                  <div class="time">{{ rating.rateTime | date-format}}</div>
                  <!-- 评论 -->
                  <p class="text">
                    <!--   图案更改：点赞、吐槽     rateType===0 为赞； 1为不赞  -->
                    <span :class="{'iconfont icon-thumbup' :rating.rateType===0, 
                                  'iconfont icon-tucao-tianchong' :rating.rateType===1}"></span>{{ rating.text }}  
                  </p>
                </li>
              </ul>
              <!-- <div class="no-ratings" v-show="!food.ratings || !food.ratings.length">暂无评价</div> -->
            </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BScroll from "better-scroll";
import cartcontrol from "../cartcontrol/cartcontrol.vue";
import Vue from "vue";
import split from "../split/split.vue";
import ratingselect from '../ratingSelect/ratingselect.vue';

//定义三个常量
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      showFlag: false,
      selectType: ALL,     //变量跟踪
      onlyContent: false,//先设置组件一开始显示有内容的评价
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    };
  },
  methods: {
    show() {
      console.log("...."+this.food.ratings);
      this.showFlag = true;
      //初始化部分，ratingselect组件是被不同的商品使用的，所以我们希望在点开不同的商品时，能有一样的初始化状态
      this.selectType = ALL;   //初始化
      this.onlyContent = true;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    hide() {
      this.showFlag = false;
    },
    addFirst(event) {
      if (!event._constructed) {
        return;
      }
      Vue.set(this.food, "count", 1);
    },
    needShow(type, text) {   //函数
      if(this.onlyContent && !text){  //onlyContent：只选内容 ，(选择的内容 && 没文本)          
        return false; 
      }
      if(this.selectType === ALL){  // 有文本为true
        return true;
      }else{
        return type === this.selectType;     //相等返回T 不等F
      }
    },
     incrementTotal(type, data) {
            this[type] = data;
            this.$nextTick(() => { // 当我们改变数据的时候，DOM的更新是异步的
                this.scroll.refresh();
        });
     }
  },
  events: {
    'ratingtype.select'(type) {     //监听 ratingselect 里 ratingtype.select事件
      this.selectType = type;          //把type赋值给父组件selectType
      // this.$nextTick(() => {
      //    this.scroll.refresh();
      // });
    },
     'content.toggle'(onlyContent) {
      this.onlyContent = onlyContent;
      //  this.$nextTick(() => {
      //     this.scroll.refresh();
      // });
     }
  },
  components: {
    //注册
    cartcontrol,
    split,
    ratingselect
  }
};
</script>

<style lang="scss" scoped>
.food {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 48px;
  z-index: 30;
  width: 100%;
  background: #fff;
  &.move-enter-active,
  &.move-leave-active {
    transition: all 0.2s;
  }
  &.move-enter,
  &.move-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .image-header {
    position: relative;
    width: 100%;
    height: 0; /* padding-top: 100%;去撑开，用宽度去计算高度*/
    padding-top: 100%;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .back {
      position: absolute;
      top: 10px;
      left: 10px;
      .icon-fanhui {
        display: block;
        padding: 10px;
        font-size: 20px;
        color: #fff;
      }
    }
  }
  .content {
    position: relative;
    padding: 18px;
    .title {
      line-height: 14px;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 700;
      color: rgb(7, 17, 27);
    }
    .detail {
      margin-bottom: 18px;
      line-height: 10px;
      font-size: 0;
      height: 10px;
      .sell-count,
      .rating {
        font-size: 10px;
        color: rgb(147, 153, 159);
      }
      .sell-count {
        margin-right: 12px;
      }
    }
    .price {
      font-weight: 700;
      line-height: 24px;
      .now {
        margin-right: 8px;
        font-size: 14px;
        color: rgb(240, 20, 20);
      }
      .old {
        text-decoration: line-through;
        font-size: 10px;
        color: rgb(147, 153, 159);
      }
    }
    .cartcontrol-wrapper {
      position: absolute;
      right: 12px;
      bottom: 12px;
    }
    .buy {
      position: absolute;
      right: 18px;
      bottom: 18px;
      z-index: 10;
      height: 24px;
      line-height: 24px;
      padding: 0 12px;
      box-sizing: border-box;
      border-radius: 12px;
      font-size: 10px;
      color: #fff;
      background: rgb(0, 160, 220);
      &.fade-enter-active,
      &.fade-leave-active {
        transition: all 0.5s;
        opacity: 1;
      }
      &.fade-enter,
      &.fade-leave-to {
        opacity: 0;
      }
    }
  }
  .info {
    padding: 18px;
    .title {
      line-height: 14px;
      margin-bottom: 16px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }
    .text {
      line-height: 24px;
      padding: 0 8px;
      font-size: 12px;
      color: rgb(77, 85, 93);
    }
  }
  .rating{
      padding-top: 18px;
      .title{
        line-height: 14px;
        margin-left: 18px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .rating-wrapper{
        padding: 0 18px;
        .rating-item{
          position: relative;
          padding: 16px 0;
          border-bottom: 1px solid rgba(7, 17, 27,0.1); 
          .user{
            position: absolute;
            right: 0;
            top: 16px;
            line-height: 12px;
            font-size: 0px;
            .name{
              display: inline-block;
              margin-right: 6px;
              vertical-align: top;
              font-size: 10px;
              color: rgb(147, 153, 159);
            }
            .avatar{
              border-radius: 50%;
            }
          }
          .time{
              margin-bottom: 6px;
              line-height: 12x;
              font-size: 10px;
              color: rgb(147, 153, 159); 
            }
          .text{
            line-height: 16px;
            font-size: 12px;
            color: rgb(7, 17, 27);
            .icon-icon-thumbup, .icon-tucao-tianchong{
              margin-right: 4px;
              line-height: 16px;
              font-size: 12px；
            }
            .icon-thumbup{
              color: rgb(0, 160, 220);
            }
            .icon-tucao-tianchong{
              color: rgb(147, 153, 159);  
            }

          }
        }
        .no-rating {
          padding: 16px 0;
          font-size: 12px;
          color: rgb(147,153,159);
        }
      }

  }
}
</style>


