<template>
	<section>

		<el-col :span="30" class="toolbar" style="float:left">
			<el-form :inline="true" :model="filters">
				<el-form-item>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.driverName" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>

				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.driverPhoneNumber" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>

				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.driverLevelStar" placeholder="信誉积分"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getDriver">查询</el-button>
				</el-form-item>
				<el-form-item >
				<el-upload
						class="upload-demo"
                        multiple="false"
						action="http://localhost:8000/admin/driver/importExcel"
						:on-preview="handlePreview"
						:on-remove="handleRemove"
                        :on-change="handleChange"
						:before-upload="beforeUpload"
                        :auto-upload="false"
						:limit="1"
                        :multiple="false"
						:file-list="fileList">
					<el-button  slot="trigger" size="small" type="primary">选择文件</el-button>
                    <el-button  style="margin-left: 10px" size="small" type="success" @click ="submitUpload()">导入信息</el-button>
					<span slot="tip" class="el-upload__tip">只能导入Excel文件</span>
				</el-upload>

				</el-form-item>

                <el-form-item  style="float:right">
                    <el-button type="primary" v-on:click="getExcel">导出信息表</el-button>
                </el-form-item>
			</el-form>
		</el-col>


		<!--列表-->
		<el-table :data="driverInfo"
				  style="width: 100% ;margin: 10px 0 10px 0"
				  stripe
				  border
				  v-loading="listLoading">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="driverInfo.driverStatus" label="状态" align="center"  sortable  >
				<template slot-scope="scope" >
					<div style="text-algin:center;margin:auto">
						<i v-if="scope.row.driverInfo.driverStatus==0"  style="color:#F56C6C;">休息</i>
						<i v-else-if="scope.row.driverInfo.driverStatus==1"  style="color:#67C23A;"> 上岗</i>


					</div>
				</template>
			</el-table-column>
			<el-table-column prop="driverInfo.driverName" label="姓名" align="center"    >
			</el-table-column>
			<el-table-column prop="driverInfo.driverWxId" label="微信号" align="center"  width="150" >
			</el-table-column>
			<el-table-column prop="driverInfo.driverPhoneNumber" label="手机号"  align="center"   >
			</el-table-column>
			<el-table-column prop="driverInfo.driverIdentity" label="身份证"  align="center"   >
			</el-table-column>
			<el-table-column prop="driverInfo.driverLicence" label="驾驶证"  align="center"   >
			</el-table-column>
			<el-table-column prop="driverInfo.driverLevelStar" label="信誉积分"  align="center"  sortable  >
			</el-table-column>
			<el-table-column  label="车辆信息"  align="center"   >
				<el-table-column prop="carInfo.carNumber" label="车牌号码"  align="center"   >
				</el-table-column>
				<el-table-column prop="carInfo.carType" label="车辆类型"  align="center"  sortable >
				</el-table-column>
				<el-table-column prop="carInfo.carSeat" label="车座位数"  align="center"  sortable >
				</el-table-column>
			</el-table-column>

			<el-table-column inline-template :context="_self" label="操作"  width="180px" align="center">
	        <span>
					<el-button size="small" @click="handleEdit(row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>
				</span>
			</el-table-column>

		</el-table>

			<!--分页-->
		<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="driverName">
					<el-input v-model="editForm.driverName" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="微信号"  prop="driverWxId">
					<el-input v-model="editForm.driverWxId"  size="medium"></el-input>
				</el-form-item>
				<el-form-item label="手机号"  prop="driverPhoneNumber">
					<el-input  v-model="editForm.driverPhoneNumber" ></el-input>
				</el-form-item>
				<el-form-item label="身份证"  prop="driverIdentity">
					<el-input  v-model="editForm.driverIdentity"></el-input>
				</el-form-item>
				<el-form-item label="驾驶证"  prop="driverLicence">
					<el-input  v-model="editForm.driverLicence"></el-input>
				</el-form-item>
				<el-form-item label="信誉积分"  prop="driverLevelStar">
				<el-input v-model="editForm.driverLevelStar"></el-input>
			</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取 消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
    import NProgress from 'nprogress'
    import { getDriverInfoByMultiCondition,updateDriverInfoByDriverId,deleteDriverInfoByDriverId ,importExcel,makeExcel} from '../../api/api';

    export default {
        data() {
            return {
                fileList: [],
                filters: {
                    driverName:"",
                    driverPhoneNumber:"",
                    driverLevelStar:""
                },
                driverInfo: [],
                total: 0,
                page: 1,
                loading:false,
                listLoading: false,
                editFormVisible: false,//编辑界面显是否显示
                editFormTtile: '编辑',//编辑界面标题
                //编辑界面数据
                editForm: {
                    id: 0,
                    driverName:"",
                    driverWxId:"",
                    driverPhoneNumber:"",
                    driverIdentity:"",
                    driverLicence:"",
                    driverLevelStar:"",
                },
                editLoading: false,
                btnEditText: '提 交',
                editFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                }

            }
        },
        methods: {

            submitUpload: function () {
                console.log("dsdsdasdasd")
                this.$refs.upload.submit();
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleChange(file, fileList) {
                console.log(file);
                console.log(fileList);
            },
            beforeUpload: function (file) {
                console.log(file)
                //这里是重点，将文件转化为formdata数据上传
                let fd = new FormData()
                fd.append('file', file)
                console.log("dsdsdasdasd")
                importExcel(fd).then((res) => {
                    console.log(res)

                }, (res) => {
                    console.log(res)
                });
                return false;
            },

            handleCurrentChange(val) {
                this.page = val;
                this.getDriver();
            },
            getDriver: function () {
                let param = {
                    sort: "driver_id",
                    order: "asc",
                    offset: (this.page - 1) * 10,
                    limit: 10,
                    driverInfo: {
                        driverName: this.filters.driverName,
                        driverPhoneNumber: this.filters.driverPhoneNumber,
                        driverLevelStar: this.filters.driverLevelStar
                    }
                }
                this.listLoading = true;
                NProgress.start();
                getDriverInfoByMultiCondition(param).then((res) => {
                    if (res.status === 1) {
                        this.total = res.result.count;
                        this.driverInfo = res.result.driverInfos;
                        this.listLoading = false;
                        NProgress.done();
                    }
                });
            },
            getExcel(){
                makeExcel()
                    .then((response) => {
                        this.$notify({
                        title: '成功',
                        message: '导出信息表成功文件位置存放在D盘根目录下',
                        type: 'success'
                    });
                    }).catch((error) => {
                    this.$message.error(error.data.message);
                    this.$notify({
                        title: '失败',
                        message: '导出信息表失败',
                        type: 'success'
                    });
                })
            },
            // //删除
            handleDel: function (row) {
                //console.log(row);
                var _this = this;
                this.$confirm('确认删除该记录吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    _this.listLoading = true;
                    NProgress.start();
                    let param = new FormData();
                    param.append("driverId", row.driverInfo.driverId);
                    deleteDriverInfoByDriverId(param).then((res) => {
                        if (res.status === 1) {
                            _this.listLoading = false;
                            NProgress.done();
                            _this.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success'
                            });
                            _this.getDriver();
                        }
                    });

                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (row) {
                console.log("row,", row)
                this.editFormVisible = true;
                this.editFormTtile = '编辑';
                this.editForm.id = row.id;
                this.editForm.driverId = row.driverInfo.driverId;
                this.editForm.driverName = row.driverInfo.driverName;
                this.editForm.driverPhoneNumber = row.driverInfo.driverPhoneNumber;
                this.editForm.driverWxId = row.driverInfo.driverWxId;
                this.editForm.driverIdentity = row.driverInfo.driverIdentity;
                this.editForm.driverLicence = row.driverInfo.driverLicence;
                this.editForm.driverLevelStar = row.driverInfo.driverLevelStar;
            },
            editSubmit: function () {
                var _this = this;
                _this.$refs.editForm.validate((valid) => {
                    if (valid) {

                        _this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            _this.editLoading = true;
                            NProgress.start();
                            _this.btnEditText = '提交中';
                            //编辑
                            let param = {
                                driverId: _this.editForm.driverId,
                                driverName: _this.editForm.driverName,
                                driverWxId: _this.editForm.driverWxId,
                                driverPhoneNumber: _this.editForm.driverPhoneNumber,
                                driverIdentity: _this.editForm.driverIdentity,
                                driverLicence: _this.editForm.driverLicence,
                                driverLevelStar: _this.editForm.driverLevelStar,
                            };
                            updateDriverInfoByDriverId(param).then((res) => {
                                console.log("!!!", res)
                                if (res.status === 1) {
                                    _this.editLoading = false;
                                    NProgress.done();
                                    _this.btnEditText = '提 交';
                                    _this.$notify({
                                        title: '成功',
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    _this.editFormVisible = false;
                                    _this.getDriver();
                                }
                            });


                        });

                    }
                });

            },
        },
        mounted() {
            this.getDriver();
        }
    }
</script>

<style scoped>
    .uptemp .el-upload-list {
        position: absolute;
        left: 140px;
        top: 0;
        width: 50%;
    }

    .uptemp {
        position: relative;
    }

    .uptemp .el-upload-list .el-upload-list__item {
        margin-top: 0;
    }
</style>