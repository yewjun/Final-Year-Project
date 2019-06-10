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
import DashboardIcon from '@material-ui/icons/Dashboard';
import IconButton from '@material-ui/core/IconButton';
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
  modalDate: "",
  blackout: false,
};

class QRaccess extends Component {
  // initialize state
  constructor(props){
    super(props)
    this.state = initialState;

    this.entering = this.entering.bind(this);
    this.leaving = this.leaving.bind(this);
    this.getDateWhenEnter = this.getDateWhenEnter.bind(this);
    this.getDateWhenExit = this.getDateWhenExit.bind(this);
    this.checkFindUserResult = this.checkFindUserResult.bind(this);
    this.checkFindScannedResult = this.checkFindScannedResult.bind(this);
    this.addToScanned = this.addToScanned.bind(this);
    this.toAdminPage = this.toAdminPage.bind(this);
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

  toAdminPage() {
    this.setState(initialState);
    this.props.history.push('/dashboard');
  }

  afterDidMount() {
    console.log("QRaccess Page");
    console.log("URL: ", window.location.href);
    console.log("Location: ", this.props.match.params.id);

    this.setState(initialState);

    axios.post('/find', {
      table: "user_details",
      query: {
        id: this.props.match.params.id,
      }
    })
    .then(res => {console.log("Find User Result: ", res); this.checkFindUserResult(res.data[0])})
    .catch(err => {console.log("Error Find User: ", err); this.setState({blackout: true, error: true, modalBody: "Error Find User Details!", showModal: true})});

    axios.post('/find', {
      table: "scanned_user",
      query: {
        id: this.props.match.params.id,
      }
    })
    .then(res => {console.log("Find Scanned Result: ", res); this.checkFindScannedResult(res.data[0])})
    .catch(err => {console.log("Error Find Scanned: ", err); this.setState({blackout: true, error: true, modalBody: "Error Find Scanned User Details!", showModal: true})});
  }

  componentDidMount() {
    this.afterDidMount();
  }

  addToScanned() {
    console.log("Add to Scanned Table");
    axios.post('/addScanned', {
      table: "scanned_user",
      query: {
        id: this.state.details.id,
        name: this.state.details.name,
        email: this.state.details.email,
        ic: this.state.details.ic,
        contact: this.state.details.contact,
        gender: this.state.details.gender,
        visitor: this.state.details.visitor,
        othersVisitor: this.state.details.othersVisitor,
        passenger: this.state.details.passenger,
        passengersInfo: this.state.details.passengersInfo,
        vehicleType: this.state.details.vehicleType,
        otherVehicleType: this.state.details.otherVehicleType,
        vehiclePlate: this.state.details.vehiclePlate,
        purpose: this.state.details.purpose,
        formSubmit: this.state.details.formSubmit,
        enterTime: this.state.modalDate,
        exitTime: this.state.details.exitTime,
        deactivated: this.state.details.deactivated,
        baseImg: this.state.details.baseImg
      }
    })
    .then(res => {
      console.log("Added to Scanned DB: ", res);
      this.setState({
        showModal: true,
        modalBody: this.state.details.name + " " + this.state.details.vehiclePlate + " entered !",
        modalType: "entered",
        modalDate: "",
        blackout: true,
      });
    })
    .catch(err => {
      console.log("Error Adding to Scanned DB: ", err);
      this.setState({blackout: true, error: true, modalBody: "Error Adding to Scanned User DB!", showModal: true})
    });
  }

  entering() {
    this.setState({showModal: false, blackout: false});
    console.log("ENTERED!!!!!");
    axios.post('/delete', {
      table: "user_details",
      query: {
        id: this.state.details.id
      }
    })
    .then(res => {console.log("Deleted in DB: ", res); this.addToScanned()})
    .catch(err => {console.log("Error Deleting User Details: ", err); this.setState({blackout: true, error: true, modalBody: "Error Deleting User Details!", showModal: true})});
  }

  leaving() {
    this.setState({showModal: false, blackout: false});
    console.log("LEAVE!!!!!", this.state.details.id);
    axios.post('/update', {
      table: "scanned_user",
      id: this.state.details.id,
      newvalues: {
        $set:{
          exitTime: this.state.modalDate
        }
      }
    })
    .then(res => {
      console.log("Updated in Scanned DB: ", res);
      this.setState({
        showModal: true,
        modalBody: this.state.details.name + " " + this.state.details.vehiclePlate + " leaved !",
        modalType: "leaved",
        modalDate: "",
        blackout: true,
      });
    })
    .catch(err => {console.log("Error Update to Scanned User DB: ", err); this.setState({blackout: true, error: true, modalBody: "Error Update to Scanned User DB!", showModal: true})});
  }

  getDateWhenEnter() {
    var date = Date.now();
    this.setState({
      showModal: true,
      blackout: true,
      modalBody: "Allow driver enter at " + unixToString(date) + "?" ,
      modalType: "entering",
      modalDate: date,
    })
  }

  getDateWhenExit() {
    var date = Date.now();
    this.setState({
      showModal: true,
      blackout: true,
      modalBody: "Allow driver leave at " + unixToString(Date.now()) + "?" ,
      modalType: "leaving",
      modalDate: date,
    })
  }

  render() {
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
                this.state.modalType == "entering" ?
                  <div>
                    <Button onClick={ () => {this.setState({showModal: false, blackout: false})} }>
                      Close
                    </Button>
                    <Button onClick={this.entering}>
                      OK
                    </Button>
                  </div>
                :
                  this.state.modalType == "leaving" ?
                    <div>
                      <Button onClick={ () => {this.setState({showModal: false, blackout: false})} }>
                        Close
                      </Button>
                      <Button onClick={this.leaving}>
                        OK
                      </Button>
                    </div>
                  :
                    (this.state.modalType == "entered" || this.state.modalType == "leaved") &&
                      <div>
                        <Button onClick={ () => {this.props.history.push("/dashboard");} }>
                          Go To Dashboard
                        </Button>
                      </div>
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
                    <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                      QR Verification
                    </Typography>
                    <IconButton
                      color="inherit"
                      onClick={() => {this.props.history.push('/dashboard')}}
                    >
                      <DashboardIcon />
                    </IconButton>
                  </Toolbar>
                </AppBar>
                <main className={classes.layout}>
                  <div className={classes.heroContent}>
                    <img
                      src="https://clipart.wpblink.com/sites/default/files/wallpaper/red-cross-clipart/172409/red-cross-clipart-invalid-172409-5363307.jpg"
                      alt="Invalid"
                      height="200px"
                      width="200px"
                    />
                    <h6 style={{color: "#1b2a6e", fontSize: "2rem", fontWeight: 500, marginTop: "30px", marginBottom: "30px"}}>The Scanned QR Code Is Invalid!</h6>
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
                        <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                          QR Verification
                        </Typography>
                        <IconButton
                          color="inherit"
                          style={{padding: "0.44rem 1.04rem"}}
                          onClick={() => {this.props.history.push('/dashboard')}}
                        >
                          <DashboardIcon />
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
                        <h6 style={{color: "#1b2a6e", fontSize: "2rem", fontWeight: 500, marginTop: "30px", marginBottom: "30px"}}>The Scanned QR Code Has Been Deactivated!</h6>
                      </div>
                    </main>
                  </React.Fragment>
                :
                  (this.state.details.enterTime && this.state.details.exitTime) ?
                    <React.Fragment>
                      <CssBaseline />
                      <AppBar position="static" color="default" className={classes.appBar}>
                        <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
                          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                            QR Verification
                          </Typography>
                          <IconButton
                            color="inherit"
                            style={{padding: "0.44rem 1.04rem"}}
                            onClick={() => {this.props.history.push('/dashboard')}}
                          >
                            <DashboardIcon />
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
                                  <p>ID: <b>{this.state.details.id}</b></p>
                                  <p>Register Time: <b>{unixToString(this.state.details.formSubmit)}</b></p>
                                  {
                                    this.state.details.enterTime ?
                                      <p>Enter Time: <b style={{color: "#03C04A", fontWeight: 500}}>{unixToString(this.state.details.enterTime)}</b></p>
                                    :
                                      <p>Enter Time: <b style={{color: "#D50000", fontWeight: 500}}>NOT YET ENTER</b></p>
                                  }
                                  {
                                    this.state.details.exitTime ?
                                      <p>Exit Time: <b style={{color: "#03C04A", fontWeight: 500}}>{unixToString(this.state.details.exitTime)}</b></p>
                                    :
                                      <p>Exit Time: <b style={{color: "#D50000", fontWeight: 500}}>NOT YET EXIT</b></p>
                                  }
                                  <p>Name: <b>{this.state.details.name}</b></p>
                                  <p>Email: <b>{this.state.details.email}</b></p>
                                  <p>Contact No.: <b>{this.state.details.contact}</b></p>
                                </div>
                                <div style={{margin: "10px 30px", fontWeight: 700}}>
                                  <h7><b>Vehicle Details</b></h7>
                                </div>
                                <div style={{margin: "20px 55px"}}>
                                  <p>Type of Vehicle:
                                    <b> {
                                      this.state.details.otherVehicleType ?
                                        " " + this.state.details.otherVehicleType
                                      :
                                        " " + this.state.details.vehicleType
                                    } </b>
                                  </p>
                                  <p>Vehicle Plate No.: <b>{this.state.details.vehiclePlate}</b></p>
                                </div>
                              </div>
                            </Paper>
                          </main>
                        </div>
                      </main>
                    </React.Fragment>
                  :
                    <React.Fragment>
                      <CssBaseline />
                      <AppBar position="static" color="default" className={classes.appBar}>
                        <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
                          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                            QR Verification
                          </Typography>
                          <IconButton
                            color="inherit"
                            style={{padding: "0.44rem 1.04rem"}}
                            onClick={() => {this.props.history.push('/dashboard')}}
                          >
                            <DashboardIcon />
                          </IconButton>
                        </Toolbar>
                      </AppBar>
                      <main className={classes.layout}>
                        <div className={classes.heroContent}>
                          {
                            (this.state.details.enterTime == "" && this.state.details.exitTime == "") ?
                              <div>
                                <Button
                                  variant="success"
                                  size="lg"
                                  onClick={this.getDateWhenEnter}
                                >
                                  Enter Campus
                                </Button>
                              </div>
                          :
                            (this.state.details.enterTime && this.state.details.exitTime == "") &&
                              <div>
                                <Button
                                  variant="danger"
                                  size="lg"
                                  onClick={this.getDateWhenExit}
                                >
                                  Leave Campus
                                </Button>
                              </div>
                          }
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
                                  <p>ID: <b>{this.state.details.id}</b></p>
                                  <p>Register Time: <b>{unixToString(this.state.details.formSubmit)}</b></p>
                                  {
                                    this.state.details.enterTime ?
                                      <p>Enter Time: <b style={{color: "#03C04A", fontWeight: 500}}>{unixToString(this.state.details.enterTime)}</b></p>
                                    :
                                      <p>Enter Time: <b style={{color: "#D50000", fontWeight: 500}}>NOT YET ENTER</b></p>
                                  }
                                  {
                                    this.state.details.exitTime ?
                                      <p>Exit Time: <b style={{color: "#03C04A", fontWeight: 500}}>{unixToString(this.state.details.exitTime)}</b></p>
                                    :
                                      <p>Exit Time: <b style={{color: "#D50000", fontWeight: 500}}>NOT YET EXIT</b></p>
                                  }
                                  <p>Name: <b>{this.state.details.name}</b></p>
                                  <p>IC / Passport No.: <b>{this.state.details.ic}</b></p>
                                  <p>Gender: <b>{this.state.details.gender}</b></p>
                                  <p>Email: <b>{this.state.details.email}</b></p>
                                  <p>Contact No.: <b>{this.state.details.contact}</b></p>
                                  <p>Type of Visitor:
                                    <b> {
                                      this.state.details.othersVisitor ?
                                        " " + this.state.details.othersVisitor
                                      :
                                        " " + this.state.details.visitor
                                    } </b>
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
                                    <b> {
                                      this.state.details.otherVehicleType ?
                                        " " + this.state.details.otherVehicleType
                                      :
                                        " " + this.state.details.vehicleType
                                    } </b>
                                  </p>
                                  <p>Vehicle Plate No.: <b>{this.state.details.vehiclePlate}</b></p>
                                  <p>Purpose of Entering Campus: <b>{this.state.details.purpose}</b></p>
                                </div>
                              </div>
                            </Paper>
                          </main>
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

export default enhance(QRaccess);
