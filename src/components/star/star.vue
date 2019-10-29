<template>
  <div class="star" :class="starType">
      <span v-for="itemClass in itemClasses" :key="itemClass.id" :class="itemClass" class="star-item"></span>
  </div>
</template>

<script>
const LENGTH = 5;
const CLS_ON = 'on';
const CLS_HALF = 'half';
const CLS_OFF = 'off';

export default {
    props: {
        size: {
            type: Number
        },
        score: {
            type: Number
        }
    },
    computed: {
        //计算属性
        starType() {
            return 'star-' + this.size;
        },
        itemClasses() {
            let result = [];
            let score = Math.floor(this.score*2)/2;//计算星的评分
            let hasDecimal = score % 1 !== 0;//小数---半星
            let integer = Math.floor(score);//整数---全星
            for(let i=0;i<integer;i++) {
                result.push(CLS_ON);//放全星
            }
            if(hasDecimal) {
                result.push(CLS_HALF);//放半星
            }
            while(result.length < LENGTH) {
                result.push(CLS_OFF);//没星
            }
            return result;
        }
    }
}
</script>

<style lang="scss" scoped>
    .star {
        font-size: 0;
        .star-item {
            display: inline-block;
            background-repeat: no-repeat;
        }
        &.star-48 {
            .star-item {
                width: 20px;
                height: 20px;
                margin-right: 22px;
                background-size: 20px 20px;
                &:last-child {
                    margin-right: 0;
                }
                &.on {
                    //全星
                    background: url('./img/star48_on@2x.png');
                    background-size: 20px 20px;
                }
                &.half {
                    //半星
                    background: url('./img/star48_half@2x.png');
                    background-size: 20px 20px;
                }
                &.off {
                    //无星
                    background: url('./img/star48_off@2x.png');
                    background-size: 20px 20px;
                }
            }
        }
        &.star-36 {
            .star-item {
                width: 15px;
                height: 15px;
                margin-right: 16px;
                background-size: 15px 15px;
                &:last-child {
                    margin-right: 0;
                }
                &.on {
                    //全星
                    background: url('./img/star36_on@2x.png');
                    background-size: 15px 15px;
                }
                &.half {
                    //半星
                    background: url('./img/star36_half@2x.png');
                    background-size: 15px 15px;
                }
                &.off {
                    //无星
                    background: url('./img/star36_off@2x.png');
                    background-size: 15px 15px;
                }
            }
        }
        &.star-24 {
            .star-item {
                width: 10px;
                height: 10px;
                margin-right: 3px;
                background-size: 10px 10px;
                &:last-child {
                    margin-right: 0;
                }
                &.on {
                    //全星
                    background: url('./img/star24_on@2x.png');
                    background-size: 10px 10px;
                }
                &.half {
                    //半星
                    background: url('./img/star24_half@2x.png');
                    background-size: 10px 10px;
                }
                &.off {
                    //无星
                    background: url('./img/star24_off@2x.png');
                    background-size: 10px 10px;
                }
            }
        }
        
    }
</style>