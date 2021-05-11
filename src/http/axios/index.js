import axios from '../../axios.js'
import router from '@/router'
// Add a response interceptor
axios.defaults.baseURL = 'http://shop.test/api/admin/v1/'
axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token')
axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.headers['Accept'] = 'application/json'
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response.status === 403){
  router.push('/pages/error-403')
  }
  return Promise.reject(error);
});

export default axios
