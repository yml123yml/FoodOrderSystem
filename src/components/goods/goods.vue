<template>
  <div class="goods">
    <!-- 左侧菜单 -->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li :class="{'current':currentIndex===index}" v-for="(item,index) in goods" :key="item.id" class="menu-item" @click="selectMenu(index,$event)" >
          <span class="text">
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
      goods: [],
      listHeight:[],
      scrollY:0,
      selectedFood:{}
    };
  },
  created() {
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
    this.$http.get("/api/goods").then(response => {
      response = response.body;
      if (response.errno === ERR_OK) {
      console.log("状态码："+ERR_OK)
        this.goods = response.data;
        //异步加载
        this.$nextTick(() => {
          this.initScroll();
          this.calculateHeight();
        });
      }
    });    
  },
  computed: {
    /*计算属性, 左侧index位置*/
    currentIndex() {
      for(let i=0; i<this.listHeight.length; i++) {
        let height1 = this.listHeight[i];//获得当前的list高度
        let height2 = this.listHeight[i + 1];//获得下一个高度
        if (!height2 || (this.scollY >= height1 && this.scollY < height2)) {
          return i;
        }
      }
      return 0;
    },
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
    //小球飞入
//     incrementTotal(target) {
// 　　　　this.$nextTick(()=>{
// 　　　　　　this.$refs.shopCart.drop(target);
//       });
    // },

    //左右菜单滚动效果
    initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true//默认派发点击事件
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3//滚动时实时告诉我们位置
      });

      /*实时监测滚动位置,参数就是位置*/
      this.foodsScroll.on('scroll',(pos) =>{
        this.scrollY = Math.abs(Math.round(pos.y));
        // console.log(scrollY);
      });

      
    },

    //计算高度
    calculateHeight() {
      /*通过得到每个li元素，循环得到每个li的高度*/
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      let height = 0;
      this.listHeight.push(height);//第一个区块的高度push进去
      for (let i=0; i<foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;//累加每个区块的高度
        this.listHeight.push(height);
      }
    },
    //点左边菜单选择右侧对应食物
    selectMenu(index,event) {
      if(!event._constructed) {
        return;
      }
      // console.log(index);
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      let el = foodList[index];
      this.foodsScroll.scrollToElement(el, 300);
      // this.activeClass = index;
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
    &.current {
      position: relative;
      z-index: 100;
      // margin-top: -1px;
      background: #ffffff;
      font-weight: 700;
    }
    .menu-item {
      display: table; //垂直居中
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
        width: 56px;
        vertical-align: middle;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        font-size: 12px;
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