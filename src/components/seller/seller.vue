<template>
  <div class="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{ seller.name }}</h1>
        <div class="desc">
          <star :size="36" :score="seller.score"></star>
          <span class="text">{{ seller.ratingCount }}</span>
          <span class="text">月售{{ seller.sellCount }}单</span>
        </div>
        <div class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{ seller.minPrice }}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{ seller.deliverPrice }}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{ seller.deliveryTime }}</span>分钟
            </div>
          </li>
        </div>
      </div>
      <!-- <split></split> -->
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper">
          <p class="content">{{ seller.bulletin }}</p>
        </div>
      </div>
      <ul v-if="seller.supports" class="supports">
        <li class="support-item" v-for="(item,index) in seller.supports" :key="item.id">
          <span class="icon"></span>
          <span class="text">{{ seller.supports[index].description }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import star from '../star/star.vue';
// import split from '../split/split.vue';
export default {
  components: {
        star,
        // split
    },
  props: {
    seller: {
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
  .seller {
    position: absolute;
    top: 174px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    .overview {
      padding: 18px;
      .title {
        margin-bottom: 8px;
        line-height: 14px;
        color: rgb(7, 17, 27);
        font-size: 14px;
      }
      .desc {
        padding-bottom: 18px;
        font-size: 0;
        .star {
          display: inline-block;
          margin-left: 8px;
          vertical-align: top;
        }
        .text {
          display: inline-block;
          margin-right: 12px;
          line-height: 18px;
          vertical-align: top;
          font-size: 10px;
          color: rgb(77,85,93);
        }
      }
      .remark {
        display: flex;
        padding-top: 18px;
        .block {
          flex: 1;
          text-align: center;
          border-right: 1px solid rgba(7,17,27,0.1);
          &:last-child {//给最后一个的边框设为无
            border: none;
          }
          h2 {
            margin-bottom: 4px;
            line-height: 10px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
          .content {
            line-height: 24px;
            font-size: 10px;
            color: rgb(7, 17, 27);
          }
        }
      }
    }
    .bulletin {
      padding: 18px 18px 0 18px;
      .title {
        margin-bottom: 8px;
        line-height: 14px;
        color: rgb(7, 17, 27);
        font-size: 14px;
      }
      .content-wrapper {
        padding: 0 12px 16px 12px;
        .content {
          line-height: 24px;
          font-size: 12px;
          color: rgb(240,20,20);
        }
      }
      .supports {
        .support-item {
          padding: 16px 12px;
          font-size: 0;
          .icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            vertical-align: top;
            margin-right: 6px;
            background: url("../header/img/decrease_1@2x.png");
            background-size: 16px 16px;
            background-repeat: no-repeat;
          }
          .text {
            font-size: 12px;
            line-height: 16px;
            color: rbg(7, 17, 27);
          }
        }
      }
    }
  }
</style>