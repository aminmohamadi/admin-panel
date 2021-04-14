import axios from '../../axios.js'
// Add a response interceptor
axios.defaults.baseURL = 'http://shop.test/api/admin/v1/'
axios.defaults.headers.common['Authorization'] = localStorage.getItem('accessToken')

axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.headers['Accept'] = 'application/json'


export default axios
