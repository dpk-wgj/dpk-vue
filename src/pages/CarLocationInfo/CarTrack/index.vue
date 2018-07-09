<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true">
            
            <el-form-item label="活动时间">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期"  style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-time-picker type="fixed-time" placeholder="选择时间"  style="width: 100%;"></el-time-picker>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="车辆牌照"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="traceCar">查询</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    
    <el-col :span="24" class="toolbar">
        <div class="amap-page-container">
        <el-amap vid="amapDemo" :zoom="zoom" :center="center" :map-manager="AMapManager" :events="events" class="amap-demo" :plugin="plugin">

        </el-amap>
        </div>
    </el-col>
  </section>
</template>


<script>
    import { AMapManager } from 'vue-amap';

export default {

    data () {
        return {
            zoom: 15,
            center: [121.5273285, 31.21515044],
            plugin: {
                pName: 'Scale',
                events: {
                    init (instance) {
                    console.log(instance)
                    }
                }
            },
            AMapManager,
            traceArr: [1,2,3],
            events: {
                
            }
        }
    },
    methods: {
        /*
            后台返回经纬度和日期数组
         */
        traceCar () {
            console.log("用户点击了")
            let trackArr = [
                [106.405289, 39.904987],
                [103.964458, 40.54664],
                [101.47836, 41.135964],
                [108.949297, 41.670904],
                [106.380111, 42.149509],
                [103.774185, 42.56996],
                [101.135432, 42.930601],
                [78.46826, 43.229964],
                [65.777529, 43.466798],
                [43.068486, 43.64009],
                [90.34669, 43.749086],
                [87.61792, 43.793308]
            ]
            
        
            AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function(PathSimplifier, $) {

                if (!PathSimplifier.supportCanvas) {
                    alert('当前环境不支持 Canvas！');
                    return;
                }

                var pathSimplifierIns = new PathSimplifier({
                    zIndex: 100,
                    //autoSetFitView:false,
                    map: window.amap, //所属的地图实例

                    getPath: function(pathData, pathIndex) {

                        return pathData.path;
                    },
                    getHoverTitle: function(pathData, pathIndex, pointIndex) {

                        if (pointIndex >= 0) {
                            //point 
                            return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length;
                        }

                        return pathData.name + '，点数量' + pathData.path.length;
                    },
                    renderOptions: {

                        renderAllPointsIfNumberBelow: 100 //绘制路线节点，如不需要可设置为-1
                    }
                });

                window.pathSimplifierIns = pathSimplifierIns;

                //设置数据
                pathSimplifierIns.setData([{
                    name: '路线0',
                    path: trackArr
                }]);

                //对第一条线路（即索引 0）创建一个巡航器
                var navg1 = pathSimplifierIns.createPathNavigator(0, {
                    loop: true, //循环播放
                    speed: 1000000, //巡航速度，单位千米/小时
                    pathNavigatorStyle: {
                        width: 16,
                        height: 32,
                        content: PathSimplifier.Render.Canvas.getImageContent('/static/mapCar.png', onload, onerror),
                        strokeStyle: null,
                        fillStyle: null
                    }
                });

                navg1.start();
            });

        }
    },
    beforeMount () {
        console.log(this.traceArr)
        
    },
    mounted() {
        this.traceArr = [
            [116.405289, 39.904987],
            [113.964458, 40.54664],
            [111.47836, 41.135964],
            [108.949297, 41.670904],
            [106.380111, 42.149509],
            [103.774185, 42.56996],
            [101.135432, 42.930601],
            [98.46826, 43.229964],
            [95.777529, 43.466798],
            [93.068486, 43.64009],
            [90.34669, 43.749086],
            [87.61792, 43.793308]
        ]
        let _this = this
        this.events = { 
            init(map) {
                window.amap = map
            }
        }
    },
}
</script>
<style>
  .amap-page-container {
    height: 600px;
  }
</style>

