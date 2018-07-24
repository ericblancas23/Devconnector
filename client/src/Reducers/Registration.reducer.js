import { constants } from '../Constants/index';

export const Registration = (state = {}, action) => {
    switch(action.type) {
        case constants.REGISTER_REQUEST:
            return { registering: true };
        case constants.REGISTER_SUCCESS:
            return {};
        case constants.REGISTER_FAILURE: 
            return {};
        default:
            return state;
    }
}