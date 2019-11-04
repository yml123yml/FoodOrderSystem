<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <!-- 综合评价 -->
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{ seller.score }}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{ seller.rankRate }}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{ seller.serviceScore }}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{ seller.foodScore }}</span>
          </div>
           <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{ seller.deliveryTime }}分钟</span>
           </div>
        </div>
      </div>
      <split></split>
      <ratingselect @increment="incrementTotal" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="ratings"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" :key="rating.id" v-show="needShow(rating.rateType, rating.text)" class="rating-item">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar" alt="">
            </div>
            <!-- 内容 -->
            <div class="content">
              <h1 class="name">{{ rating.username }}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{ rating.deliveryTime }}</span>
              </div>
              <p class="text">{{ rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <i class="iconfont icon-duihao2"></i>
                <span class="item" v-for="item in rating.recommend" :key="item.id">{{ item }}</span>
              </div>
              <div class="time">
                {{ rating.rateTime | date-format }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import star from '../star/star.vue';   //导入star语境
import split from "../split/split.vue";
import ratingselect from '../ratingSelect/ratingselect.vue';

//定义常量ALL
const ALL = 2;
const ERR_OK = 0;

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return{
      ratings:[],
      selectType: ALL,     //变量跟踪
      onlyContent: true,//先设置组件一开始显示有内容的评价
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
      
    }
  },
  created() {
    this.$http.get('/api/ratings').then((data) => {
        console.log(data.body) ;
        console.log(data.body.errno) ;
        if(data.body.errno === ERR_OK){
          console.log(data.body.data) ;
          this.ratings = data.body.data;
          this.$nextTick(( ) => {
            console.log(this.$refs.ratings);
             this.scroll = new BScroll(this.$refs.ratings,{
            click: true
            });
          });
        }
    })
  },
  
    methods: {
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
  components: {  //注册
    star,
    split,
    ratingselect
  }


};
</script>

<style lang="scss" scoped>
.ratings{
  position: absolute;
  top: 174px;
  bottom: 0px;
  left: 0px;
  width: 100%;
  overflow: hidden;
  .overview{
    display: flex;
    padding: 18px 0;
    .overview-left{
      flex: 0 0 137px;
      padding: 6px 0;
      width: 137px;
      border-right: 1px solid rgba(7, 17, 27, 0.1);
      text-align: center;
      @media only screen and (max-width: 320px){   //为了在屏幕调制小屏幕下，
        flex: 0 0 120px;
        width: 12opx;
      }
      .score{
        margin-bottom: 6px;
        line-height: 28px;
        font-size: 24px;
        color: rgb(255, 153, 0);
      }
      .title{
        margin-bottom: 8px;
        line-height: 12px;
        font-size: 12px;
        color: rgb(7, 17, 27);
      }
      .rank{
        line-height: 10px;
        font-size: 10px;
        color: rgb(147, 153, 159);
      }
    }
    .overview-right{
      flex: 1 ;
      padding: 6px 0 6px 24px;
      @media only screen and (max-width: 320px){   //为了在屏幕调制小屏幕下，
        padding-left: 6px;
      }
      .score-wrapper{
        margin-bottom: 8px;
        font-size: 0px;
        .title{
          display: inline-block;
          line-height: 18px;
          vertical-align: top;
          font-size: 12px;
          color: 
          rgb(7, 17, 27);
        }
        .star{ 
            display: inline-block;
            margin:0 12px;
            vertical-align: top;
        }
        .score{
          display: inline-block;
          line-height: 18px;
          vertical-align: top;
          font-size: 12px;
          color: rgb(255, 153, 0);
        }
      }
      .delivery-wrapper{
        font-size: 0px;
        .title{
          line-height: 18px;
          font-size: 12px;
          color: 
          rgb(7, 17, 27);
        }
        .delivery{
          margin-left: 12px; 
          font-size: 12px;
          color: rgb(147, 153, 159);
        }
      }

    }

  }
  .rating-wrapper{
    padding: 0 18px;
    .rating-item{
      display: flex;
      padding: 18px 0;
      border-bottom: 1px solid rgba(7, 17, 27,0.1);
      .avatar{
        flex: 0 0 28px;
        width: 28px;
        margin-right: 12px;
        img{
          border-radius: 50%;
        }
      }
      .content{
        position: relative;
        flex: 1;
        .name{
          margin-bottom: 4px;
          line-height: 12px;
          font-size: 10px;
          color: rgb(7, 17, 27);
        }
        .star-wrapper{
          margin-bottom: 6px;
          font-size: 0;
          .star{
            display: inline-block;
            margin-right: 16px;
            vertical-align: top;
          }
          .delivery{
            margin-right: 16px;
            vertical-align: top;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }

        }
        .text{
          margin-bottom: 8px;
          line-height: 18px;
          font-size: 12px;
           color: rgb(7, 17, 27);
        }
        .recommend{
          line-height: 16px;
          font-size: 1px;
          .icon-duihao2, item{
            display: inline-block;
            margin: 0 8px 4px 0;
            font-size: 9px;
            }
            .icon-duihao2{
              color: rgb(0, 160, 220);
            }
            .item{
              padding: 0 6px;
              border: 1px solid rgba(7, 17, 27, 0.1);
              border-radius: 1px;
              color: rgb(147, 153, 159);
              background:#fff;
            }
          
        }
        .time{
          position: absolute;
          top: 0px;
          right: 0;
          line-height: 12px;
          font-size: 10px;
          color: rgb(147, 153, 159);

        }
      }
    }

  }

}

</style>