import React, { Component } from "react";
import axios from "axios";
import { QRCode } from 'react-qrcode-logo';
import { MDBCol, MDBInput } from "mdbreact";
import './Registration.css';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import HomeIcon from '@material-ui/icons/Home'
import Grid from '@material-ui/core/Grid';
import AddModal from './Modal/Modal';
import PropTypes from 'prop-types';
import ReactLoading from "react-loading";
import { unixToString } from "./../../service/unixTimeConverter";

const styles = theme => ({
  appBar: {
    position: 'relative',
    backgroundColor: "#1b2a6e"
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3,
    },
  },
  stepper: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
  },
  margin: {
    margin: theme.spacing.unit,
  },
});

function getSteps() {
  return ['Personal Details', 'Passenger Details', 'Vehicle Details', 'Check Details', 'QR Code'];
}

const initialState = {
  from: "University Online Vechile Registration <me@samples.mailgun.org>",
  subject: "Registered QR Code",
  inputName: "",
  inputEmail: "",
  inputIC: "",
  inputContact: "",
  inputGender: "",
  inputVisitor: "",
  inputOthersVisitor: "",
  inputPassenger: 0,
  passengers: [
    {index:"0", name:"", ic:""},
    {index:"1", name:"", ic:""},
    {index:"2", name:"", ic:""},
    {index:"3", name:"", ic:""},
    {index:"4", name:"", ic:""},
    {index:"5", name:"", ic:""},
    {index:"6", name:"", ic:""},
    {index:"7", name:"", ic:""},
  ],
  inputVehicleType: "",
  inputOthersVehicleType: "",
  inputVehiclePlate: "",
  inputPurpose: "",
  unixEmail: "",
  uniqueID: "",
  formSubmit: "",
  ipAddress: "",
  userID: "",
  baseImg: "",
  activeStep: 0,
  skipped: new Set(),
  showModal: false,
  emailSent: false,
  error: false,
  blackout: false,
  modalBody: "",
  errorSentEmail: false,
  validatedEmail: "",
  errorEmail: false,
};

class Registration extends Component {
  // initialize state
  constructor(props){
    super(props)
    this.state = initialState;

    this.sendEmail = this.sendEmail.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getBase64 = this.getBase64.bind(this);
    this.download = this.download.bind(this);
    this.increasePassenger = this.increasePassenger.bind(this);
    this.decreasePassenger = this.decreasePassenger.bind(this);
    this.isPassengersInvalid = this.isPassengersInvalid.bind(this);
    this.afterDidMount = this.afterDidMount.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
  }

  afterDidMount() {
    this.setState(initialState);

    axios.post('/getIP', {})
    .then(res => {console.log("My IP: ", res.data); this.setState({ipAddress: res.data})})
    .catch(err => {console.log("Failed IP: ", err); this.setState({blackout: true, error: true, modalBody: "Error Looking for IP Address!", showModal: true})});
  }

  componentDidMount() {
    this.afterDidMount();
  }

  download = () => {
      console.log("CLICKED");
      const canvas: any = document.querySelector('.HpQrcode > canvas');
      console.log("IMage canvas: ", this.downloadRef.href);
      this.downloadRef.href = canvas.toDataURL();
      console.log("IMage URL: ", this.downloadRef.href);
      this.downloadRef.download = 'mypainting.png';
      console.log("IMage: ", this.downloadRef);
  }

