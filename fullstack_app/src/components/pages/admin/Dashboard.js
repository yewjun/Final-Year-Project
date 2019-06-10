import React, { Component } from "react";
import axios from "axios";
import ReactTable from "react-table";
import {Dropdown, InputGroup, DropdownButton, FormControl} from 'react-bootstrap';
import "react-table/react-table.css";
import { Button, Modal } from 'react-bootstrap';
import { withFirebase } from '../../firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Cookies from 'js-cookie';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import HomeIcon from '@material-ui/icons/Home'
import PersonIcon from '@material-ui/icons/Person';
import Today from '@material-ui/icons/Today';
import TableChartIcon from '@material-ui/icons/TableChart';
import Delete from '@material-ui/icons/Delete';
import Send from '@material-ui/icons/Send';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { unixToString, unixToStringNoSecond } from "./../../service/unixTimeConverter";

const drawerWidth = 240;
var userEmail = "";

const styles = theme => ({
  root: {
    display: 'flex',
  },
  rootTable: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: "#1b2a6e",
    color: "white"
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  mytoolbar: {
    paddingRight: 24,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  table: {
    minWidth: 300,
  },
  tableContainer: {
    height: 320,
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
  cardHeader: {
    backgroundColor: "#1b2a6e",
  },
  cardHeaderText:{
    color: "white",
  },
  cardHeaderTextSize:{
    color: "white",
    fontSize: "25px"
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing.unit * 2,
  },
  paper: {
    margin: '48px 38px',
    backgroundColor: '#1b2a6e',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 6}px ${theme.spacing.unit * 6}px`,
  },
});


function loggedIn() {
  const user = Cookies.get('user');
  userEmail = user;
  if(user) {
    return true;
  }else {
    return false;
  }
}

var initialState = {
  open: false,
  curTime: "",
  getDay: "",
  tab: "dashboard",
  searchText: "",
  allData: [],
  filtered: [],
  scannedData: [],
  sortBy: "",
  showModal: false,
  modalType: "",
  deleteRow: {},
  countData: [],
  countVisitor: [],
  countVehicle: [],
};

class Dashboard extends Component {
  // initialize state
  constructor(props){
    super(props)
    this.state = initialState;
    this.signOut = this.signOut.bind(this);
    this.gotoQrAccess = this.gotoQrAccess.bind(this);
    this.convertToDay = this.convertToDay.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.anotherQuery = this.anotherQuery.bind(this);
    this.combineData = this.combineData.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.afterDidMount = this.afterDidMount.bind(this);
    this.deletedUpdate = this.deletedUpdate.bind(this);
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  convertToDay(day) {
    if(day == 0){
      return "Sunday";
    }else if(day == 1){
      return "Monday";
    }else if(day == 2){
      return "Tuesday";
    }else if(day == 3){
      return "Wednesday";
    }else if(day == 4){
      return "Thursday";
    }else if(day == 5){
      return "Friday";
    }else if(day == 6){
      return "Saturday";
    }
  }

  combineData(){
    var newArray = this.state.allData;
    var num = 1;
    var array = [];
    var countData = [
      {
        title: 'Entered',
        visitors: 0,
      },
      {
        title: 'Exited',
        visitors: 0,
      },
      {
        title: 'Registered',
        visitors: 0,
      },
    ];
    var countVisitor = [
      {
        name: 'Student',
        number: 0,
      },
      {
        name: 'Parent',
        number: 0,
      },
      {
        name: 'Contractor',
        number: 0,
      },
      {
        name: 'Event Crew',
        number: 0,
      },
      {
        name: 'Others',
        number: 0,
      },
    ];
    var countVehicle = [
      {
        name: 'Car',
        number: 0,
      },
      {
        name: 'Motorcycle',
        number: 0,
      },
      {
        name: 'Van',
        number: 0,
      },
      {
        name: 'Truck',
        number: 0,
      },
      {
        name: 'Bicycle',
        number: 0,
      },
      {
        name: 'Others',
        number: 0,
      },
    ];
    this.state.scannedData.map( (data) => {
      newArray.push(data);
    });
    array = newArray.map( (data) => {
      var unixExit, unixEnter, unixRegister, vehicle, visitors;

      if(data.enterTime){
        unixEnter = unixToString(data.enterTime);
        countData[0].visitors++;
      }else{
        unixEnter = "NOT YET ENTER";
      }

      if(data.exitTime){
        unixExit = unixToString(data.exitTime);
        countData[1].visitors++;
      }else{
        unixExit = "NOT YET EXIT";
      }

      if(data.formSubmit){
        unixRegister = unixToString(data.formSubmit);
        countData[2].visitors++;
      }else{
        unixRegister = "NOT REGISTERED";
      }

      if(data.visitor == "Student"){
        countVisitor[0].number++;
      }else if(data.visitor == "Parent"){
        countVisitor[1].number++;
      }else if(data.visitor == "Contractor"){
        countVisitor[2].number++;
      }else if(data.visitor == "Event Crew"){
        countVisitor[3].number++;
      }else if(data.visitor == "Others"){
        countVisitor[4].number++;
      }

      if(data.vehicleType == "Car"){
        countVehicle[0].number++;
      }else if(data.vehicleType == "Motorcycle"){
        countVehicle[1].number++;
      }else if(data.vehicleType == "Van"){
        countVehicle[2].number++;
      }else if(data.vehicleType == "Truck"){
        countVehicle[3].number++;
      }else if(data.vehicleType == "Bicycle"){
        countVehicle[4].number++;
      }else if(data.vehicleType == "Others"){
        countVehicle[5].number++;
      }

      if(data.othersVisitor){
        visitors = data.othersVisitor;
      }else{
        visitors = data.visitor
      }

      if(data.otherVehicleType){
        vehicle = data.otherVehicleType;
      }else{
        vehicle = data.vehicleType;
      }

      return {
        ...data,
        num: num++,
        unixEnter,
        unixExit,
        unixRegister,
        visitors,
        vehicle,
      }
    })
    console.log("newArray: ", newArray);
    console.log("Array: ", array);
    this.setState({
      allData: array,
      filtered: array,
      countData,
      countVisitor,
      countVehicle
    }, this.afterDidMount);
  }

  anotherQuery(){
    axios.post('/find', {
      table: "scanned_user",
      query: {}
    })
    .then(res => {console.log("Find Scanned Result: ", res); this.setState({scannedData: res.data}); this.combineData()})
    .catch(err => console.log("Error Find Scanned: ", err));
  }

  handleSearchChange(e){
    this.setState({searchText: e.target.value}, () => {this.filterList()});
  }

  filterList() {
      // Variable to hold the original version of the list
      let currentList = [];
      // Variable to hold the filtered list before putting into state
      let newList = [];

      // If the search bar isn't empty
      if (this.state.searchText !== "") {
          // Assign the original list to currentList
          currentList = this.state.allData;

          // Use .filter() to determine which items should be displayed
          // based on the search terms
          newList = currentList.filter(item => {
              var lc = "";
              // change current item to lowercase
              if(this.state.sortBy == "Name"){
                 lc = item.name.toLowerCase();
              }else if(this.state.sortBy == "Email"){
                 lc = item.email.toLowerCase();
              }else if(this.state.sortBy == "ID"){
                 lc = item.id;
              }else if(this.state.sortBy == "IC"){
                 lc = item.ic;
              }else if(this.state.sortBy == "Contact"){
                 lc = item.contact;
              }else if(this.state.sortBy == "Gender"){
                 lc = item.gender.toLowerCase();
              }else if(this.state.sortBy == "Visitor"){
                 lc = item.visitors.toLowerCase();
              }else if(this.state.sortBy == "Vehicle"){
                 lc = item.vehicle.toLowerCase();
              }else if(this.state.sortBy == "Plate"){
                 lc = item.vehiclePlate.toLowerCase();
              }

              // change search term to lowercase
              const filter = this.state.searchText.toLowerCase();
              // check to see if the current list item includes the search term
              // If it does, it will be added to newList. Using lowercase eliminates
              // issues with capitalization in search terms and search content
              return lc.includes(filter);
          });
      } else {
          // If the search bar is empty, set newList to original task list
          newList = this.state.allData;
      }

      // Set the filtered state based on what our rules added to newList
      this.setState({filtered: newList});
  }

  afterDidMount(){
    if(this.state.tab != "report"){
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      this.setState({
        allData: [],
        scannedData: [],
      }, () => {
          axios.post('/find', {
            table: "user_details",
            query: {}
          })
          .then(res => {console.log("Find User Result: ", res); this.setState({allData: res.data}); this.anotherQuery()})
          .catch(err => console.log("Error Find User: ", err));
        }
      );
    }
  }

  deletedUpdate(){
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    this.setState({
      allData: [],
      scannedData: [],
    }, () => {
        axios.post('/find', {
          table: "user_details",
          query: {}
        })
        .then(res => {console.log("Find User Result: ", res); this.setState({allData: res.data}); this.anotherQuery()})
        .catch(err => console.log("Error Find User: ", err));
      }
    );
  }

  componentDidMount() {
    console.log("Dashboard Page");
    console.log("Logged in? ", loggedIn());

    setInterval( () => {
      this.setState({
        curTime : unixToString(Date.now()),
        getDay: this.convertToDay(new Date().getDay()),
      });
    }, 1000);

    this.afterDidMount();
  }

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
      searchText: "",
      filtered: this.state.allData
    });
  }

  deleteRow(row){
    this.setState({showModal: false});

    if(row.unixEnter == "NOT YET ENTER"){
      axios.post('/delete', {
        table: "user_details",
        query: {
          id: row.id
        }
      })
      .then(res => {console.log("Deleted in user DB: ", res); this.setState({showModal: true, modalType: "deleted"})})
      .catch(err => console.log("Error Deleting User Details: ", err));

    }else {
      axios.post('/delete', {
        table: "scanned_user",
        query: {
          id: row.id
        }
      })
      .then(res => {console.log("Deleted in scanned DB: ", res); this.setState({showModal: true, modalType: "deleted"})})
      .catch(err => console.log("Error Deleting User Details: ", err));
    }
  }

  signOut() {
    this.props.firebase
      .doSignOut()
      .then(() => {
        Cookies.remove('user');
        this.props.history.push('/login');
        console.log("Logout Success");
      })
      .catch(error => {
        console.log("Logout Failed");
      });
  };

  gotoQrAccess(row){
    const link = '/qraccess/' + row.id;
    this.props.history.push(link);
  }

  render() {
    const { classes } = this.props;
    return(
      <div>
        <Modal show={this.state.showModal} onHide={this.handleClose} style={{paddingTop: "100px"}}>
          <Modal.Header>
            <Modal.Title>Note</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              this.state.modalType == "deleted" ?
                <p><b>ID: {this.state.deleteRow.id}</b> has been deleted.</p>
              :
                this.state.modalType == "delete" &&
                  <p>Do you want to delete <b>ID: {this.state.deleteRow.id}</b> ?</p>
            }
          </Modal.Body>
          <Modal.Footer>
            <div>
              {
                this.state.modalType == "deleted" ?
                  <Button onClick={ () => {this.setState({showModal: false})} }>
                    Ok
                  </Button>
                :
                  this.state.modalType == "delete" &&
                    <div>
                      <Button onClick={ () => {this.setState({showModal: false})} }>
                        No
                      </Button>
                      <Button onClick={ () => {this.deleteRow(this.state.deleteRow)}}>
                        Yes
                      </Button>
                    </div>
              }
            </div>
          </Modal.Footer>
        </Modal>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={classNames(classes.appBar, {
              [classes.appBarShift]: this.state.open,
            })}
          >
            <Toolbar disableGutters={!this.state.open} className={classes.mytoolbar}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, {
                  [classes.hide]: this.state.open,
                })}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                className={classes.title}
              >
                Dashboard
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
          <Drawer
            variant="permanent"
            className={classNames(classes.drawer, {
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open,
            })}
            classes={{
              paper: classNames({
                [classes.drawerOpen]: this.state.open,
                [classes.drawerClose]: !this.state.open,
              }),
            }}
            open={this.state.open}
          >
            <div className={classes.toolbar}>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>
              <div>
                <ListItem button
                  onClick={() => {
                    if(this.state.tab == "report"){
                      this.setState({tab: "dashboard"},this.afterDidMount)
                    }else
                      this.setState({tab: "dashboard"})
                  }}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button onClick={() => {this.setState({tab: "report"})}}>
                  <ListItemIcon>
                    <TableChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reports" />
                </ListItem>
                <ListItem button onClick={() => {this.setState({tab: "profile"})}}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Account" />
                </ListItem>
              </div>
            </List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            {
              this.state.tab == "dashboard" ?
                <div>
                  <Grid container spacing={40} alignItems="flex-end">
                    <Grid item xs={12}>
                      <Card style={{margin: "20px 50px"}}>
                      {
                        (this.state.curTime && this.state.getDay) ?
                          <CardHeader
                            avatar={<Today />}
                            title={this.state.curTime + "  " + this.state.getDay + "  "}
                            titleTypographyProps={{ align: 'center' }}
                            className={classes.cardHeader}
                            classes={{
                              title: classes.cardHeaderTextSize,
                              avatar: classes.cardHeaderTextSize
                            }}
                          />
                        :
                          <CardHeader
                            title="... Loading"
                            titleTypographyProps={{ align: 'center' }}
                            className={classes.cardHeader}
                            classes={{
                              title: classes.cardHeaderText,
                            }}
                          />
                      }
                      </Card>
                    </Grid>
                  </Grid>
                  <Grid container spacing={40} alignItems="flex-end" style={{marginTop: '20px', marginBottom: '20px'}}>
                    {this.state.countData.map(tier => (
                      <Grid item key={tier.title} xs={12} sm={4} md={4}>
                        <Card>
                          <CardHeader
                            title={tier.title}
                            titleTypographyProps={{ align: 'center' }}
                            className={classes.cardHeader}
                            classes={{
                              title: classes.cardHeaderText,
                            }}
                          />
                          <CardContent>
                            <div className={classes.cardPricing}>
                              <Typography align="center" component="h2" variant="h3" color="#1b2a6e">
                                {tier.visitors + " "}
                              </Typography>
                              <Typography variant="h6" color="textSecondary">
                                visitor(s)
                              </Typography>
                            </div>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                 <Grid container spacing={40} alignItems="flex-end" style={{marginTop: '20px', marginBottom: '20px'}}>
                  <Grid item xs={12} sm={6}>
                    <div className={classes.tableContainer}>
                      <Paper className={classes.rootTable}>
                        <Table className={classes.table}>
                          <TableHead style={{backgroundColor: "#1b2a6e"}}>
                            <TableRow>
                              <TableCell style={{color: "white"}} align="center">Type of Visitor</TableCell>
                              <TableCell style={{color: "white"}} align="center">Number of Visitor</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.countVisitor.map(n => (
                              <TableRow style={{height: '57.5px'}}>
                                <TableCell align="center" component="th" scope="row">
                                  {n.name}
                                </TableCell>
                                <TableCell align="center">{n.number}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Paper>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div className={classes.tableContainer}>
                      <Paper className={classes.rootTable}>
                        <Table className={classes.table}>
                          <TableHead style={{backgroundColor: "#1b2a6e"}}>
                            <TableRow>
                              <TableCell style={{color: "white"}} align="center">Type of Visitor</TableCell>
                              <TableCell style={{color: "white"}} align="center">Number of Visitor</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.countVehicle.map(n => (
                              <TableRow>
                                <TableCell align="center" component="th" scope="row">
                                  {n.name}
                                </TableCell>
                                <TableCell align="center">{n.number}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Paper>
                    </div>
                  </Grid>
                </Grid>
              </div>
            :
              this.state.tab == "report" ?
                <div>
                  <Grid container spacing={40} alignItems="flex-end">
                  <Grid item xs={6}>
                    <InputGroup className="mb-3">
                      <select className="browser-default custom-select" style={{width: "100px", color: "black", fontWeight: 400}} onChange={this.onChange('sortBy')}>
                        <option selected value="">Search By</option>
                        <option value="ID">ID</option>
                        <option value="Name">Name</option>
                        <option value="Email">Email</option>
                        <option value="IC">IC</option>
                        <option value="Contact">Contact</option>
                        <option value="Gender">Gender</option>
                        <option value="Visitor">Visitor</option>
                        <option value="Vehicle">Vehicle</option>
                        <option value="Plate">Plate No.</option>
                      </select>
                      {
                        this.state.sortBy ?
                          <input
                            name="name"
                            type="text"
                            style={{width: "360px"}}
                            className="form-control"
                            onChange={this.handleSearchChange}
                            value={this.state.searchText}
                            placeholder="Search Here"
                          />
                        :
                        <input
                          name="name"
                          type="text"
                          style={{width: "360px"}}
                          className="form-control"
                          disabled
                        />
                      }
                    </InputGroup>
                  </Grid>
                  <Grid item xs={12}>
                    <ReactTable
                        data={this.state.filtered}
                        columns={[
                          {
                            Header: "No.",
                            accessor: "num",
                            width: 80,
                            resizable: false,
                            style: {textAlign: "center", color: "black", fontWeight: 400},
                          },
                          {
                            Header: "Action",
                            width: 130,
                            resizable: false,
                            style: {textAlign: "center"},
                            Cell: rowInfo => (
                              <span>
                                <button style={{backgroundColor: "transparent", border: "none"}} onClick={ () => {this.gotoQrAccess(rowInfo.row)}}>
                                  <Send style={{marginBottom: "3px", marginRight: "5px", height: "18px", width: "18px"}}/>
                                </button>
                                <button style={{backgroundColor: "transparent", border: "none"}} onClick={ () => {this.setState({showModal: true, modalType: "delete", deleteRow: rowInfo.row}, this.deletedUpdate)}}>
                                  <Delete style={{marginBottom: "3px", marginRight: "5px", height: "18px", width: "18px"}}/>
                                </button>
                              </span>
                            )
                          },
                          {
                            Header: "ID",
                            accessor: "id",
                            width: 220,
                            resizable: false,
                            style: {textAlign: "center", color: "black", fontWeight: 400},
                          },
                          {
                            Header: "Registered Time",
                            accessor: "unixRegister",
                            width: 170,
                            resizable: false,
                            style: {textAlign: "center", color: "black", fontWeight: 400},
                          },
                          {
                            Header: "Enter Time",
                            accessor: "unixEnter",
                            width: 170,
                            resizable: false,
                            Cell: rowInfo => (
                              rowInfo.row.unixEnter == "NOT YET ENTER" ?
                                <span style={{textAlign: "center", color: "#D50000", fontWeight: 500}}>
                                  {rowInfo.row.unixEnter}
                                </span>
                              :
                                <span style={{textAlign: "center", color: "#03C04A", fontWeight: 500}}>
                                  {rowInfo.row.unixEnter}
                                </span>
                            )
                          },
                          {
                            Header: "Exit Time",
                            accessor: "unixExit",
                            width: 170,
                            resizable: false,
                            Cell: rowInfo => (
                              rowInfo.row.unixExit == "NOT YET EXIT" ?
                                <span style={{textAlign: "center", color: "#D50000", fontWeight: 500}}>
                                  {rowInfo.row.unixExit}
                                </span>
                              :
                                <span style={{textAlign: "center", color: "#03C04A", fontWeight: 500}}>
                                  {rowInfo.row.unixExit}
                                </span>
                            )
                          },
                          {
                            Header: "Name",
                            accessor: "name",
                            width: 200,
                            resizable: true,
                            style: {textAlign: "center", color: "black", fontWeight: 400},
                          },
                          {
                            Header: "Email",
                            accessor: "email",
                            width: 200,
                            resizable: true,
                            style: {textAlign: "center", color: "black", fontWeight: 400},
                          },
                          {
                            Header: "IC/Passport",
                            accessor: "ic",
                            width: 150,
                            resizable: true,
                            style: {textAlign: "center", color: "black", fontWeight: 400},
                          },
                          {
                            Header: "Contact No.",
                            accessor: "contact",
                            width: 150,
                            resizable: false,
                            style: {textAlign: "center", color: "black", fontWeight: 400},
                          },
                          {
                            Header: "Gender",
                            accessor: "gender",
                            width: 100,
                            resizable: false,
                            style: {textAlign: "center", color: "black", fontWeight: 400},
                          },
                          {
                            Header: "Type of Visitor",
                            accessor: "visitors",
                            width: 150,
                            resizable: false,
                            style: {textAlign: "center", color: "black", fontWeight: 400},
                          },
                          {
                            Header: "No. of Passenger",
                            accessor: "passenger",
                            width: 120,
                            resizable: false,
                            style: {textAlign: "center", color: "black", fontWeight: 400},
                          },
                          {
                            Header: "Type of Vehicle",
                            accessor: "vehicle",
                            width: 150,
                            resizable: false,
                            style: {textAlign: "center", color: "black", fontWeight: 400},
                          },
                          {
                            Header: "Vehicle Plate No.",
                            accessor: "vehiclePlate",
                            width: 150,
                            resizable: false,
                            style: {textAlign: "center", color: "black", fontWeight: 400},
                          },
                          {
                            Header: "Purpose",
                            accessor: "purpose",
                            width: 800,
                            resizable: false,
                            style: {textAlign: "center", color: "black", fontWeight: 400},
                          },
                        ]}
                        pageSize={10}
                        style={{ height: "620px", fontSize: "12px"}}
                        showPaginationBottom={true}
                        showPageSizeOptions={false}
                        className="-highlight"
                        noDataText= "Loading..."
                        getTdProps={() => {
                          return{
                            style: {
                              padding: '10px 20px',
                            }
                          }
                        }}
                        getTheadThProps={() => {
                          return{
                            style: {
                              paddingTop: '18px',
                              paddingBottom: '18px',
                              backgroundColor: "#1b2a6e",
                              color: "white",
                              fontWeight: 400,
                              fontSize: 14
                            }
                          }
                        }}
                    />
                  </Grid>
                  </Grid>
                </div>
              :
                this.state.tab == "profile" &&
                <div>
                  <Grid container spacing={40} alignItems="flex-end">
                    <Grid item xs={12}>
                    <Paper className={classes.paper}>
                      <AccountCircle style={{width: "20%", height: "20%", marginTop: '30px', marginBottom: '40px'}}/>
                      <Typography align="center" component="h7" variant="h8" color="white">
                        Email:
                      </Typography>
                      <Typography align="center" component="h6" variant="h7" color="white" style={{marginTop: '10px'}}>
                        <b>{userEmail}</b>
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        style={{backgroundColor: "white", color: '#1b2a6e', marginTop: '60px'}}
                        onClick={this.signOut}
                      >
                        Logout
                      </Button>
                    </Paper>
                    </Grid>
                  </Grid>
                </div>
          }
          </main>
        </div>
      </div>
    )
  }
}

const enhance = compose(
  withRouter,
  withFirebase,
  withStyles((styles)),
);

export default enhance(Dashboard);
