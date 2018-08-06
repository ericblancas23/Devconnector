import React, { Component } from 'react';
import { login } from '../Actions/users.actions';
import { connect } from 'react-redux';



export default class Login extends Component {
  constructor(props) {
      super(props);
      this.state = {
        email: '',
        password: '',
        errors: {}
      }
      this.onSubmit = this.onSubmit.bind(this);
      this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.props.login
  }

  onChange(e) {
      this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
      e.preventDefault();

      const user = {
          email: this.state.email,
          password: this.state.password
      }
      console.log(user);
  }
    render() {
        return(
            <div className="login">
    <div className="container">
      <div className="row">
        <div className="col-md-8 m-auto">
          <h1 className="display-4 text-center">Log In</h1>
          <p className="lead text-center">Sign in to your DevConnector account</p>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <input type="email" className="form-control form-control-lg" placeholder="Email Address" name="email" 
               onChange={ this.onChange }
               value={ this.state.email }
              />
            </div>
            <div className="form-group">
              <input type="password" className="form-control form-control-lg" placeholder="Password" name="password" 
               value={ this.state.password }
               onChange={ this.onChange }
              />
            </div>
            <input type="submit" className="btn btn-info btn-block mt-4" 
             onSubmit={ this.onSubmit }
            />
          </form>
        </div>
      </div>
    </div>
  </div>

        );
    }
}

function mapStateToProps(state) {
  return {
    loggingIn: state.authentication
  }
}

const connectedSignIn = connect(mapStateToProps)(Login)
export { connectedSignIn as Login}
