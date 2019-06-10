import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../../firebase';
import Cookies from 'js-cookie';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import {MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput} from "mdbreact";

function loggedIn() {
  const user = Cookies.get('user');

  if(user) {
    return true;
  }else {
    return false;
  }
}

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: null,
    };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        console.log("Login Successfully");
        this.setState({ ...this.state });
        Cookies.set('user', email);
        this.props.history.push('/dashboard');
      })
      .catch(error => {
        console.log("Login Failed");
        this.setState({ error });
      });

    console.log("Email: ", email);
    console.log("Password: ", password);
    event.preventDefault();
  };

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
      error: null,
    });
  };

  render() {
    const { email, password, error } = this.state;
    console.log("Logged In? ", loggedIn());
    return (
      <MDBContainer>
        <MDBRow className="d-flex justify-content-center">
          <MDBCol md="6">
            <MDBCard>
              <form onSubmit={this.onSubmit}>
                <div className="header pt-3 grey lighten-2">
                  <MDBRow className="d-flex justify-content-start">
                    <h3 className="deep-grey-text mt-3 mb-4 pb-1 mx-5">
                      Log in
                    </h3>
                    <IconButton
                      color="inherit"
                      style={{ marginLeft: '210px', marginTop: '10px', marginBottom: '20px'}}
                      onClick={() => {this.props.history.push('/home')}}
                    >
                      <HomeIcon />
                    </IconButton>
                  </MDBRow>
                </div>
                <MDBCardBody className="mx-4 mt-4">
                  <MDBInput
                    label="Your email"
                    group
                    type="text"
                    validate
                    value={email}
                    onChange={this.onChange('email')}
                  />
                  <MDBInput
                    label="Your password"
                    group
                    type="password"
                    validate
                    containerClass="mb-0"
                    value={password}
                    onChange={this.onChange('password')}
                  />
                  <p className="font-small grey-text d-flex justify-content-center">
                    {error && <span>{error.message}</span>}
                  </p>
                  <div className="text-center mb-4 mt-5">
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      className="btn-block z-depth-2"
                    >
                      Log in
                    </Button>
                  </div>
                </MDBCardBody>
              </form>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

const enhance = compose(
  withRouter,
  withFirebase,
);

export default enhance(Login);
