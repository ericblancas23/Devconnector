import { combineReducers } from 'redux';
import { authentication } from './authentication.reducer';
import { Registration } from './Registration.reducer';


const rootReducer = combineReducers({
    authentication,
    Registration
});

export default rootReducer;