<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item label="起始时间">
					<el-col :span="11">
						<el-date-picker type="date" placeholder="选择日期" v-model="trackDate.startYmd" style="width: 100%;" ></el-date-picker>
					</el-col>
					<el-col class="line" :span="2">&nbsp;&nbsp;&nbsp;&nbsp;-</el-col>
					<el-col :span="11">
						<el-time-picker type="fixed-time" placeholder="选择时间" v-model="trackDate.startHms" style="width: 100%;"></el-time-picker>
					</el-col>
				</el-form-item>
				<el-form-item label="结束时间">
					<el-col :span="11">
						<el-date-picker type="date" placeholder="选择日期"  v-model="trackDate.endYmd" style="width: 100%;"></el-date-picker>
					</el-col>
					<el-col class="line" :span="2">&nbsp;&nbsp;&nbsp;&nbsp;-</el-col>
					<el-col :span="11">
						<el-time-picker type="fixed-time" placeholder="选择时间"  v-model="trackDate.endHms" style="width: 100%;"></el-time-picker>
					</el-col>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formData.logInfo.logId" placeholder="日志编号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formData.logInfo.action" placeholder="用户行为"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formData.logInfo.roleId" placeholder="用户角色"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formData.logInfo.orderId" placeholder="订单编号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getLogInfoList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="infolist" highlight-current-row v-loading="listLoading" style="width: 100%;">
				<el-table-column prop="logId" label="日志编号" sortable>
				</el-table-column>
				<el-table-column prop="action" label="用户行为" sortable>
				</el-table-column>
				<el-table-column prop="roleId" label="用户角色" :formatter="formatRole" sortable>
				</el-table-column>
				<el-table-column prop="logTime" label="行为时间"  sortable>
				</el-table-column>
				<el-table-column prop="orderId" label="订单编号"  sortable>
				</el-table-column>
				<el-table-column inline-template :context="_self" label="操作" >
					<span>
						<el-button size="small" @click="handleEdit(row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>
					</span>
				</el-table-column>
			</el-table>
		</template>

<!--分页-->
<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
<el-pagination layout="prev, pager, next" @current-change="" :page-size="20" :total="total" style="float:right;">
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
	import { findLogInfoMultiCondition, getLogInfoByLogId} from '../../api/api';

	export default {
		data() {
			return {
				formData: {
					logInfo: {
						logId: '',
						action: '',
						roleId: '',
						logTime: '',
						orderId: '',
					},
				},
				filters: {
					offset: 0,
					sort: 'log_id',
					order: 'desc',
					limit: 10,
					logInfo: {
						logId: '',
						action: '',
						roleId: '',
						logTime: '',
						orderId: '',
					},
				},
				trackDate: {
					startYmd: null,
					startHms: null,
					endYmd: null,
					endHms: null
            	},
				infolist: [],
				total: 0,
				page: 1,
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
			//角色显示转换
			formatRole: function (row, column) {
				return row.roleId == 1 ? '司机' : row.roleId == 2 ? '乘客' : '未知';
			},
			// handleCurrentChange(val) {
			// 	this.page = val;
			// 	this.getLogInfoList();
			// },
			//获取用户日志列表
			getLogInfoList() {
				let para = {
					// page: this.page,
					// name: this.filters.name,
					offset: this.filters.offset,
					sort: this.filters.sort,
					order: this.filters.order,
					limit: this.filters.limit,
					logInfo: {
						logId: this.filters.logInfo.logId,
						action: this.filters.logInfo.action,
						roleId: this.filters.logInfo.roleId,
						logTime: this.filters.logInfo.logTime,
						orderId: this.filters.logInfo.orderId,
					},
				};
				this.listLoading = true;
				NProgress.start();
				findLogInfoMultiCondition(para).then((res) => {
					this.total = res.result.count;
					this.infolist = res.result.logInfoList;
					this.listLoading = false;
					NProgress.done();
				});
			},
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
						_this.getLogInfoList();
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
									_this.getLogInfoList();
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
									_this.getLogInfoList();
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
			this.getLogInfoList();
		}
	}
</script>

<style scoped>
</style>