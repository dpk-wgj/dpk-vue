<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item label="投诉发起时间">
					<el-col :span="11">
						<el-date-picker type="date" placeholder="选择日期" v-model="trackDate.startYmd" style="width: 100%;" ></el-date-picker>
					</el-col>
					<el-col class="line" :span="2">&nbsp;&nbsp;&nbsp;&nbsp;-</el-col>
					<el-col :span="11">
						<el-time-picker type="fixed-time" placeholder="选择时间" v-model="trackDate.startHms" style="width: 100%;"></el-time-picker>
					</el-col>
				</el-form-item>
				<!--<el-form-item label="结束时间">-->
					<!--<el-col :span="11">-->
						<!--<el-date-picker type="date" placeholder="选择日期"  v-model="trackDate.endYmd" style="width: 100%;"></el-date-picker>-->
					<!--</el-col>-->
					<!--<el-col class="line" :span="2">&nbsp;&nbsp;&nbsp;&nbsp;-</el-col>-->
					<!--<el-col :span="11">-->
						<!--<el-time-picker type="fixed-time" placeholder="选择时间"  v-model="trackDate.endHms" style="width: 100%;"></el-time-picker>-->
					<!--</el-col>-->
				<!--</el-form-item>-->
				<!--<br>-->
				<el-form-item>
					<el-input v-model="filters.complaintStatus" placeholder="投诉状态"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.passengerId" type="number" placeholder="投诉人编号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getComplaintInfoList">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="complaintlist" highlight-current-row v-loading="listLoading" style="width: 100%;" stripe
					  border>
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="complaintStatus" label="投诉状态"  sortable  align="center">
				</el-table-column>
				<el-table-column prop="complaintId" label="投诉编号" sortable  align="center">
				</el-table-column>
				<el-table-column prop="complaintContent" label="投诉内容"   align="center">
				</el-table-column>
				<el-table-column prop="passengerId" label="投诉人编号"  sortable  align="center">
				</el-table-column>
				<el-table-column prop="orderId" label="订单编号"  sortable  align="center">
				</el-table-column>
				<el-table-column prop="complaintCreateTime" label="投诉发起时间" align="center" :formatter="formatTime"sortable width="200px">
				</el-table-column>
				<el-table-column prop="complaintFeedbackTime" label="投诉反馈时间"   align="center"  width="200px" sortable>
				</el-table-column>
				<el-table-column prop="complaintFeedback" label="投诉反馈内容"   align="center">
				</el-table-column>
				<el-table-column inline-template :context="_self" label="操作"  align="center">
					<span>
						<el-button size="small" @click="handleEdit(row)">受理</el-button>
						 <el-button type="danger" size="small" @click="handleDel(row)">反馈</el-button>
					</span>
				</el-table-column>
			</el-table>
		</template>

		<!--分页-->
		<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
			<el-pagination layout="total,prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<!--<el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">-->
			<!--<el-form :model="editForm" label-width="80px" ref="editForm">-->
				<!--<el-form-item label="日志编号">-->
					<!--<el-input v-model="editForm.logId" auto-complete="off" disabled ></el-input>-->
				<!--</el-form-item>-->
				<!--<el-form-item label="订单编号">-->
					<!--<el-input v-model="editForm.orderId" auto-complete="off" disabled></el-input>-->
				<!--</el-form-item>-->
				<!--<el-form-item label="用户行为">-->
					<!--<el-input v-model="editForm.action" auto-complete="off" disabled></el-input>-->
				<!--</el-form-item>-->
				<!--<el-form-item label="用户角色">-->
					<!--<el-input v-model="editForm.roleId" auto-complete="off" disabled></el-input>-->
				<!--</el-form-item>-->
				<!--<el-form-item label="行为时间">-->
					<!--<el-input v-model="editForm.logTime" auto-complete="off" disabled></el-input>-->
				<!--</el-form-item>-->
			<!--</el-form>-->
			<!--<div slot="footer" class="dialog-footer">-->
				<!--<el-button @click.native="editFormVisible = false">关 闭</el-button>-->
			<!--</div>-->
		<!--</el-dialog>-->
	</section>
</template>

