<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAdmins">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>

			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;"
					  stripe
					  border>
				<el-table-column type="index" width="60" align="center" >
				</el-table-column>
				<el-table-column prop="adminInfo.userId" label="序号"  sortable align="center" >
				</el-table-column>
				<el-table-column prop="adminInfo.username" label="姓名"  align="center" >
				</el-table-column>
				<el-table-column prop="adminInfo.remark" label="备注"  align="center" >
				</el-table-column>
				<el-table-column prop="adminGroup.groupName" label="用户组名" align="center" >
				</el-table-column>
				<el-table-column inline-template :context="_self" label="操作" width="200" align="center" >
					<span>
						<el-button size="small" @click="handleEdit(row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>
					</span>
				</el-table-column>
			</el-table>
		</template>
		<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
			<el-pagination layout="total,prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="this.total" style="float:right;">
			</el-pagination>
		</el-col>
		<!--界面-->
		<el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名"  prop="username">
					<el-input v-model="editForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="editForm.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="editForm.remark" ></el-input>
				</el-form-item>
				<el-form-item label="组别" prop="userGroupId">
					<el-input v-model="editForm.userGroupId" min="0" :max="2" type="number" auto-complete="off"></el-input>
					<span style="color:#F56C6C;">0：管理员 1：司机 2：乘客</span>
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
    import { getUserInfoById , getAllAdminInfo , deleteAdminInfoById , addAdminInfo , updateAdminInfo } from '../../api/api';
    import NProgress from 'nprogress'
    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                editForm: {
                    userId:'',
                    username:'',
                    password:'',
                    remark:'',
                    userGroupId:''
                },
                total: 0,
                page: 1,
                loading: false,
                editFormVisible: false,//编辑界面显是否显示
                editFormTtile: '',//界面标题
                editLoading: false,
                editFormRules: {
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],

                    userGroupId: [
                        { required: true, message: '请选择组别', trigger: 'blur' }
                    ]
                },
                btnEditText:'确定',
                users: [],
            }
        },
        mounted(){
            this.getAdmins();
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getAdmins();
            },
            //获取用户列表
            getAdmins(){
                let param = {
                    sort: "user_id",
                    order: "asc",
                    offset: (this.page - 1) * 10,
                    limit: 10,
                    adminInfo:{
                        username:this.filters.name,
                    }
                };
                this.loading = true;
                NProgress.start();
                getAllAdminInfo(param).then((res) => {
                    //  console.log(res);
                    if(res.status === 1){
                        this.total = res.result.count;
                        this.users = res.result.adminInfos;
                        this.loading = false;
                        NProgress.done();
                    }

                });
            },
            //添加用户
            handleAdd: function (){

                this.editFormTtile = '添加用户';
                this.editForm.userId = -1;
                this.editForm.username = '';
                this.editForm.password = '';
                this.editForm.remark = '';
                this.editForm.userGroupId = '';
                this.editFormVisible = true;
            },
            //删除
            handleDel: function (row) {
                // console.log(row);
                // console.log(row.userId);
                var _this = this;
                this.$confirm('确认删除该用户吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    _this.Loading = true;
                    NProgress.start();
                    let param = new FormData();
                    param.append("userId", row.adminInfo.userId);
                    deleteAdminInfoById(param).then((res) => {
                        if(res.status === 1){
                            _this.Loading = false;
                            NProgress.done();
                            _this.$notify({
                                title: '成功',
                                message: '删除用户成功',
                                type: 'success'
                            });
                            _this.getAdmins();
                        }
                    });

                }).catch(() => {

                });
            },
            //修改时显示的编辑页面
            handleEdit: function (row) {
                //console.log("row,",row);
                this.editFormTtile = '修改';
                this.editForm.userId = row.adminInfo.userId;
                this.editForm.username = row.adminInfo.username;
                this.editForm.password = row.adminInfo.password;
                this.editForm.remark = row.adminInfo.remark;
                this.editForm.userGroupId = row.adminInfo.userGroupId;
                this.editFormVisible = true;
            },
            //新增或者修改点击的确定按钮
            editSubmit: function () {
                var _this = this;
                _this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        _this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            _this.editLoading = true;
                            NProgress.start();
                            _this.btnEditText = '提交中';
                            if (_this.editForm.userId === -1) {
                                //新增用户
                                let param = {
                                    username: _this.editForm.username,
                                    remark: _this.editForm.remark,
                                    password: _this.editForm.password,
                                    userGroupId: _this.editForm.userGroupId,
                                };
                                addAdminInfo(param).then((res) => {
                                    if(res.status === 1){
                                        _this.editLoading = false;
                                        NProgress.done();
                                        _this.btnEditText = '提 交';
                                        _this.$notify({
                                            title: '成功',
                                            message: '新增用户成功',
                                            type: 'success'
                                        });
                                        _this.editFormVisible = false;
                                        _this.getAdmins();
                                    }
                                });
                            } else {
                                //编辑用户
                                let param = {
                                    userId: _this.editForm.userId,
                                    username: _this.editForm.username,
                                    remark: _this.editForm.remark,
                                    password: _this.editForm.password,
                                    userGroupId: _this.editForm.userGroupId,
                                };
                                updateAdminInfo(param).then((res) => {
                                    // console.log("!!!",res)
                                    if(res.status === 1){
                                        _this.editLoading = false;
                                        NProgress.done();
                                        _this.btnEditText = '提 交';
                                        _this.$notify({
                                            title: '成功',
                                            message: '编辑用户成功',
                                            type: 'success'
                                        });
                                        _this.editFormVisible = false;
                                        _this.getAdmins();
                                    }
                                });

                            }

                        });

                    }
                });

            },
        }

    };
</script>

<style scoped>

</style>