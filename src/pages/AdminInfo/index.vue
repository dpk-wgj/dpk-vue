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
			<el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="userId" label="Id" width="120" sortable>
				</el-table-column>
				<el-table-column prop="username" label="姓名" width="120" sortable>
				</el-table-column>
				<el-table-column prop="remark" label="备注" width="120" sortable>
				</el-table-column>
				<el-table-column prop="userGroupId" label="组别" width="120" sortable>
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
				<el-form-item label="姓名" prop="username">
					<el-input v-model="editForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="editForm.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="editForm.remark" ></el-input>
				</el-form-item>
				<el-form-item label="组别">
					<el-input v-model="editForm.userGroupId" auto-complete="off"></el-input>
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
	import { getUserInfoById , getAdminByUsername , getAllAdminByUsername , deleteAdminInfoById , addAdminInfo , updateAdminInfo } from '../../api/api';
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
				loading: false,
                editFormVisible: false,//编辑界面显是否显示
                editFormTtile: '',//界面标题
                editLoading: false,
                editFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
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
		    //获取用户列表
            getAdmins(){
                let param = {
                    adminInfo:{
                        username:this.filters.name
                       // username:'清'
                    }
                };
                this.loading = true;
                NProgress.start();
               param = new FormData();
               param.append("username",this.filters.name);
                getAllAdminByUsername(param).then((res) => {
                  //  console.log(res);
                    if(res.status === 1){
                        //console.log(res);
                        this.users = res.result;
                        // this.users.push( res.result);
                        //console.log(this.users);
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
                this.editForm.userGroupId = 2;
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
                    param.append("userId", row.userId);
                    deleteAdminInfoById(param).then((res) => {
                        if(res.status === 1){
                            _this.Loading = false;
                            NProgress.done();
                            _this.$notify({
                                title: '成功',
                                message: '删除成功',
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
                this.editForm.userId = row.userId;
                this.editForm.username = row.username;
                this.editForm.password = row.password;
                this.editForm.remark = row.remark;
                this.editForm.userGroupId = row.userGroupId;
                this.editFormVisible = true;
			},
			//新增或者修改点击的确定按钮
            editSubmit: function () {
                var _this = this;

            }
        }

	};
</script>

<style scoped>
	
</style>