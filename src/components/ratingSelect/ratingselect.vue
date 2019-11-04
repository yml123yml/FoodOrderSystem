<template>
    <div class="ratingselect">
        <div class="rating-type">
            <span @click="select(2,$event)" class="block positive" :class="{'active':sType===2}">
                {{ desc.all }}
                <!-- <span class="count">{{ratings.length}}</span> -->
            </span>
            <span @click="select(0,$event)" class="block positive" :class="{'active':sType===0}">
                {{ desc.positive }}
                <!-- <span class="count">{{positives.length}}</span> -->
            </span>
            <span @click="select(1,$event)" class="block negative" :class="{'active':sType===1}">
                {{ desc.negative }}
                <!-- <span class="count">{{negatives.length}}</span> -->
            </span>
        </div>
        <div @click="toggleContent($event)" class="switch" :class="{'on':oContent}">
            <!-- 图案更改： 圆圈对号 -->
            <i class="iconfont icon-duihao2"></i>
            <span class="text">只看内容的评价</span>
        </div>

    </div>
  
</template>

<script>
//定义三个常量
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;


export default {
    //在props中接收到父组件传过来的selectType和onlyContent的值之后，在data中重新定义变量接收，以便观测值的变化（因为子组件将改变data中的值，子组件要将这些变化的值传递个父组件）
    data() {
            return {
                    sType: this.selectType,
                    oContent: this.onlyContent
                };
    },
    props: {
         //需要一些评价数据才能完成评价组件

        ratings: {
            type:Array,
            default() {
                return [];
            }
        },
        selectType: {  //类型
            type: Number,
            default: ALL//默认情况时ALL,值等于2
        },
        onlyContent: {//只看有内容的评价还是所有的评价
            type: Boolean,
            default: false//设置为可以看到所有的评价
        },
        desc: {  //描述用对象
            type: Object,
            default() {//默认desc是这三种，在商品详情页的时候传入推荐或者吐槽
                return {
                    all: '全部',
                    positive: '满意',
                    negative: '不满意'
                }
            }

        }

    },
    //vue计算属性
    computed: {
        positives() {  ///对应所有正向评价的数组
            return this.ratings.filter((rating) => {
                return rating.rateType === POSITIVE;

            });
        },
        negatives() {
              return this.ratings.filter((rating) => {
                return rating.rateType === NEGATIVE;
            });
        }
    },
    methods: {
        select(type, event) {
            if(!event._constructed){
                return;
            }
            //将this.selectType设置成传入的参数,而不是food传过来的初始化的值，之后样式就可以随着点击改变了
            this.sType = type;
            this.$emit('increment','selectType', this.sType);  //子父组件通信：food父组件可以监听此事件，以便其改变 selectType；
        },
        toggleContent(event) {  //toggle切换
             if(!event._constructed){
                return;
            }
            this.oContent = !this.oContent;
            this.$emit('increment','onlyContent', this.oContent);

            
        }
    }

}
</script>

<style lang="scss" scoped>
.ratingselect {
    padding-top: 0px;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(7, 17, 27,0.1);
    .rating-type {
        padding: 18px 0;
        margin: 0 18px;
        font-size: 0px;
        border-bottom: 1px solid rgba(7, 17, 27,0.1);
        .block {
            display: inline-block;
            padding: 8px 12px;
            margin-right: 8px;
            line-height: 16px;
            border-radius: 1px;
            font-size: 12px;
            color: rgb(77, 85, 93);
            &.active {
                color: #fff;
            }
            .count{
                margin-left: 2px;
                font-size: 8px;
            }
            &.positive {
                background: rgba(0, 160, 220, 0.2);
                &.active {
                    background:  rgb(0, 160, 220);
                }
            } 
             &.negative {
                background: rgba(77, 85, 93, 0.2);
                 &.active {
                    background:  rgb(77, 85, 93);
                }
            }


        }
       
    }
    .switch {
        padding: 12px 18px;
        line-height: 24px;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        color: rgb(147, 153, 159);
        font-size: 0px;
        &.on{
             .icon-duihao2{
                 color: #00c850;
             }
         }
        .icon-duihao2{
            display: inline-block;
            vertical-align: top;
            margin-right: 4px;
            font-size: 24px;
        }
        .text{
            display: inline-block;
            vertical-align: top;
            font-size: 12px;

        }
    }
}

</style>





</style>