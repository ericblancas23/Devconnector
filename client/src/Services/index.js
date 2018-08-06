import axios from 'axios';

export const services = {
    login, 
    logout,
    register
}

const  NEW_USER = 'http://localhost:5000/users/register';
const USER_LOGIN = 'http://localhost:5000/users/login';

function register(user) {
   return axios.post(NEW_USER, user)
    .then(handleResponse)
    .catch(saveToken)
}

function login(user) {
    return axios.post(USER_LOGIN, user)
     .then(handleResponse)
     .catch(saveToken)
}

function logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('data')
}


//utilities 

function saveToken(user) {
    if (user && user.data.token) {
        localStorage.setItem('user', JSON.stringify(user.data.token))
        localStorage.setItem('data', JSON.stringify(user.data.user._id))
    }
    return user;
}

function handleResponse(response, err) {
    if(err) {
        console.log(err);
        return Promise.reject(response.statusText)
    }
    console.log('--handle response--')
    console.log(response)
    return response;
}

function handleResponse(response, err) {
    if (err) {
      console.log('err');
      return Promise.reject(response.statusText)
    }
    console.log('—— handleResponse ——');
    console.log(response);
    return response
  }