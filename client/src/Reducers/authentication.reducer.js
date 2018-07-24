import { constants } from '../Constants/index';

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user;

export const authentication = (state = initialState, action) => {
    switch (action.type) {
        case constants.LOGIN_REQUEST:
            return {
                logginin: true,
                user: action.user
            };
        case constants.LOGIN_SUCCESS:
            return {
                loggedin: true,
                action: action.user
            };
        case constants.LOGIN_FAILURE:
            return {
            };
        case constants.LOGOUT:
            return {

            };
        default:
            return state;
    }
}