  sendEmail = () => {
    var base64 = this.state.ipAddress.lanUrl+"qrimage/"+this.state.userID;
    var registerTime = unixToString(this.state.formSubmit);

    var htmlString = "<html xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\" style=\"font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\r\n<head>\r\n<meta name=\"viewport\" content=\"width=device-width\" \/>\r\n<meta http-equiv=\"Content-Type\" content=\"text\/html; charset=UTF-8\" \/>\r\n<title>Actionable emails e.g. reset password<\/title>\r\n\r\n\r\n<style type=\"text\/css\">\r\nimg {\r\nmax-width: 100%;\r\n}\r\nbody {\r\n-webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em;\r\n}\r\nbody {\r\nbackground-color: #f6f6f6;\r\n}\r\n@media only screen and (max-width: 640px) {\r\n  body {\r\n    padding: 0 !important;\r\n  }\r\n  h1 {\r\n    font-weight: 800 !important; margin: 20px 0 5px !important;\r\n  }\r\n  h2 {\r\n    font-weight: 800 !important; margin: 20px 0 5px !important;\r\n  }\r\n  h3 {\r\n    font-weight: 800 !important; margin: 20px 0 5px !important;\r\n  }\r\n  h4 {\r\n    font-weight: 800 !important; margin: 20px 0 5px !important;\r\n  }\r\n  h1 {\r\n    font-size: 22px !important;\r\n  }\r\n  h2 {\r\n    font-size: 18px !important;\r\n  }\r\n  h3 {\r\n    font-size: 16px !important;\r\n  }\r\n  .container {\r\n    padding: 0 !important; width: 100% !important;\r\n  }\r\n  .content {\r\n    padding: 0 !important;\r\n  }\r\n  .content-wrap {\r\n    padding: 10px !important;\r\n  }\r\n  .invoice {\r\n    width: 100% !important;\r\n  }\r\n}\r\n<\/style>\r\n<\/head>\r\n\r\n<body itemscope itemtype=\"http:\/\/schema.org\/EmailMessage\" style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;\" bgcolor=\"#f6f6f6\">\r\n                    \r\n<table class=\"body-wrap\" style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;\" bgcolor=\"#f6f6f6\"><tr style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\"><td style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;\" valign=\"top\"><\/td>\r\n    <td class=\"container\" width=\"600\" style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;\" valign=\"top\">\r\n      <div class=\"content\" style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;\">\r\n        <table class=\"main\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" itemprop=\"action\" itemscope itemtype=\"http:\/\/schema.org\/ConfirmAction\" style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;\" bgcolor=\"#fff\"><tr style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\"><td class=\"content-wrap\" style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;\" valign=\"top\">\r\n              <meta itemprop=\"name\" content=\"Confirm Email\" style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\" \/><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\"><tr style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\"><td class=\"content-block\" style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">\r\n                    <img src=\" "+ this.state.baseImg +"\" alt=\"QR Code\" title=\"QR Code\" style=\"display:block\" width=\"128\" height=\"128\" \/>\r\n                  <\/td>\r\n                <\/tr><tr style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\"><td class=\"content-block\" itemprop=\"handler\" itemscope itemtype=\"http:\/\/schema.org\/HttpActionHandler\" style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">\r\n                    <a href=\" "+ base64 +"\" class=\"btn-primary\" itemprop=\"url\" style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; color: #FFF; text-decoration: none; line-height: 2em; font-weight: bold; text-align: center; cursor: pointer; display: inline-block; border-radius: 5px; text-transform: capitalize; background-color: #348eda; margin: 0; border-color: #348eda; border-style: solid; border-width: 10px 20px;\">For Gmail, Click here for the QR Code.<\/a>\r\n                  <\/td>\r\n                <\/tr><tr style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\"><td class=\"content-block\" style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">\r\n                    Name:<b>\ "+ this.state.inputName +"\<\/b>\r\n                  <\/td>\r\n                <\/tr><tr style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\"><td class=\"content-block\" style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">\r\n                    Email:<b>\ "+ this.state.inputEmail +"\<\/b>\r\n                  <\/td>\r\n                <\/tr><tr style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\"><td class=\"content-block\" style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">\r\n                    Vehicle Plate:<b>\ "+ this.state.inputVehiclePlate +"\<\/b>\r\n                  <\/td>\r\n                <\/tr><tr style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\"><td class=\"content-block\" style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">\r\n                    Registration Time:<b>\ "+ registerTime +"\<\/b>\r\n                  <\/td>\r\n                <\/tr><\/table><\/td>\r\n          <\/tr><\/table><div class=\"footer\" style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;\">\r\n          <table width=\"100%\" style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\"><tr style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\"><td class=\"aligncenter content-block\" style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; vertical-align: top; color: #999; text-align: center; margin: 0; padding: 0 0 20px;\" align=\"center\" valign=\"top\">@University Online Vechile Registration 2019.<\/td>\r\n            <\/tr><\/table><\/div><\/div>\r\n    <\/td>\r\n    <td style=\"font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;\" valign=\"top\"><\/td>\r\n  <\/tr><\/table><\/body>\r\n<\/html>";

    const myData = {
      from: this.state.from,
      to: this.state.inputEmail,
      subject: this.state.subject,
      html: htmlString
    };

    fetch('http://' + this.state.ipAddress.ip + ':3001/sent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': 'inline'
          },
          body: JSON.stringify({
            data: myData
          })
    })
    .then(response => {console.log('Email Sent Success: ', response); this.setState({showModal: true, emailSent: true})})
    .catch(error => {console.log('Email Sent Error: ', error); this.setState({blackout: true, showModal: true, errorSentEmail: true})})
  }

  getBase64 = () => {
    const canvas: any = document.querySelector('.HpQrcode > canvas');
    let downloadRef = canvas.toDataURL();
    console.log("IMage URL: ", downloadRef);

    axios.post('/updateImg', {
      table: "user_details",
      id: this.state.userID,
      newvalues: {
        $push:{
          baseImg: downloadRef
        },
        $set:{
          id: this.state.userID
        }
      }
    })
    .then(res => {console.log("Update Result: ", res); this.setState({baseImg: downloadRef}); this.sendEmail()})
    .catch(err => {console.log("Error Update: ", err); this.setState({blackout: true, error: true, modalBody: "Error Updating QR Image to DB!", showModal: true})});
  }

  setQR() {
    console.log("Start set QR!!!");
    console.log("Unique ID: ", this.state.uniqueID);

    axios.post('/find', {
      table: "user_details",
      query: {
        id: this.state.uniqueID
      }
    })
    .then(res => {console.log("Find Result: ", res); this.setState({userID: res.data[0]._id}); this.getBase64()})
    .catch(err => {console.log("Error Find: ", err); this.setState({blackout: true, error: true, modalBody: "Error Find for User Details!", showModal: true})});
  }

  validateEmail(value){{
      console.log('Validate EMail: ', value);
      axios.post('/validateEmail', {
        email: value
      })
      .then(response => {console.log('Validate Success: ', response); this.setState({validatedEmail: response.data.mailbox_verification}); this.handleNext()})
      .catch(error => {console.log('Validate Error: ', error)})
    }
  }

  onChange = name => event => {
    if(name == "inputEmail"){
      var unixEmail = event.target.value + Date.now();
      this.setState({
        errorEmail: false,
        inputEmail: event.target.value,
        unixEmail
      });
    }else if(name == "inputVisitor"){
      this.setState({
        inputVisitor: event.target.value,
        inputOthersVisitor: "",
        inputPassenger: 0
      })
    }else if(name == "inputVehicleType"){
      this.setState({
        inputVehicleType: event.target.value,
        inputVehiclePlate: "",
      });
    }else {
      this.setState({
        [name]: event.target.value,
      });
    }
  };

  handleSubmit() {

    const {
      inputName,
      inputEmail,
      inputIC,
      inputContact,
      inputGender,
      inputVisitor,
      inputOthersVisitor,
      inputPassenger,
      passengers,
      inputVehicleType,
      inputOthersVehicleType,
      inputVehiclePlate,
      inputPurpose,
      unixEmail
    } = this.state;

    var uniqueID = Date.now() + unixEmail;
    var dateNow = Date.now();

    console.log("MY Name Input: ", inputName);
    console.log("MY Email Input: ", inputEmail);
    console.log("MY Car Plate Input: ", inputVehiclePlate);
    console.log("MY Unix Email: ", unixEmail);
    console.log("Unique ID: ", uniqueID);

      axios.post('/add', {
        table: "user_details",
        query: {
          id: uniqueID,
          name: inputName,
          email: inputEmail,
          ic: inputIC,
          contact: inputContact,
          gender: inputGender,
          visitor: inputVisitor,
          othersVisitor: inputOthersVisitor,
          passenger: inputPassenger,
          passengersInfo: passengers,
          vehicleType: inputVehicleType,
          otherVehicleType: inputOthersVehicleType,
          vehiclePlate: inputVehiclePlate,
          purpose: inputPurpose,
          formSubmit: dateNow,
          enterTime: "",
          exitTime: "",
          deactivated: false,
        }
      })
      .then(res => {console.log("Added to DB: ", res); this.setState({uniqueID, formSubmit: dateNow}); this.setQR()})
      .catch(err => {console.log("Error Adding: ", err); this.setState({blackout: true, error: true, modalBody: "Error Adding User Details to DB!", showModal: true})});

  }

  handleNext = () => {
    const { activeStep } = this.state;
    let { skipped } = this.state;
    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values());
      skipped.delete(activeStep);
    }
    if( activeStep == 0){
      if(this.state.validatedEmail === 'true'){
        if(this.state.inputPassenger == 0){
          this.setState({
            activeStep: activeStep + 2,
            skipped,
          });
        }else{
          this.setState({
            activeStep: activeStep + 1,
            skipped,
          });
        }
      }else{
        this.setState({showModal: true, errorEmail: true})
      }
    }else if( activeStep == 3){
      this.setState({
        activeStep: activeStep + 1,
        skipped,
      });
      this.handleSubmit();
    }else {
      this.setState({
        activeStep: activeStep + 1,
        skipped,
      });
    }
  };

  handleBack = () => {
    const { activeStep } = this.state;
    if( activeStep == 2){
      if(this.state.inputPassenger == 0){
        this.setState({
          activeStep: activeStep - 2,
        });
      }else{
        this.setState({
          activeStep: activeStep - 1,
        });
      }
    }else if( activeStep == 1){
        this.setState({
          passengers: [
            {index:"0", name:"", ic:""},
            {index:"1", name:"", ic:""},
            {index:"2", name:"", ic:""},
            {index:"3", name:"", ic:""},
            {index:"4", name:"", ic:""},
            {index:"5", name:"", ic:""},
            {index:"6", name:"", ic:""},
            {index:"7", name:"", ic:""},
          ],
          activeStep: activeStep - 1,
        });
    }else{
      this.setState({
        activeStep: activeStep - 1,
      });
    }
  };

  handleReset = () => {
    this.setState(initialState);
    this.setState({
      activeStep: 0,
    });
  };

  isStepSkipped(step) {
    return this.state.skipped.has(step);
  }

  handlePassengerNameChange(e, i){
    let myPassengers = this.state.passengers.map( (passenger) => {
      if(passenger.index == i){
        return {
          index: passenger.index,
          name: e.target.value,
          ic: passenger.ic,
        }
      }else{
        return {
          index: passenger.index,
          name: passenger.name,
          ic: passenger.ic,
        }
      }
    });
    this.setState({passengers: myPassengers});
  }

  handlePassengerIcChange(e, i){
    let myPassengers = this.state.passengers.map( (passenger) => {
      if(passenger.index == i){
        return {
          index: passenger.index,
          name: passenger.name,
          ic: e.target.value,
        }
      }else{
        return {
          index: passenger.index,
          name: passenger.name,
          ic: passenger.ic,
        }
      }
    });
    this.setState({passengers: myPassengers});
  }

  loopPassenger(){
    var rows = [];
    for (let i = 0; i < this.state.inputPassenger; i++) {
      let passenger = "passenger" + i;
      rows.push(
        <Grid item xs={12} sm={6}>
          <h4><b>Passenger {i+1}</b></h4>
          <MDBInput
            label="Passenger Name"
            className="mt-4"
            type="text"
            onChange={ (event) => this.handlePassengerNameChange(event, i)}
            value={this.state.passengers[i].name}
          />
          <MDBInput
            label="Passenger IC"
            className="mt-4"
            type="text"
            validate
            onChange={ (event) => this.handlePassengerIcChange(event, i)}
            value={this.state.passengers[i].ic}
          />
        </Grid>
      );
    }
    return rows;
  }

  increasePassenger() {
    if(this.state.inputPassenger < 8)
      this.setState({inputPassenger: this.state.inputPassenger+1});
  }

  decreasePassenger() {
    if(this.state.inputPassenger > 0)
      this.setState({inputPassenger: this.state.inputPassenger-1});
  }

  getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <React.Fragment>
            <Typography variant="h8" style={{color: "#1b2a6e", fontSize: "2rem", fontWeight: 500, marginTop: "10px", marginBottom: "30px"}} gutterBottom>
              Personal Details
            </Typography>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={6}>
                <label
                  htmlFor="defaultFormRegisterNameEx"
                  style={{color: "black"}}
                >
                  <b>
                    Name
                  </b>
                </label>

                <input
                  value={this.state.inputName}
                  name="name"
                  onChange={this.onChange('inputName')}
                  type="text"
                  id="defaultFormRegisterNameEx"
                  className="form-control"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <label
                  htmlFor="defaultFormRegisterNameEx"
                  style={{color: "black"}}
                >
                  <b>
                    Gender
                  </b>
                </label>

                <select className="browser-default custom-select" onChange={this.onChange('inputGender')}>
                  <option disabled selected value="">{this.state.inputGender}</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <label
                  htmlFor="defaultFormRegisterNameEx"
                  style={{color: "black"}}
                >
                  <b>
                    IC / Passport No.
                  </b>
                </label>

                <input
                  value={this.state.inputIC}
                  name="ic"
                  onChange={this.onChange('inputIC')}
                  type="text"
                  id="defaultFormRegisterNameEx"
                  className="form-control"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <label
                  htmlFor="defaultFormRegisterNameEx"
                  style={{color: "black"}}
                >
                  <b>
                    Contact No.
                  </b>
                </label>

                <input
                  value={this.state.inputContact}
                  name="contact"
                  onChange={this.onChange('inputContact')}
                  type="text"
                  id="defaultFormRegisterNameEx"
                  className="form-control"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                {
                  this.state.errorEmail ?
                    <label
                      htmlFor="defaultFormRegisterNameEx"
                      style={{color: "black"}}
                    >
                      <b>
                        Email
                      </b>
                      <span style={{color: "red"}}>   * Invalid Email </span>
                    </label>
                  :
                  <label
                    htmlFor="defaultFormRegisterNameEx"
                    style={{color: "black"}}
                  >
                    <b>
                      Email
                    </b>
                  </label>
                }
                <input
                  value={this.state.inputEmail}
                  name="email"
                  onChange={this.onChange('inputEmail')}
                  type="email"
                  id="defaultFormRegisterNameEx"
                  className="form-control"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <label
                  htmlFor="defaultFormRegisterNameEx"
                  style={{color: "black"}}
                >
                  <b>
                    Type of Visitor
                  </b>
                </label>

                <select className="browser-default custom-select" onChange={this.onChange('inputVisitor')}>
                  <option disabled selected value="">{this.state.inputVisitor}</option>
                  <option value="Student">Student</option>
                  <option value="Parent">Parent</option>
                  <option value="Contractor">Contractor</option>
                  <option value="Event Crew">Event Crew</option>
                  <option value="Others">Others</option>
                </select>
              </Grid>
              {this.state.inputVisitor === "Others" &&
                <Grid item xs={12}>
                  <input
                    value={this.state.inputOthersVisitor}
                    name="othersVisitor"
                    onChange={this.onChange('inputOthersVisitor')}
                    type="text"
                    id="defaultFormRegisterNameEx"
                    className="form-control"
                    placeholder="Others Type of Visitor (Please Specify Here)"
                    required
                  />
                </Grid>
              }
              {
                (
                  this.state.inputVisitor === "Contractor" ||
                    this.state.inputVisitor === "Event Crew" ||
                      (this.state.inputVisitor === "Others" && this.state.inputOthersVisitor.length > 0 )
                )&&
                  <Grid item xs={12}>
                    <label
                      htmlFor="defaultFormRegisterNameEx"
                      style={{color: "black"}}
                    >
                      <b>
                      No. of Passenger
                      </b>
                    </label>

                    <div className="counter">

                      <input
                        style={{width: "30%",padding: "20px 20px"}}
                        value={this.state.inputPassenger}
                        name="othersVisitor"
                        onChange={this.onChange('inputPassenger')}
                        type="text"
                        id="defaultFormRegisterNameEx"
                        className="form-control"
                        required
                        disabled
                      />

                      <button
                        style={{padding: "10px 20px"}}
                        onClick = {this.increasePassenger}
                        className="counter-action increment"
                      >
                        +
                      </button>
                      <button
                        style={{padding: "10px 20px"}}
                        onClick = {this.decreasePassenger}
                        className="counter-action decrement"
                      >
                        -
                      </button>
                    </div>
                  </Grid>
              }
          </Grid>
        </React.Fragment>
      );
      case 1:
        return (
          <React.Fragment>
            <Typography variant="h8" style={{color: "#1b2a6e", fontSize: "2rem", fontWeight: 500, marginTop: "10px", marginBottom: "30px"}} gutterBottom>
              Passenger Details
            </Typography>
            <Grid container spacing={24}>
              {
                this.state.inputPassenger > 0 && (
                  this.loopPassenger()
                )
              }
            </Grid>
          </React.Fragment>
        );
      case 2:
        return (
          <React.Fragment>
            <Typography variant="h8" style={{color: "#1b2a6e", fontSize: "2rem", fontWeight: 500, marginTop: "10px", marginBottom: "30px"}} gutterBottom>
              Vehicle Details
            </Typography>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={6}>
                <label
                  htmlFor="defaultFormRegisterNameEx"
                  style={{color: "black"}}
                >
                  <b>
                    Type of Vehicle
                  </b>
                </label>
                <select className="browser-default custom-select" onChange={this.onChange('inputVehicleType')}>
                  <option disabled selected value="">{this.state.inputVehicleType}</option>
                  <option value="Car">Car</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Van">Van</option>
                  <option value="Truck">Truck</option>
                  <option value="Bicycle">Bicycle</option>
                  <option value="Others">Others</option>
                </select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <label
                  htmlFor="defaultFormRegisterNameEx"
                  style={{color: "black"}}
                >
                  <b>
                    Vehicle Plate No.
                  </b>
                </label>
                {
                  this.state.inputVehicleType == "Bicycle" ?
                    <input
                      value= ""
                      name="vehiclePlateNo."
                      type="text"
                      id="defaultFormRegisterNameEx"
                      className="form-control"
                      disabled
                      required
                    />
                  :
                    <input
                      value={this.state.inputVehiclePlate}
                      name="vehiclePlateNo."
                      onChange={this.onChange('inputVehiclePlate')}
                      type="text"
                      id="defaultFormRegisterNameEx"
                      className="form-control"
                      required
                    />
                }
              </Grid>
              <Grid item xs={12} sm={6}>
                {this.state.inputVehicleType === "Others" &&
                  <input
                    value={this.state.inputOthersVehicleType}
                    name="othersVehicle"
                    onChange={this.onChange('inputOthersVehicleType')}
                    type="text"
                    id="defaultFormRegisterNameEx"
                    className="form-control"
                    placeholder="Others Type of Vehicle (Please Specify Here)"
                    required
                  />
                }
              </Grid>
              <Grid item xs={12}>
                <label
                  htmlFor="defaultFormRegisterNameEx"
                  style={{color: "black"}}
                >
                  <b>
                    Purpose of Entering Campus
                  </b>
                </label>
                <input
                  value={this.state.inputPurpose}
                  name="purpose"
                  onChange={this.onChange('inputPurpose')}
                  type="text"
                  id="defaultFormRegisterNameEx"
                  className="form-control"
                  required
                />
              </Grid>
            </Grid>
          </React.Fragment>
        );
      case 3:
        return (
          <React.Fragment>
            <Typography variant="h8" style={{color: "#1b2a6e", fontSize: "2rem", fontWeight: 500, marginTop: "10px", marginBottom: "30px"}} gutterBottom>
              Check & Submit Details
            </Typography>
            <div style={{margin: "10px 30px", fontWeight: 700}}>
              <h7><b>Personal Details</b></h7>
            </div>
            <div style={{margin: "20px 55px"}}>
              <p>Name: <b>{this.state.inputName}</b></p>
              <p>IC / Passport No.: <b>{this.state.inputIC}</b></p>
              <p>Gender: <b>{this.state.inputGender}</b></p>
              <p>Email: <b>{this.state.inputEmail}</b></p>
              <p>Contact No.: <b>{this.state.inputContact}</b></p>
              <p>Type of Visitor:
                <b>{
                  this.state.inputOthersVisitor ?
                    " " + this.state.inputOthersVisitor
                  :
                    " " + this.state.inputVisitor
                }</b>
              </p>
              {
                (this.state.inputVisitor !== "Student" && this.state.inputVisitor !== "Parent") &&
                  <p>Number of Passenger.: <b>{this.state.inputPassenger}</b></p>
              }
            </div>
            {
              this.state.inputPassenger > 0 &&
                <div>
                  <div style={{margin: "10px 30px", fontWeight: 700}}>
                    <h7><b>Passenger Details</b></h7>
                  </div>
                  <div style={{margin: "20px 55px"}}>
                  {
                    this.state.passengers.map( (passenger) => {
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
                  this.state.inputOthersVehicleType ?
                    " " + this.state.inputOthersVehicleType
                  :
                    " " + this.state.inputVehicleType
                }</b>
              </p>
              <p>Vehicle Plate No.: <b>{this.state.inputVehiclePlate}</b></p>
              <p>Purpose of Entering Campus: <b>{this.state.inputPurpose}</b></p>
            </div>
          </React.Fragment>
        );
      case 4:
        return (
          <React.Fragment>
            <Typography variant="h8" style={{color: "#1b2a6e", fontSize: "2rem", fontWeight: 500, marginTop: "10px", marginBottom: "30px"}} gutterBottom>
              QR Code
            </Typography>
            <img src={this.state.baseImg} alt="QR Code" title="QR Code" style="display:block" width="128" height="128" />
          </React.Fragment>
        );
      default:
        return 'Unknown step';
    }
  }

  isPassengersInvalid() {
    let invalid = false;
    for (let i = 0; i < this.state.inputPassenger; i++) {
      if(this.state.passengers[i].name == "" || this.state.passengers[i].ic == ""){
        invalid = true;
        break;
      }
    }
    return invalid;
  }

  render() {
    var qrCode = this.state.ipAddress.lanUrl;
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;
    const isPersonalInvalid = this.state.inputName === '' || this.state.inputIC === '' || this.state.inputEmail === '' || this.state.inputGender === '' || this.state.inputContact === '' || this.state.inputVisitor === '' ;
    const isOthersVisitorInvaid = this.state.inputName === '' || this.state.inputIC === '' || this.state.inputEmail === '' || this.state.inputGender === '' || this.state.inputContact === '' || this.state.inputOthersVisitor === '';
    const isVehicleInvalid = this.state.inputVehicleType === '' || this.state.inputPurpose === '';
    const isPlateInvalid = this.state.inputVehicleType === '' || this.state.inputPurpose === '' || this.state.inputVehiclePlate === '';
    const isOthersVehicleInvaid = this.state.inputVehiclePlate === '' || this.state.inputPurpose === '' || this.state.inputOthersVehicleType === '';
    return(
      <div>
        <Modal show={this.state.showModal} onHide={this.handleClose} style={{paddingTop: "100px"}}>
          <Modal.Header>
            <Modal.Title>Note</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              this.state.error ?
                <p>{this.state.modalBody}</p>
              :
                this.state.errorSentEmail ?
                  <div>
                    <p>Failed Sending QR Code to Email: <b>{this.state.inputEmail}</b>!</p>
                    <p>Please Register Again.</p>
                  </div>
                :
                  this.state.errorEmail ?
                    <div>
                      <p>Invalid Email: <b>{this.state.inputEmail}</b></p>
                      <p>Please Enter A Valid Email</p>
                    </div>
                  :
                    <p>QR code has been sent to <b>{this.state.inputEmail}</b></p>
            }
          </Modal.Body>
          <Modal.Footer>
            {
              this.state.error ?
               <div>
                 <Button
                   variant="contained"
                   color="primary"
                   onClick={this.afterDidMount}
                  >
                   Refresh
                 </Button>
                </div>
              :
                this.state.errorSentEmail ?
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleReset}
                     >
                      Register Again
                    </Button>
                   </div>
                :
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={ () => {this.setState({showModal: false})} }
                    >
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
            <React.Fragment>
              <CssBaseline />
              <AppBar position="absolute" className={classes.appBar}>
                <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
                  <Typography variant="h6" color="inherit" noWrap>
                    Registration
                  </Typography>
                  <IconButton
                    color="inherit"
                    style={{align: 'right'}}
                    onClick={() => {this.props.history.push('/home')}}
                  >
                    <HomeIcon />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <main className={classes.layout} style={{paddingTop: '20px'}}>
                <Paper style={{margin: '15px 35px', width: "100%"}}>
                  <div style={{
                    padding: '18px 30px',
                    backgroundColor: "#1b2a6e",
                    color: "white",
                    fontSize: 14,
                    textAlign: 'left',
                    borderRadius: '8px 8px 0 0',
                  }}>
                    <Typography variant="h6" className={classes.margin} style={{ textAlign: 'left', color: 'white'}}>
                      Online Vehicle Registration
                    </Typography>
                  </div>
                  <div className={classes.margin} style={{display:'flex', flexDirection: 'column', padding: '15px'}}>
                    <Stepper activeStep={activeStep} className={classes.stepper} style={{paddingTop: "30px"}}>
                      {steps.map((label, index) => {
                        const props = {};
                        const labelProps = {};
                        if (this.isStepSkipped(index)) {
                          props.completed = false;
                        }
                        return (
                          <Step key={label} {...props}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                    <React.Fragment>
                      {activeStep === steps.length-1 ? (
                        <React.Fragment>
                          <Typography variant="h8" style={{color: "#1b2a6e", fontSize: "2rem", fontWeight: 500, marginTop: "10px", marginBottom: "30px"}} gutterBottom>
                            QR Code
                          </Typography>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          {this.getStepContent(activeStep)}
                          <div className={classes.buttons}>
                            <Button
                              disabled={activeStep === 0}
                              color="info"
                              variant="contained"
                              onClick={this.handleBack}
                              className={classes.button}
                            >
                              Back
                            </Button>

                            {
                              activeStep == 0 ?
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => {this.validateEmail(this.state.inputEmail)}}
                                  className={classes.button}
                                  disabled={
                                      this.state.inputVisitor == 'Others' ?
                                        isOthersVisitorInvaid
                                      :
                                        isPersonalInvalid
                                  }
                                >
                                  Next
                                </Button>
                              :
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={this.handleNext}
                                  className={classes.button}
                                  disabled={
                                      activeStep == 2 ?
                                        this.state.inputVehicleType == 'Others' ?
                                          isOthersVehicleInvaid
                                        :
                                          this.state.inputVehicleType == 'Bicycle' ?
                                            isVehicleInvalid
                                          :
                                            isPlateInvalid
                                      :
                                        activeStep == 1 &&
                                          this.isPassengersInvalid()
                                  }
                                >
                                  {activeStep === steps.length-2 ? "Submit" : "Next"}
                                </Button>
                            }


                          </div>
                        </React.Fragment>
                      )}
                      {
                        (this.state.activeStep == 4 && this.state.userID == "") && (
                          <div>
                            <ReactLoading type="spinningBubbles" color="#000000" height={'100px'} width={'100px'}/>
                            <p>Please Wait While Submitting Details</p>
                          </div>
                        )
                      }

                      {this.state.userID &&
                        <div>
                          <div className="HpQrcode">
                            <QRCode
                              value={qrCode+"qraccess/"+this.state.userID}
                              size={186}
                              padding={10}
                              bgColor={"#ffffff"}
                              fgColor={"#000000"}
                              level={"L"}
                              style={{padding: "20px", backgroundColor: "white", marginBottom: "20px"}}
                            />
                          </div>
                          <h6>*The QR Code Will Be Expired In <b style={{fontWeight: 600, color: "#1b2a6e"}}>3 Days</b></h6>
                        </div>
                      }

                      {
                        this.state.emailSent &&
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleReset}
                            className={classes.button}
                          >
                            New Form
                          </Button>
                      }
                    </React.Fragment>
                  </div>
                </Paper>
              </main>
            </React.Fragment>
        }
      </div>
    );
  }
}

const enhance = compose(
  withRouter,
  withStyles((styles)),
);

export default enhance(Registration);
