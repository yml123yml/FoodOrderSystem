import VueRouter from 'vue-router';

//导入路由所需组件
import goodsContainer from './src/components/goods/goods.vue'
import sellerContainer from './src/components/seller/seller.vue';
import ratingsContainer from './src/components/ratings/ratings.vue';



//创建路由对象
var router = new VueRouter({
    routes:[
        //配置路由路径
        {path:'/',redirect:'/goods'},//路由重定向
        {path:'/goods',component:goodsContainer},
        {path:'/seller',component:sellerContainer},
        {path:'/ratings',component:ratingsContainer}
    ],
    linkActiveClass:'nav-active'
});

export default router;