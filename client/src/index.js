import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';
import thunk from 'redux-thunk';

//components 

import reducer from './Reducers/index'; 

import './index.css';
import App from './App';


const createStoreWithMiddleware = applyMiddleware(thunk, ReduxPromise)(createStore);

ReactDOM.render(
<Provider store={ createStoreWithMiddleware(reducer, 

window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())} >
<App /></Provider>, document.getElementById('root'));

