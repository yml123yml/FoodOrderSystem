<template>
  <div class="goods">
    <!-- 左侧菜单 -->
    <!-- 
      ref 被用来给元素或子组件注册引用信息 引用信息将会注册在父组件的 $refs 对象上  
      如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素; 如果用在子组件上，引用就指向组件实例:
    -->
    <div class="menu-wrapper" ref="menuWrapper">
      
      <ul>
        <li v-for="(item,index) in goods" :key="item.id" class="menu-item" @click="toggle(index);selectMenu(index,$event)" :class="{'active':index==checkindex}">
          <span class="text">
            <!--classMap[item.type]是一个数组，通过item.type去取对应的class，item.type是data.json中mock的数据-->
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
            {{ item.name }}
          </span>
        </li>
      </ul>

    </div>
    <!-- 右侧食物 -->
    <div class="food-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" :key="item.id" class="food-list food-list-hook">
          <h1 class="title">{{ item.name }}</h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for="food in item.foods" :key="food.id" class="food-item">
              <div class="icon">
                <img :src="food.icon" />
              </div>
              <div class="content">
                <h2 class="name">{{ food.name }}</h2>
                <p class="desc">{{ food.description }}</p>
                <div class="extra">
                  <span class="count">月售{{ food.sellCount }}个</span>
                  <span>好评率{{ food.rating }}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{ food.price }}</span>
                  <span class="old" v-show="food.oldPrice">￥{{ food.oldPrice }}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 购物车 -->
    <shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"    ref="shopCart"></shopcart>
    <!-- 小球飞入 -->
    <!-- <cartcontrol :food="food" @increment="incrementTotal"></!-->
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import shopcart from "../shopCart/shopCart.vue";
import cartcontrol from "../cartcontrol/cartcontrol.vue";
import food from "../food/food.vue";
const ERR_OK = 0;
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],//一开始goods为空
      listHeight:[],
      scrollY:0,
      selectedFood:{},
      checkindex:0
    };
  },
  created() {
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
    
    //当这个组件被调用的时候，通过接口获得数据赋值给goods
    this.$http.get("/api/goods").then(response => {//'/api/goods'请求的是data.json下的goods数组
      response = response.body;
      if (response.errno === ERR_OK) {
      console.log("状态码："+ERR_OK)
        this.goods = response.data;
        //异步加载
        this.$nextTick(() => {//可以用 $nextTick 來确保Dom变化后再执行一些事情
          // 调用initScroll()方法能计算内层ul的高度，当内层ul的高度大于外层wrapper的高度时，可以实现滚动。
          this.initScroll();
          this.calculateHeight();
        });
      }
    });    
  },
  computed: {
    /*计算属性, 左侧index位置*/
    //计算到达哪个区域的区间的时候的对应的索引值
    currentIndex() {
      for(let i=0; i<this.listHeight.length; i++) {
        let height1 = this.listHeight[i];//获得当前的list高度
        let height2 = this.listHeight[i + 1];//获得下一个高度
        //需要确定是在两个menu子块的高度区间
        if (!height2 || (this.scollY >= height1 && this.scollY < height2)) {
          return i;//返回这个menu子块的索引
        }
      }
      return 0;
    },
    //自动将所有的goods.food添加一个count属性,方便做数量运算
    selectFoods() {
      let foods = [];
      this.goods.forEach((good) => {
        good.foods.forEach((f) => {
          if(f.count) {
            foods.push(f);
          }
        });
      });
      return foods;
    }
  },
  methods: {
    //切换高亮
    toggle(index) {
      this.checkindex = index;
    },
    //左右菜单滚动效果
    initScroll() {
      //初始化scroll区域
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true//结合BScroll的接口使用,是否将click事件传递,默认被拦截了
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3//滚动时实时告诉我们位置,3实时派发scroll事件，探针的作用
      });

      /*实时监测滚动位置,参数就是位置*/
      //结合BScroll的接口使用,监听scroll事件(实时派发的),并获取鼠标坐标，当滚动时能实时暴露出scroll
      this.foodsScroll.on('scroll',(pos) =>{  //事件的回调函数
        this.scrollY = Math.abs(Math.round(pos.y));//滚动坐标会出现负的,并且是小数,所以需要处理一下，实时取得scrollY
      });      
    },

    //计算foods内部每一个块的高度,组成一个数组listHeight
    calculateHeight() {
      /*通过得到每个li元素，循环得到每个li的高度*/
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');//获取每一个food的dom对象
      let height = 0; //初始化第一个高度为0
      this.listHeight.push(height);//第一个区块的高度push进去
      for (let i=0; i<foodList.length; i++) {
        let item = foodList[i];//每一个item都是刚才获取的food的每一个dom
        height += item.clientHeight;////主要是为了获取每一个foods内部块的高度,累加
        this.listHeight.push(height);
      }
    },
    //点左边菜单选择右侧对应食物
    selectMenu(index,event,highLight) {
      //去掉自带的click事件点击，即pc端直接返回
      if(!event._constructed) {
        return;
      }
      // console.log(index);
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      let el = foodList[index];
      //跳转到指定的dom
      this.foodsScroll.scrollToElement(el, 300);//scrollToElement(el, 300)滚动到某个元素，el（必填）表示 dom 元素，time 表示动画时间
      this.current = highLight;
    },

    selectFood(food,event){
      if(!event._constructed) {
        return;
      }
      this.selectedFood = food;
      this.$refs.food.show();//调用food.vue的方法

    }
  },
  components: {
    shopcart,
    cartcontrol,
    food
  }
};
</script>

