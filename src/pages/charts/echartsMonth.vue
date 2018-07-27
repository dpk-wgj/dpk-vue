<template>
    <section class="chart">
        <el-row>
            <el-col :span="12">
                <div id="chartColumn" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartBar" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartLine" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartPie" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="24">
                <a href="http://echarts.baidu.com/examples.html" target="_blank" style="float: right;">more>></a>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'

    import getOrderByYear from '../../api/api';
    import axios from 'axios';

    export default{
        data (){
            param_num:[]
            year_num:[]/**这应该是接收返回值的数组 */
            //初始化给后台传递的参数数组
            return {
                chartColumn:null,
                chartBar:null,

            }
        },
        mounted:function(){
            /**
             * 传递年份
             */
            let param ={
                param_num:[2016,2017,2018,2019,2020]
            }
            axios.post(`/admin/count/getOrderByYear`, param).then((res)=>{
                this.year_num=res.data.result;
                var _this=this;
                //基于准备好的dom，初始化echarts实例

                this.chartBar = echarts.init(document.getElementById('chartBar'));
                /**
                 * 传递月份
                 */
                let param_month ={
                    param_month:[1,2,3,4,5,6,7,8,9,10,11,12],
                    //param_myear:
                }
                this.chartBar.setOption({
                    title: {
                        text: 'Bar Chart',
                        subtext: '数据来自网络'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['2018年','2019年','2020年']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: ['1月', '2月','3月', '4月','5月', '6月','7月', '8月','9月', '10月','11月', '12月']
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    },
                    series: [
                        {
                            name: '2011年',
                            type: 'bar',
                            data: [18203, 23489, 29034, 104970, 131744, 630230]
                        },
                        {
                            name: '2012年',
                            type: 'bar',
                            data: [19325, 23438, 31000, 121594, 134141, 681807]
                        }
                    ]
                });

            });

        }

    }
</script>

<style scoped>
    .chart {
        width: 100%;
        float: left;
    }


    .el-col {
        padding: 30px 20px;
    }
</style>