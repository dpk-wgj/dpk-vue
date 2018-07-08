<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true">
            <el-form-item>
                <el-input placeholder="车辆牌照"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">查询</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    
    <el-col :span="24" class="toolbar">
        <div class="amap-page-container">
        <el-amap vid="amapDemo" :zoom="zoom" :center="center" :map-manager="AMapManager" :events="events" class="amap-demo" :plugin="plugin">
            <!-- <el-amap-info-window  :position="mywindow.position" :content="mywindow.content" :visible="mywindow.visible" :events="mywindow.events"></el-amap-info-window> -->
            <!-- <el-amap-marker :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable"></el-amap-marker> -->
            <!-- <el-amap-circle :center="circle.center" :radius="circle.radius" :fillOpacity="circle.fillOpacity" :events="circle.events" :strokeColor="circle.strokeColor" :strokeStyle="circle.strokeStyle" :fillColor="circle.fillColor"></el-amap-circle> -->

        </el-amap>
        </div>
    </el-col>
  </section>
</template>


<script>
    import { AMapManager } from 'vue-amap';
	import {getAllCarLocation} from '../../../api/api';

export default {

  data () {
        return {
            zoom: 15,
            center: [121.5273285, 31.21515044],
        //   circle: {
        //     clickable: true,
        //     center: [121.5273225, 31.21515024],
        //     radius: 200,
        //     fillOpacity: 0.3,
        //     strokeStyle: 'dashed',
        //     fillColor: '#FFFF00',
        //     strokeColor: '#00BFFF'
        //   },
        //   marker: {
        //     position: [121.5273585, 31.21511044],
        //     events: {
        //       click: () => {
        //         if (this.mywindow.visible === true) {
        //           this.mywindow.visible = false
        //         } else {
        //           this.mywindow.visible = true
        //         }
        //       },
        //       dragend: (e) => {
        //         this.markers[0].position = [e.lnglat.lng, e.lnglat.lat]
        //       }
        //     },
        //     visible: true,
        //     draggable: false
        //   },
        //   mywindow: {
        //     position: [121.5273285, 31.21515044],
        //     content: '<h4>该点数据信息</h4><div class="text item">Information A: ...</div><div class="text item">Information B: ...</div>',
        //     visible: true,
        //     events: {
        //       close () {
        //         this.mywindow.visible = false
        //       }
        //     }
        //   },
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
    beforeMount() {
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
        
        getAllCarLocation().then(res => {
            if(res.status === 1){
                let location = res.result[0].driverLocation.split(", ")
                location[0] = parseFloat(location[0])
                location[1] = parseFloat(location[1])

                console.log("dsdsadsd",location)

        let _this = this
        this.events = { 
            init(map) {
                console.log("!!!",map.getCenter())
                AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
                    const marker = new SimpleMarker({
                        iconLabel: 'A',
                        iconStyle: 'red',
                        map: map,
                        position: location,
                    });
                });

            }
        }
            }
        })
    }
    
}
</script>
<style>
  .amap-page-container {
    height: 600px;
  }
</style>

