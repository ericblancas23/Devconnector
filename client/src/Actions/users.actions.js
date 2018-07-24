import { constants } from '../Constants';
import { history } from '../Helpers/Hisotry';
import { services } from '../Services/index';
import { alertActions } from './alert.actions';


export const userActions = (user) => {
    return dispatch => {
        dispatch(request(user))
        services.register(user).then(
            user => {
                dispatch(success(user))
                history.push('/')
                dispatch(alertActions.success('Complete'))
            },
            error => {
                const { response, message } = error
                console.log(response)
                if(!response) {
                    dispatch(failure(message))
                    dispatch(alertActions.error(message))
                } else if(response.hasOwnProperty('data')) {
                    dispatch(failure(response.data.message))
                    dispatch(alertActions.error(response.data.message))
                }
            }
        )
    }
    function request(user) { return { type: constants.REGISTER_REQUEST, user }}
    function success(user) { return {type: constants.REGISTER_SUCCESS, user}}
    function failure(error) { return{ type: constants.REGISTER_FAILURE, error}}
}

export const login = (username) => {
    return dispatch => {
        dispatch(request({ username }))
        services.login(username, password).then(
            user => {
                dispatch(success(user))
                history.push('/')
            },
            error => {
                const { response, message } = error
                console.log(response)
                if(!response) {
                    dispatch(failure(message))
                    dispatch(alertActions.error(message))
                } else if (response.hasOwnProperty('data')) {
                    dispatch(failure(response.data.message))
                    dispatch(alertActions.error(response.data.message))
                }
            }
        )
    }
    function request(user) { type: constants.LOGIN_REQUEST, user}
    function success(user) { type: constants.LOGIN_SUCCESS, user}
    function failure(error) { type: constants.LOGIN_FAILURE, error}
}

export const logout = () => {
    services.logout();
    return { type: constants.LOGOUT }
}