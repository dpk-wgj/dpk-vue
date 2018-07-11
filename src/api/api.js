import axios from 'axios';

let base = '';

axios.interceptors.request.use(
    config => {
       if(window.localStorage.getItem('token')){
          config.headers.token = window.localStorage.getItem('token');
       }
      return config;
    },
    err => {
       return Promise.reject(err);
 });
 
export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };


// 管理员
export const getUserInfoById = params => { return axios.get(`/api/getUserInfoById/${params.userId}`).then(res => res.data); };

export const adminLogin = params => { 
    return axios.post(`/public/driver/login`, params).then(res => {
        let token = res.headers.refresh
        window.localStorage.setItem('token',token);
        // window.localStorage.setItem('user',JSON.stringify(res.data.result))
        window.localStorage.setItem('user',res.data.result.userId)
        return res
    }); 
};


//车辆
export const getCarInfoByCarId = params => { return axios.get(`/admin/car/getCarInfoByCarId/${params.carId}`).then(res => res.data); };

export const updateCarInfoByCarId = params => { return axios.post(`/admin/car/updateCarInfoByCarId`, params).then(res => res.data); };

export const updateDriverInfoByDriverId = params => { return axios.post(`/admin/driver/updateDriverInfoByDriverId`, params).then(res => res.data); };

export const deleteCarInfoByCarId = params => { return axios.post(`/admin/car/deleteCarInfoByCarId`, params).then(res => res.data); };

export const deleteDriverInfoByDriverId = params => { return axios.post(`/admin/driver/deleteDriverInfoByDriverId`, params).then(res => res.data); };

export const importExcel = params => { return axios.post(`/admin/driver/importExcel`, params).then(res => res.data); };

export const makeExcel = () => { return axios.post(`/admin/driver/makeExcel`,).then(res => res.data); };


export const addCarInfo = params => { return axios.post(`/admin/car/addCarInfo`, params).then(res => res.data); };

export const getCarInfoByCarNumber = params => { return axios.get(`/admin/car/getCarInfoByCarNumber/${params.carNumber}`, ).then(res => res.data); };

export const findCarInfoByMultiCondition = params => { return axios.post(`/admin/car/findCarInfoByMultiCondition`, params).then(res => res.data); };

export const getDriverInfoByMultiCondition = params => { return axios.post(`/admin/driver/getDriverInfoByMultiCondition`, params).then(res => res.data); };


//车辆定位
export const getAllCarLocation = () => { return axios.get(`/admin/driver/getAllCarLocation`).then(res => res.data); };

export const getLocationInfoByDate = param => { return axios.post(`/admin/order/getLocationInfoByDate`, param).then(res => res.data); };

// 
// export const getLocationInfoByDate = param => { return axios.post(`/admin/order/getLocationInfoByDate`, param).then(res => res.data); };


//Order订单接口
// export const getCarInfoByCarId = params => { return axios.get(`/api/driver/getOrderInfoByDriverId}`).then(res => res.data); };

