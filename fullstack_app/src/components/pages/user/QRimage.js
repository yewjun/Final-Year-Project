import React, { Component } from "react";
import axios from "axios";
import { Modal, Button, Alert } from 'react-bootstrap';
import { MDBCol } from "mdbreact";
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home'
import { unixToString } from "./../../service/unixTimeConverter";

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  appBar: {
    position: 'relative',
    backgroundColor: "#1b2a6e",
    color: "white"
  },
  toolbarTitle: {
    flex: 1,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  heroContent: {
    maxWidth: 900,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  },
});

const initialState = {
  details: {},
  error: false,
  errorUser: false,
  errorScanned: false,
  showModal: false,
  modalBody: "",
  modalType: "",
  blackout: false,
};

class QRimage extends Component {
  // initialize state
  constructor(props){
    super(props)
    this.state = initialState;

    this.deactivate = this.deactivate.bind(this);
    this.checkFindUserResult = this.checkFindUserResult.bind(this);
    this.checkFindScannedResult = this.checkFindScannedResult.bind(this);
    this.toRegistrationPage = this.toRegistrationPage.bind(this);
    this.afterDidMount = this.afterDidMount.bind(this);
  }

  checkFindUserResult(result) {
    if(!result){
      this.setState({errorUser: true});
    }else{
      this.setState({details: result});
    }
  }

  checkFindScannedResult(result) {
    if(!result){
      this.setState({errorScanned: true});
    }else{
      this.setState({details: result});
    }
  }

  afterDidMount() {
    console.log("QRimage Page");
    console.log("URL: ", window.location.href);
    console.log("Location: ", this.props.id);

    this.setState(initialState);

    axios.post('/find', {
      table: "user_details",
      query: {
        id: this.props.id,
      }
    })
    .then(res => {console.log("Find User Result: ", res); this.checkFindUserResult(res.data[0])})
    .catch(err => {console.log("Error Find User: ", err); this.setState({blackout: true, error: true, modalBody: "Error Find User Details!", showModal: true})});

    axios.post('/find', {
      table: "scanned_user",
      query: {
        id: this.props.id,
      }
    })
    .then(res => {console.log("Find Scanned Result: ", res); this.checkFindScannedResult(res.data[0])})
    .catch(err => {console.log("Error Find Scanned: ", err); this.setState({blackout: true, error: true, modalBody: "Error Find Scanned User Details!", showModal: true})});
  }

  deactivate() {
    console.log("AAAAAAAAAAA");
    this.setState({showModal: false});

    if(!this.state.details.enterTime){
      axios.post('/update', {
        table: "user_details",
        id: this.state.details._id,
        newvalues: {
          $set:{
            deactivated: true
          }
        }
      })
      .then(res => {console.log("Update User Result: ", res); this.setState({showModal: true, modalBody: "QR code deactivated!", modalType: "deactivated"}); this.componentDidMount()})
      .catch(err => {console.log("Error Update User Details: ", err); this.setState({blackout: true, error: true, modalBody: "Error Update User Details!", showModal: true})});

    }else if(this.state.details.enterTime){
      axios.post('/update', {
        table: "scanned_user",
        id: this.state.details.id,
        newvalues: {
          $set:{
            deactivated: true
          }
        }
      })
      .then(res => {console.log("Update Scanned Result: ", res); this.setState({showModal: true, modalBody: "QR code deactivated!", modalType: "deactivated"}); this.componentDidMount()})
      .catch(err => {console.log("Error Update Scanned User Details: ", err); this.setState({blackout: true, error: true, modalBody: "Error Update Scanned User!", showModal: true})});
    }
  }

  componentDidMount() {
    this.afterDidMount();
  }

  toRegistrationPage() {
    this.props.history.push('/registration');
  }

