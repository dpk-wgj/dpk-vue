<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="组名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAdminGroupByName">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>

			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="adminGroups" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="adminGroupId" label="Id" width="120" sortable>
				</el-table-column>
				<el-table-column prop="groupName" label="组名" width="120" sortable>
				</el-table-column>
				<el-table-column prop="permission" label="权限" width="120" sortable>
				</el-table-column>
					<el-table-column inline-template :context="_self" label="操作" width="200">
					<span>
						<el-button size="small" @click="handleEdit(row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>
					</span>
					</el-table-column>
			</el-table>
		</template>

		<!--界面-->
		<el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="组名" prop="username">
					<el-input v-model="editForm.groupName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="权限"prop="permission">
					<el-input v-model="editForm.permission" auto-complete="off"></el-input>
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
    import { getAdminGroupById , getAdminGroupByName , deleteAdminGroup , addAdminGroup , updateAdminGroupById , getAllAdminGroup } from '../../api/api';
    import NProgress from 'nprogress'
    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                editForm: {
                    adminGroupId:'',
                    groupName:'',
                    permission:'',
                },
                loading: false,
                editFormVisible: false,//编辑界面显是否显示
                editFormTtile: '',//界面标题
                editLoading: false,
                editFormRules: {
                    username: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    permission: [
                        { required: true, message: '请输入权限', trigger: 'blur' }
                    ]
                },
                btnEditText:'确定',
                adminGroups: [],
            }
        },
        mounted(){
            this.getAdminGroups();
        },
        methods: {
            //获取所有分组列表
            getAdminGroups(){
                // let param = {
                //     adminGroup:{
                //         groupName:this.filters.name
                //         // username:'清'
                //     }
                // };
                // this.loading = true;
                NProgress.start();
                // param = new FormData();
                // param.append("groupName",this.filters.name);
                getAllAdminGroup().then((res) => {
                     // console.log(res);
                    if(res.status === 1){
                        //console.log(res);
                        this.adminGroups = res.result;
                        // this.users.push( res.result);
                        //console.log(this.users);
                        this.loading = false;
                        NProgress.done();
                    }

                });
            },
            //根据名字获取分组列表
            getAdminGroupByName(){
                let param = {
                    adminGroup:{
                        groupName:this.filters.name
                        // username:'清'
                    }
                };
                this.loading = true;
                NProgress.start();
                param = new FormData();
                param.append("groupName",this.filters.name);
                getAdminGroupByName(param).then((res) => {
                    //  console.log(res);
                    if(res.status === 1){
                        //console.log(res);
                        this.adminGroups = res.result;
                        // this.users.push( res.result);
                        //console.log(this.users);
                        this.loading = false;
                        NProgress.done();
                    }

                });
            },
            //添加用户
            handleAdd: function (){

                this.editFormTtile = '添加分组';
                this.editForm.adminGroupId = -1;
                this.editForm.groupName = '';
                this.editForm.permission = 0;
                // this.editForm.remark = '';
                // this.editForm.userGroupId = 2;
                 this.editFormVisible = true;
            },
            //删除
            handleDel: function (row) {
                // console.log(row);
                // console.log(row.userId);
                var _this = this;
                this.$confirm('确认删除该记录吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    _this.Loading = true;
                    NProgress.start();
                    let param = new FormData();
                    param.append("adminGroupId", row.adminGroupId);
                    deleteAdminGroup(param).then((res) => {
                        if(res.status === 1){
                            _this.Loading = false;
                            NProgress.done();
                            _this.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success'
                            });
                            _this.getAdminGroups();
                        }
                    });

                }).catch(() => {

                });
            },
            //修改时显示的编辑页面
            handleEdit: function (row) {
                //console.log("row,",row);

                this.editFormTtile = '修改';
                this.editFormTtile = '修改分组';
                this.editForm.adminGroupId = row.adminGroupId;
                this.editForm.groupName = row.groupName;
                this.editForm.permission = row.permission;
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

                            if (_this.editForm.adminGroupId === -1) {
                                //新增用户
                                let param = {
                                    groupName: _this.editForm.groupName,
                                    permission: _this.editForm.permission,
                                    // password: _this.editForm.password,
                                    // userGroupId: _this.editForm.userGroupId,
                                };
                                addAdminGroup(param).then((res) => {
                                    if(res.status === 1){
                                        _this.editLoading = false;
                                        NProgress.done();
                                        _this.btnEditText = '提 交';
                                        _this.$notify({
                                            title: '成功',
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        _this.editFormVisible = false;
                                        _this.getAdminGroups();
                                    }
                                });
                            } else {
                                //编辑用户
                                let param = {
                                    adminGroupId: _this.editForm.adminGroupId,
                                    groupName: _this.editForm.groupName,
                                    permission: _this.editForm.permission,
                                };
                                updateAdminGroupById(param).then((res) => {
                                    // console.log("!!!",res)
                                    if(res.status === 1){
                                        _this.editLoading = false;
                                        NProgress.done();
                                        _this.btnEditText = '提 交';
                                        _this.$notify({
                                            title: '成功',
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        _this.editFormVisible = false;
                                        _this.getAdminGroups();
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