<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="username" label="姓名" width="120" sortable>
				</el-table-column>
				<el-table-column prop="remark" label="备注" width="120" sortable>
				</el-table-column>
				<!-- <el-table-column prop="sex" label="性别" width="100" sortable>
				</el-table-column>
				<el-table-column prop="age" label="年龄" width="100" sortable>
				</el-table-column>
				<el-table-column prop="birth" label="生日" width="120" sortable>
				</el-table-column>
				<el-table-column prop="addr" label="地址" min-width="180" sortable>
				</el-table-column> -->
			</el-table>
		</template>

</section>
</template>
<script>
	import { getUserInfoById } from '../../api/api';
	import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				loading: false,
				users: []
			}
		},
		methods: {
		},
		mounted() {
			let param = {
				userId: 1
			};
			this.loading = true;
			NProgress.start();
			getUserInfoById(param).then((res) => {
				console.log(res)
				if(res.status === 1){
					this.users = []
					this.users.push( res.result)
				}
				
				this.loading = false;
				NProgress.done();
			});
		}
	};
</script>

<style scoped>
	
</style>