  render() {
    console.log("this.state: ", this.state.details);
    const { classes } = this.props;
    return(
      <div>
        <Modal show={this.state.showModal} onHide={this.handleClose} >
          <Modal.Header>
            <Modal.Title>Note</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.modalBody}
          </Modal.Body>
          <Modal.Footer>
            {
              this.state.error ?
               <div>
                 <Button onClick={this.afterDidMount}>
                   Refresh
                 </Button>
                </div>
              :
                this.state.modalType == "deactivate" ?
                  <div>
                    <Button onClick={ () => {this.setState({showModal: false})} }>
                      Close
                    </Button>
                    <Button onClick={this.deactivate}>
                      OK
                    </Button>
                  </div>
                :
                  this.state.modalType == "deactivated" &&
                  <Button onClick={ () => {this.setState({showModal: false})} }>
                    Close
                  </Button>
            }
          </Modal.Footer>
        </Modal>

        {
          this.state.blackout ?
            <div style={{backgroundColor: "#A9A9A9", height: "100%"}}>
            </div>
          :
            (this.state.errorUser && this.state.errorScanned) ?
              <React.Fragment>
                <CssBaseline />
                <AppBar position="static" color="default" className={classes.appBar}>
                  <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Typography variant="h6" color="inherit" noWrap>
                      QR Image
                    </Typography>
                    <IconButton
                      color="inherit"
                      style={{padding: "0.44rem 1.04rem"}}
                      onClick={() => {this.props.history.push('/home')}}
                    >
                      <HomeIcon />
                    </IconButton>
                  </Toolbar>
                </AppBar>
                <main className={classes.layout}>
                  <div className={classes.heroContent}>
                    <img
                      src="https://www.trainingforwarriors.com/wp-content/uploads/2016/11/expired.jpg"
                      alt="Expired"
                      height="200px"
                      width="280px"
                    />
                    <h6 style={{color: "#1b2a6e", fontSize: "2rem", fontWeight: 500, marginTop: "30px", marginBottom: "30px"}}>The 3 Days QR Code Have Expired!</h6>
                    <Button onClick={this.toRegistrationPage}>Please Register Again Here</Button>
                  </div>
                </main>
              </React.Fragment>
            :
              this.state.details &&
                this.state.details.deactivated ?
                  <React.Fragment>
                    <CssBaseline />
                    <AppBar position="static" color="default" className={classes.appBar}>
                      <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Typography variant="h6" color="inherit" noWrap>
                          QR Image
                        </Typography>
                        <IconButton
                          color="inherit"
                          style={{padding: "0.44rem 1.04rem"}}
                          onClick={() => {this.props.history.push('/home')}}
                        >
                          <HomeIcon />
                        </IconButton>
                      </Toolbar>
                    </AppBar>
                    <main className={classes.layout}>
                      <div className={classes.heroContent}>
                        <img
                          src="https://t4.ftcdn.net/jpg/01/31/63/83/240_F_131638342_FhJvQQDWh1LU3UmTUW9ToSGKXhjP03h5.jpg"
                          alt="Deactivated"
                          height="200px"
                          width="320px"
                        />
                        <h6 style={{color: "#1b2a6e", fontSize: "2rem", fontWeight: 500, marginTop: "30px", marginBottom: "30px"}}>The QR Code Has Been Deactivated!</h6>
                        <Button onClick={this.toRegistrationPage}>Please Register Again Here</Button>
                      </div>
                    </main>
                  </React.Fragment>
              :
                (this.state.details.enterTime && this.state.details.exitTime) ?
                  <React.Fragment>
                    <CssBaseline />
                    <AppBar position="static" color="default" className={classes.appBar}>
                      <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Typography variant="h6" color="inherit" noWrap>
                          QR Image
                        </Typography>
                        <IconButton
                          color="inherit"
                          style={{padding: "0.44rem 1.04rem"}}
                          onClick={() => {this.props.history.push('/home')}}
                        >
                          <HomeIcon />
                        </IconButton>
                      </Toolbar>
                    </AppBar>
                    <main className={classes.layout}>
                      <div className={classes.heroContent}>
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGleNGarwNKpY_m5zkbxydJetvC_tmpDvr8y0Py9-9XCFqCfdbIg"
                          alt="Not Available"
                          height="155px"
                          width="155px"
                        />
                        <Alert variant="danger">
                          <h3 style={{fontSize: "1.8rem", fontWeight: 500, marginTop: "30px", marginBottom: "30px"}}>The QR Code Has Been Scanned & Is Not Available Anymore</h3>
                        </Alert>
                        <Button onClick={this.toRegistrationPage}>Please Register Again Here</Button>
                      </div>
                    </main>
                  </React.Fragment>
              :
                (this.state.details && this.state.details.baseImg) &&
                  !this.state.details.deactivated &&
                    <React.Fragment>
                      <CssBaseline />
                      <AppBar position="static" color="default" className={classes.appBar}>
                        <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
                          <Typography variant="h6" color="inherit" noWrap>
                            QR Image
                          </Typography>
                          <IconButton
                            color="inherit"
                            style={{padding: "0.44rem 1.04rem"}}
                            onClick={() => {this.props.history.push('/home')}}
                          >
                            <HomeIcon />
                          </IconButton>
                        </Toolbar>
                      </AppBar>
                      <main className={classes.layout}>
                        <div className={classes.heroContent}>
                          <div>
                            <img src={this.state.details.baseImg[0]} />
                          </div>

                          <React.Fragment>
                            <main className={classes.layout} style={{paddingTop: '20px'}}>
                              <Paper style={{ width: "100%"}}>
                                <div style={{
                                  padding: '18px 30px',
                                  backgroundColor: "#1b2a6e",
                                  color: "white",
                                  fontSize: 14,
                                  textAlign: 'left',
                                  borderRadius: '8px 8px 0 0',
                                }}>
                                  <Typography variant="h6" className={classes.margin} style={{ textAlign: 'left', color: 'white'}}>
                                    Details
                                  </Typography>
                                </div>
                                <div className={classes.margin} style={{display:'flex', flexDirection: 'column', padding: '15px'}}>
                                  <div style={{margin: "10px 30px", fontWeight: 700}}>
                                    <h7><b>Personal Details</b></h7>
                                  </div>
                                  <div style={{margin: "20px 55px"}}>
                                    <p>Register Time: <b>{unixToString(this.state.details.formSubmit)}</b></p>
                                    <p>Name: <b>{this.state.details.name}</b></p>
                                    <p>IC / Passport No.: <b>{this.state.details.ic}</b></p>
                                    <p>Gender: <b>{this.state.details.gender}</b></p>
                                    <p>Email: <b>{this.state.details.email}</b></p>
                                    <p>Contact No.: <b>{this.state.details.contact}</b></p>
                                    <p>Type of Visitor:
                                      <b>{
                                        this.state.details.othersVisitor ?
                                          " " + this.state.details.othersVisitor
                                        :
                                          " " + this.state.details.visitor
                                      }</b>
                                    </p>
                                    {
                                      (this.state.details.visitor !== "Student" && this.state.details.visitor !== "Parent") &&
                                        <p>Number of Passenger.: <b>{this.state.details.passenger}</b></p>
                                    }
                                  </div>
                                  {
                                    this.state.details.passenger > 0 &&
                                      <div>
                                        <div style={{margin: "10px 30px", fontWeight: 700}}>
                                          <h7><b>Passenger Details</b></h7>
                                        </div>
                                        <div style={{margin: "20px 55px"}}>
                                        {
                                          this.state.details.passengersInfo.map( (passenger) => {
                                            if(passenger.name.length > 0 && passenger.ic.length > 0){
                                              return(
                                                <p>Passenger{parseInt(passenger.index) + 1}: <b>{passenger.name + " " + passenger.ic}</b></p>
                                              )
                                            }
                                          })
                                        }
                                        </div>
                                      </div>
                                  }
                                  <div style={{margin: "10px 30px", fontWeight: 700}}>
                                    <h7><b>Vehicle Details</b></h7>
                                  </div>
                                  <div style={{margin: "20px 55px"}}>
                                    <p>Type of Vehicle:
                                      <b>{
                                        this.state.details.othersVehicleType ?
                                          " " + this.state.details.othersVehicleType
                                        :
                                          " " + this.state.details.vehicleType
                                      }</b>
                                    </p>
                                    <p>Vehicle Plate No.: <b>{this.state.details.vehiclePlate}</b></p>
                                    <p>Purpose of Entering Campus: <b>{this.state.details.purpose}</b></p>
                                  </div>
                                </div>
                                <Button onClick={ () => {this.setState({showModal: true, modalBody: "Are you sure to deactivate this QR code?", modalType: "deactivate"})} }>Deactivate</Button>
                                <Button onClick={this.toRegistrationPage}>Register Another Form</Button>
                              </Paper>
                            </main>
                          </React.Fragment>
                        </div>
                      </main>
                    </React.Fragment>
        }
      </div>
    )
  }
}

const enhance = compose(
  withRouter,
  withStyles(styles),
);

export default enhance(QRimage);
