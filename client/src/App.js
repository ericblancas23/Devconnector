import React, { Component } from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Register } from './components/Register';
import Login from './components/Login';
import Landing from './components/Landing';
import { Footer } from './components/Footer';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
         <div className='App'>
         <Navbar />
             <Route exact path='/' component={ Landing } />
           <div className="container">
             <Route path='/Login' component={ Login } />
             <Route path='/Register' component={ Register } />
           </div>
          <Footer />
         </div>
      </Router>
    );
  }
}

export default App;
