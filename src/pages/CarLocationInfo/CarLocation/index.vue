<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true">
            <el-form-item>
                <el-input placeholder="车辆牌照" v-model="carNumber"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="locateCar">查询</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    
    <el-col :span="24" class="toolbar">
        <div class="amap-page-container">
            <el-amap vid="amapDemo" :zoom="zoom" :center="center" :map-manager="AMapManager" :events="events" class="amap-demo" :plugin="plugin">
                
                <!-- <el-amap-marker :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable"></el-amap-marker> -->
                <!-- <el-amap-circle :center="circle.center" :radius="circle.radius" :fillOpacity="circle.fillOpacity" :events="circle.events" :strokeColor="circle.strokeColor" :strokeStyle="circle.strokeStyle" :fillColor="circle.fillColor"></el-amap-circle> -->
                <el-amap-marker :key="index" v-for="(carMarker, index) in carMarkers" :position="carMarker.position" 
                :events="carMarker.events" :visible="carMarker.visible" :icon="carMarker.icon" :draggable="carMarker.draggable" :vid="index"></el-amap-marker>
                <el-amap-info-window v-for="(carMarker, index) in carMarkers" 
                :position="carMarker.mywindow.position" :content="carMarker.mywindow.content" 
                :visible="carMarker.mywindow.visible" :events="carMarker.mywindow.events" :vid="index"></el-amap-info-window>
            </el-amap>
        </div>
    </el-col>
  </section>
</template>


<script>
import { AMapManager } from 'vue-amap';
import {getAllCarLocation, getCarInfoByCarNumber} from '../../../api/api';

export default {

    data () {
        return {
            carNumber: "",
            zoom: 15,
            center: [121.5273285, 31.21515044],
            carLocList: [],
        //   circle: {
        //     clickable: true,
        //     center: [121.5273225, 31.21515024],
        //     radius: 200,
        //     fillOpacity: 0.3,
        //     strokeStyle: 'dashed',
        //     fillColor: '#FFFF00',
        //     strokeColor: '#00BFFF'
        //   },
            carMarkers: [
                // position: [121.5273285, 31.21515044],
                // events: {
                //     click: () => {
                //         alert('click marker');
                //     },
                //     dragend: (e) => {
                //         console.log('---event---: dragend')
                //         this.markers[0].position = [e.lnglat.lng, e.lnglat.lat];
                //     }
                // },
                // visible: true,
                // draggable: false,
                // template: '<span>1</span>',
                // icon: '/static/mapCar.png'
            ],
            mywindows: [
            ],
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
    methods: {
        addMarker(item) {
            let location = item.driverInfo.driverLocation.split(", ")
            location[0] = parseFloat(location[0])
            location[1] = parseFloat(location[1])
            let carMarker = {
                position: location,
                icon: '/static/mapCar.png',
                events: {
                    click: () => {
                        for(let carMarker of this.carMarkers){carMarker.mywindow.visible = false}
                        carMarker.mywindow.visible = true
                    
                        console.log(carMarker.mywindow.visible, "hhahahah")
                    }
                },
                mywindow: {
                    position: location,
                    content: `<h4>车辆牌照:${item.carInfo.carNumber}</h4>`,
                    visible: false,
                    events: {
                        // close () {
                        //     this.mywindow.visible = false
                        // }
                    }
                }
            };
            this.carMarkers.push(carMarker);
        },
        locateCar () {
            let param = {
                carNumber: this.carNumber
            }
            getCarInfoByCarNumber(param).then(res => {
                if(res.status === 1){
                    console.log(res.result)
                    
                    
                    for(let item of this.carLocList){
                        if(item.carInfo.carId === res.result.carInfo.carId){
                            let location = item.driverInfo.driverLocation.split(", ")
                            location[0] = parseFloat(location[0])
                            location[1] = parseFloat(location[1])
                            this.center = location
                        }
                    }
                }else{
                    this.$notify({
                        title: '失败',
                        message: `未查询到车牌号 [${this.carNumber}] 信息`,
                        type: 'error'
                    });
                }
            })
        }
    },
    mounted() {
        
        getAllCarLocation().then(res => {
            if(res.status === 1){
                this.carLocList = res.result
                for(let item of res.result){
                    // let location = res.result[i].driverLocation.split(", ")
                    // location[0] = parseFloat(location[0])
                    // location[1] = parseFloat(location[1])
                    this.addMarker(item)
                }
                
        // let _this = this
        // this.events = { 
        //     init(map) {
        //         console.log("!!!",map.getCenter())
        //         AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
        //             const marker = new SimpleMarker({
        //                 iconLabel: 'A',
        //                 iconStyle: 'red',
        //                 map: map,
        //                 position: location,
        //             });
        //         });

        //     }
        // }
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