<style lang="scss" scoped>
.active {
  background: #ffffff;
  border-left: 4px solid red;
  font-weight: bolder;
}
.goods {  
  display: flex;
  position: absolute;
  top: 174px;
  bottom: 46px;
  width: 100%;
  overflow: hidden;
  .menu-wrapper {
    flex: 0 0 80px; //第一个：等分，第二个：内容不足时的缩放情况，第三个：占位空间
    width: 80px;
    background: #f3f5f7;
    .menu-item {
      display: table; //在table中可用vertical-align:middle实现垂直居中
      height: 54px;
      line-height: 14px;
      width: 56px;
      padding: 0 12px;     
      .icon {
        display: inline-block;
        vertical-align: top;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        background-size: 12px 12px;
        background-repeat: no-repeat;
        &.decrease {
          background-image: url("./img/decrease_2@2x.png");
        }
        &.discount {
          background-image: url("./img/discount_2@2x.png");
        }
        &.guarantee {
          background-image: url("./img/guarantee_1@2x.png");
        }
        &.invoice {
          background-image: url("./img/invoice_2@2x.png");
        }
        &.special {
          background-image: url("./img/special_1@2x.png");
        }
      }
      .text {
        display: table-cell;
        vertical-align: middle;
        font-size: 14px;
      }     
    }
  }
  .food-wrapper {
    flex: 1;
    .title {
      padding-left: 14px;
      height: 26px;
      line-height: 26px;
      border-left: 2px solid #d9dde1;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background: #f3f5f7;
    }
    .food-item {
      display: flex;
      margin: 18px;
      padding-bottom: 18px;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      .icon {
        flex: 0 0 57px;
        margin-right: 10px;
        img {
          width: 57px;
          height: 57px;
        }
      }
      .content {
        position: relative;
        flex: 1;
        .name {
          margin: 2px 0 8px 0;
          height: 14px;
          line-height: 24px;
          color: rgb(7, 17, 27);
          font-size: 14px;
        }
        .desc {
          line-height: 12px;
          font-size: 10px;
          color: rgb(147, 153, 159);
          margin-bottom: 8px;
        }
        .extra {
          line-height: 12px;
          font-size: 10px;
          color: rgb(147, 153, 159);
          .count {
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
            margin-right: 8px;
            font-size: 14px;
            text-decoration:line-through;//删除线
          }
        }
        .cartcontrol-wrapper {
          position: absolute;
          right: -10px;
          bottom: 12px;
        }
      }
    }
  }
}
</style>