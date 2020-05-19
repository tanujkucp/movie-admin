import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import UploadsRecord from '../components/UploadsRecord';
import Footer from "../widgets/Footer";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ListItemText from "@material-ui/core/ListItemText";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import configs from "../../configs";
import axios from "axios";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import SignIn from "./SignIn";
import Upload from "./Upload";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        backgroundColor: '#cfd8dc',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: 'rgb(36, 40, 44)'
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
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        })

    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
}));

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

export default function Dashboard() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [dialog_open, setDialogOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [secret_key, setSecret] = React.useState('');

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
  //  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const downloadFile = (data, name) => {
        let element = document.createElement("a");
        let file = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        element.href = URL.createObjectURL(file);
        element.download = name;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }
    const backup = (key) => {
        //fetch data from server with given key
        axios.post(configs.server_address + '/services/backupDatabase', {secret_key: key.trim()}).then(res => {
            if (res.status === 200) {
                downloadFile(res.data.data, res.data.filename);
                setSecret('');
            }
        }).catch(err => {
            console.log(err);
            if (err.response) alert(err.response.data.message);
        });
    };

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <Dialog open={dialog_open} onClose={() => setDialogOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Admin Action</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Secret Key" fullWidth type="password"
                               value={secret_key}
                               onChange={event => setSecret(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        setDialogOpen(false);
                        backup(secret_key);
                    }} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        {configs.website_name} Dashboard
                    </Typography>
                    <IconButton color="inherit">
                        <Badge badgeContent={0} color="secondary">
                            <NotificationsIcon/>
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
                <Divider/>
                <List>

                    <ListItemLink button href={'#'} selected={selectedIndex === 0}
                                  onClick={(e) => setSelectedIndex(0)}>
                        <ListItemIcon>
                            <DashboardIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Dashboard"/>
                    </ListItemLink>
                    <ListItemLink button selected={selectedIndex === 1}
                                  onClick={(e) => setSelectedIndex(1)}>
                        <ListItemIcon>
                            <LockOpenIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Login"/>
                    </ListItemLink>
                    <ListItemLink button selected={selectedIndex === 2}
                                  onClick={(e) => setSelectedIndex(2)}>
                        <ListItemIcon>
                            <CloudUploadIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Upload"/>
                    </ListItemLink>

                </List>
                <Divider/>
                <List>
                    <ListSubheader>Actions</ListSubheader>
                    <ListItem button onClick={() => setDialogOpen(true)}>
                        <ListItemIcon>
                            <CloudDownloadIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Backup Database"/>
                    </ListItem>
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer}/>
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                        {/* Chart */}
                        {/*<Grid item xs={12} md={8} lg={9}>*/}
                        {/*    <Paper className={fixedHeightPaper}>*/}
                        {/*        <Chart />*/}
                        {/*    </Paper>*/}
                        {/*</Grid>*/}
                        {/* Recent Deposits */}
                        {/*<Grid item xs={12} md={4} lg={3}>*/}
                        {/*    <Paper className={fixedHeightPaper}>*/}
                        {/*        <Deposits />*/}
                        {/*    </Paper>*/}
                        {/*</Grid>*/}
                        {/* Recent UploadsRecord */}
                        {selectedIndex === 0 ? (
                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                    <UploadsRecord/>
                                </Paper>
                            </Grid>
                        ) : null}
                        {selectedIndex === 1 ? (
                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                    <SignIn/>
                                </Paper>
                            </Grid>
                        ) : null}
                        {selectedIndex === 2 ? (
                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                    <Upload/>
                                </Paper>
                            </Grid>
                        ) : null}

                    </Grid>
                </Container>
                <Footer/>
            </main>
        </div>
    );
}