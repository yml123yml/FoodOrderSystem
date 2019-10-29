<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link class="nav-link" to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link class="nav-link" to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link class="nav-link" to="/seller">商家</router-link>
      </div>
    </div>
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
import header from './components/header/header.vue';
import seller from './components/seller/seller.vue';
const ERR_OK = 0;
export default {
  data() {
    return {
      seller: {}
    }
  },
  created() {
    this.getSellerInfo();
  },
  methods: {
    getSellerInfo() {
      this.$http.get('/api/seller').then((response) =>{
        response = response.body;
        if(response.errno === ERR_OK) {
          this.seller = response.data;
          console.log(this.seller);
        }
      });
    }
  },
  components: {
    'v-header':header
  }
}
</script>

<style lang="scss" scoped>
  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-bottom: 2px solid rgba(7,17,27,0.1);
    .tab-item {
      flex:1;
      text-align: center;
      .nav-link {
        display: block;
        font-size: 14px;
        color:#4d555d;
        
      }
      .nav-active {
          color:#f01414;
      }
    }
  }
</style>

