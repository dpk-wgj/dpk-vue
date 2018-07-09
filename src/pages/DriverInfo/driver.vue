<template>
	<section>
		<!--工具条-->
		<el-col :span="25" class="toolbar" style="float:left">
		<el-upload
				class="upload-demo"
				action="https://jsonplaceholder.typicode.com/posts/"
				:on-preview="handlePreview"
				:on-remove="handleRemove"
				:before-remove="beforeRemove"
				multiple
				:limit="3"
				:on-exceed="handleExceed"
				:file-list="fileList">

			<el-button type="primary">导入信息</el-button>
			<span slot="tip" class="el-upload__tip">只能导入Excel文件</span>
		</el-upload>
		</el-col>
		<el-col :span="30" class="toolbar" style="float:right">
			<el-form :inline="true" :model="filters">
				<el-form-item>
				</el-form-item>
				<el-form-item>
				<el-button type="primary" v-on:click="getUsers">姓名查询</el-button>
			</el-form-item>
				<el-form-item>
					<el-input v-model="filters.driverName" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">手机号查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.driverPhoneNumber" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">星级查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.driverLevelStar" placeholder="星级"></el-input>
				</el-form-item>

			</el-form>
		</el-col>


		<!--列表-->
		<el-table :data="driverInfo"
				  style="width: 100% ;margin: 10px 0 10px 0"
				  stripe
				  border
				  @sort-change="sortChange">
			<el-table-column prop="driverStatus" label="状态" align="center"    >
			</el-table-column>
			<el-table-column prop="driverName" label="姓名" align="center"    >
			</el-table-column>
			<el-table-column prop="driverWxId" label="微信号" align="center"  width="150" >
			</el-table-column>
			<el-table-column prop="driverPhoneNumber" label="手机号"  align="center"   >
			</el-table-column>
			<el-table-column prop="driverIdentity" label="身份证"  align="center"   >
			</el-table-column>
			<el-table-column prop="driverLevelStar" label="星级"  align="center"    >
			</el-table-column>
			<el-table-column prop="driverLevelStar" label="车辆信息"  align="center"   >
				<el-table-column prop="carNumber" label="车牌号码"  align="center"   >
				</el-table-column>
				<el-table-column prop="carType" label="车辆类型"  align="center"   >
				</el-table-column>
				<el-table-column prop="carSeat" label="车座位数"  align="center"   >
				</el-table-column>
			</el-table-column>
			<el-table-column inline-template :context="_self" label="操作"  align="center">
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
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<!--<el-select v-model="editForm.sex" placeholder="请选择性别">
                                <el-option label="男" :value="1"></el-option>
                                <el-option label="女" :value="0"></el-option>
                            </el-select>-->
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
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
    import util from '../../common/util'
    import NProgress from 'nprogress'
    import { getUserListPage, removeUser, editUser, addUser } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                   name: ''
                },
                driverInfo: [{
                    driverName :"sdasdsa",
				}
				],
                total: 0,
                page: 1,
                loading:false,
                listLoading: false,
                editFormVisible: false,//编辑界面显是否显示
                editFormTtile: '编辑',//编辑界面标题
                //编辑界面数据
                editForm: {
                    id: 0,
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
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
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
            //获取用户列表
            // getUsers() {
            //     let para = {
            //         page: this.page,
            //         name: this.filters.name
            //     };
            //     this.listLoading = true;
            //     NProgress.start();
            //     getUserListPage(para).then((res) => {
            //         this.total = res.data.total;
            //         this.users = res.data.users;
            //         this.listLoading = false;
            //         NProgress.done();
            //     });
            // },
            //删除
            handleDel: function (row) {
                //console.log(row);
                var _this = this;
                this.$confirm('确认删除该记录吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    _this.listLoading = true;
                    NProgress.start();
                    let para = { id: row.id };
                    removeUser(para).then((res) => {
                        _this.listLoading = false;
                        NProgress.done();
                        _this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                        _this.getUsers();
                    });

                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (row) {
                this.editFormVisible = true;
                this.editFormTtile = '编辑';
                this.editForm.id = row.id;
                this.editForm.name = row.name;
                this.editForm.sex = row.sex;
                this.editForm.age = row.age;
                this.editForm.birth = row.birth;
                this.editForm.addr = row.addr;
            },
            //编辑 or 新增
            editSubmit: function () {
                var _this = this;

                _this.$refs.editForm.validate((valid) => {
                    if (valid) {

                        _this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            _this.editLoading = true;
                            NProgress.start();
                            _this.btnEditText = '提交中';

                            if (_this.editForm.id == 0) {
                                //新增
                                let para = {
                                    name: _this.editForm.name,
                                    sex: _this.editForm.sex,
                                    age: _this.editForm.age,
                                    birth: _this.editForm.birth == '' ? '' : util.formatDate.format(new Date(_this.editForm.birth), 'yyyy-MM-dd'),
                                    addr: _this.editForm.addr,
                                };
                                addUser(para).then((res) => {
                                    _this.editLoading = false;
                                    NProgress.done();
                                    _this.btnEditText = '提 交';
                                    _this.$notify({
                                        title: '成功',
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    _this.editFormVisible = false;
                                    _this.getUsers();
                                });
                            } else {
                                //编辑
                                let para = {
                                    id: _this.editForm.id,
                                    name: _this.editForm.name,
                                    sex: _this.editForm.sex,
                                    age: _this.editForm.age,
                                    birth: _this.editForm.birth == '' ? '' : util.formatDate.format(new Date(_this.editForm.birth), 'yyyy-MM-dd'),
                                    addr: _this.editForm.addr,
                                };
                                editUser(para).then((res) => {
                                    _this.editLoading = false;
                                    NProgress.done();
                                    _this.btnEditText = '提 交';
                                    _this.$notify({
                                        title: '成功',
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    _this.editFormVisible = false;
                                    _this.getUsers();
                                });

                            }

                        });

                    }
                });

            },
            //显示新增界面
            handleAdd: function () {
                var _this = this;

                this.editFormVisible = true;
                this.editFormTtile = '新增';

                this.editForm.id = 0;
                this.editForm.name = '';
                this.editForm.sex = 1;
                this.editForm.age = 0;
                this.editForm.birth = '';
                this.editForm.addr = '';
            }
        },
        mounted() {
            this.getUsers();
        }
    }
</script>

<style scoped>
</style>