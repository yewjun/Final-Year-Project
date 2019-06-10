import React, { Component } from 'react';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import {MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBIcon} from "mdbreact";

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    size: 36,
  },
  form: {
    width: '100%', 
    marginTop: theme.spacing.unit,
  },
});

class Home extends Component {

  render() {
    const { classes } = this.props;
    return (
      <div style={{backgroundColor: '#DCDCDC', height: "100vh"}}>
        <main className={classes.main}>
          <Paper className={classes.paper}>
            <div className={classes.avatar} style={{marginTop: '30px'}}>
              <MDBIcon icon="qrcode" style={{fontSize: "36px"}}/>
            </div>
            <Typography component="h1" variant="h5" style={{ color:"#1b2a6e", marginTop: '30px', marginBottom: '40px'}}>
              QR Code Vehicle Registration
            </Typography>
            <form className={classes.form} style={{display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                <Button
                  size="lg"
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{backgroundColor: "#1b2a6e", color: 'white', width: '50%', marginTop: '20px'}}
                  onClick={() => {this.props.history.push('/registration')}}
                >
                  Visitor
                </Button>
                <Button
                  size="lg"
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{backgroundColor: "#1b2a6e", color: 'white', width: '50%', marginTop: '20px', marginBottom: '20px'}}
                  onClick={() => {this.props.history.push('/dashboard')}}
                >
                  Admin
                </Button>
            </form>
          </Paper>
        </main>
      </div>
    );
  }
}

const enhance = compose(
  withRouter,
  withStyles((styles)),
);

export default enhance(Home);
