// 对于axios进行二次封装
import axios from 'axios'
// 引入进度条
import nprogress from 'nprogress'
// 引入store仓库
import store from '@/store'
// 引入进度条样式
import 'nprogress/nprogress.css'
// start 进度条开始 done 进度条结束

// 1.利用axios对象的方法create，创建一个axios实例
// 2.request就是axios
const requests = axios.create({
  // 配置对象
  // 基础路径，发请求的时候，路劲当中会出现api
  baseURL: '/api',
  // 超时时间：5s
  timeout: 5000
})
// 请求拦截器：在发请求之前，请求拦截器可以检测到，可以在请求发出去之前，做一些事情
requests.interceptors.request.use((config) => {
  // config：配置对象，对象里面有一个属性很重要，header请求头
  if (store.state.detail.nanoid_token) {
    // 请求头添加一个字段(userTempId),和后台商量好
    config.headers.userTempId = store.state.detail.nanoid_token
  }
  // 需要携带token给服务器
  if (store.state.user.token) {
    config.headers.token = store.state.user.token
  }
  nprogress.start()
  return config
})

// 响应拦截器：
requests.interceptors.response.use((res) => {
  // 响应成功的回调函数,服务器响应数据回来以后，响应拦截器可以拦截到，可以做一些事情
  nprogress.done()
  return res.data
}, (error) => {
  // 响应失败的回调函数
  return Promise.reject(new Error(error))
})

// 对外暴露
export default requests