<script>
    // import util from '../../common/util'
    import NProgress from 'nprogress'
    import {findComplaintInfoByMultiCondition} from "../../../api/api";
    // import { formatDate } from '../../common/util'

    export default {
        data() {
            return {
                filters: {
                    complaintStatus:'',
                    passengerId:'',
                    complaintCreateTime:'',
                },
                trackDate: {
                    startYmd: null,
                    startHms: null,
                    // endYmd: null,
                    // endHms: null
                },
                complaintlist: [],
                total: 0,
                page: 1,
                listLoading: false,
                // editFormVisible: false,//查看详情界面显是否显示
                // editFormTtile: '查看详情',//查看详情界面标题
                //查看详情界面数据
                // editForm: {
                //     logId: '',
                //     action: '',
                //     roleId: '',
                //     logTime: '',
                //     orderId: '',
                // },
                // editLoading: false,
                // btnEditText: '提 交',
                // editFormRules: {
                //     name: [
                //         { required: true, message: '请输入姓名', trigger: 'blur' }
                //     ]
                // }

            }
        },
        methods: {

            formatTime: function(row, column) {
                var d = new Date(row.complaintCreateTime);
                var times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                return times;

            },

            formatDate (date, flag) {
                if (date != null){
                    if(flag===0){//格式化年月日
                        let y = date.getFullYear();
                        let m = date.getMonth() + 1;
                        let d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                        return `${y}-${m}-${d}`
                    }else{//格式化时分秒
                        let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
                        let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                        let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                        return `${h}:${m}:${s}`
                    }
                }
                return null;
            },

            handleCurrentChange(val) {
                console.log("page", val)
                this.page = val;
                console.log("page", this.page)
                this.getComplaintInfoList();
            },
            //获取投诉列表
            getComplaintInfoList() {
                // let start =  this.formatDate(this.trackDate.startYmd, 0)+" "+this.formatDate(this.trackDate.startHms, 1)
                // if(start == 'null null'){
                //     start = ''
                // }
                let para = {
                    sort: "complaint_status",
                    order: "asc",
                    offset: (this.page - 1) * 10,
                    limit: 10,
                    // startTime: start,
                    complaintInfo: {
                        complaintStatus: this.filters.complaintStatus,
                        passengerId:this.filters.passengerId,
                    },
                };
                this.listLoading = true;
                NProgress.start();
                findComplaintInfoByMultiCondition(para).then((res) => {
                    this.total = res.result.count;
                    this.complaintlist = res.result.complaintInfos;
                    this.listLoading = false;
                    NProgress.done();
                });
            },


            // //显示编辑界面
            // handleEdit: function (row) {
            //
            //     console.log("row",row.logId)
            //     var param = new FormData()
            //     param.append('logInfoId', row.logId)
            //     getLogInfoByLogId(param).then((res) => {
            //         if(res.status === 1){
            //             console.log(res.result)
            //             this.editFormVisible = true;
            //             this.editFormTtile = '查看详情';
            //             this.editForm.logId = row.logId;
            //             this.editForm.action = row.action;
            //             if(row.roleId==1){
            //                 this.editForm.roleId = '司机';
            //             } else {
            //                 this.editForm.roleId = '乘客';
            //             }
            //             var d = new Date(row.logTime);
            //             var times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
            //             this.editForm.logTime = times;
            //             this.editForm.orderId = row.orderId;
            //         }
            //     });
            // },
            //编辑 or 新增
            // editSubmit: function (row) {
                // var _this = this;

                // _this.$refs.editForm.validate((valid) => {
                // 	if (valid) {

                // 		_this.$confirm('确认提交吗？', '提示', {}).then(() => {
                // 			_this.editLoading = true;
                // 			NProgress.start();
                // 			_this.btnEditText = '提交中';

                // if (_this.editForm.id == 0) {
                // 	//新增
                // 	let para = {
                // 		name: _this.editForm.name,
                // 		sex: _this.editForm.sex,
                // 		age: _this.editForm.age,
                // 		birth: _this.editForm.birth == '' ? '' : util.formatDate.format(new Date(_this.editForm.birth), 'yyyy-MM-dd'),
                // 		addr: _this.editForm.addr,
                // 	};
                // 	addUser(para).then((res) => {
                // 		_this.editLoading = false;
                // 		NProgress.done();
                // 		_this.btnEditText = '提 交';
                // 		_this.$notify({
                // 			title: '成功',
                // 			message: '提交成功',
                // 			type: 'success'
                // 		});
                // 		_this.editFormVisible = false;
                // 		_this.getLogInfoList();
                // 	});
                // } else {
                //编辑
                // 				let para = {
                // 					id: _this.editForm.id,
                // 					name: _this.editForm.name,
                // 					sex: _this.editForm.sex,
                // 					age: _this.editForm.age,
                // 					birth: _this.editForm.birth == '' ? '' : util.formatDate.format(new Date(_this.editForm.birth), 'yyyy-MM-dd'),
                // 					addr: _this.editForm.addr,
                // 				};
                // 				editUser(para).then((res) => {
                // 					_this.editLoading = false;
                // 					NProgress.done();
                // 					_this.btnEditText = '提 交';
                // 					_this.$notify({
                // 						title: '成功',
                // 						message: '提交成功',
                // 						type: 'success'
                // 					});
                // 					_this.editFormVisible = false;
                // 					_this.getLogInfoList();
                // 				});

                // 			// }

                // 		});

                // 	}
                // });
        //         let param = {
        //             carNumber: this.carNumber
        //         }
        //         getLogInfoByLogId(para).then((res) => {
        //             if(res.status === 1){
        //                 console.log(res.result)
        //             }
        //         });
        //     },
        },
        mounted() {
            this.getComplaintInfoList();
        }
    }
</script>

<style scoped>
</style>