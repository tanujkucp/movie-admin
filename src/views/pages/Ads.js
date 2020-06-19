import LinearProgress from "@material-ui/core/LinearProgress";
import Container from "@material-ui/core/Container";
import React, {useState} from "react";
import axios from "axios";
import configs from "../../configs.json";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";


const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '90%', // Fix IE 11 issue.
        paddingBottom: 20,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: 250,
        marginRight: 20
    },
}));

export default function SignIn() {
    const classes = useStyles();
    const [ad, setAd] = useState({image: '', link: '', enabled: false, page: 'home'});
    const [user_secret, setSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleChange = (event) => {
        let newAd = {
            ...ad,
            [event.target.name]: event.target.value
        };
        setAd(newAd);
    };

    const saveAd = () => {
        setLoading(true);
        axios.post(configs.server_address + "/services/saveAd", {user_secret: user_secret, data: ad})
            .then((res) => {
                if (res.data.success) {
                    alert('Success!');
                }
                setLoading(false);
            }).catch((err) => {
            setLoading(false);
            console.log(err);
            if (err.response) alert(err.response.data.message);
        });
    };
    const loadAd = () => {
        setLoading(true);
        axios.post(configs.server_address + "/getAd", {page: ad.page})
            .then((res) => {
                if (res.data.success) {
                    setAd(prevState => {
                        return {...prevState, ...res.data.data}
                    });
                }
                setLoading(false);
            }).catch((err) => {
            setLoading(false);
            console.log(err);
            if (err.response) alert(err.response.data.message);
        });
    };

    return (
        <div style={{backgroundColor: '#cfd8dc'}}>
            {loading ? (<LinearProgress variant="query" color="secondary"/>) : (null)}
            <Container component="main" maxWidth="sm" style={{backgroundColor: '#cfd8dc'}}>
                <CssBaseline/>
                <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Admin Action</DialogTitle>
                    <DialogContent>
                        <TextField autoFocus margin="dense" label="Secret Key" fullWidth type="password"
                                   multiline
                                   rowsMax={6}
                                   value={user_secret}
                                   onChange={event => setSecret(event.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => {
                            setOpen(false);
                            saveAd();
                        }} color="primary">
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>

                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h5" style={{marginTop: 10, marginBottom: 10}}>
                        Create or update Ads on the site
                    </Typography>
                    <form className={classes.form} noValidate>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Page</InputLabel>
                            <Select value={ad.page} onChange={handleChange} name={'page'}>
                                <MenuItem value={'home'}>Home</MenuItem>
                                <MenuItem value={'bollywood'}>Bollywood</MenuItem>
                                <MenuItem value={'hollywood'}>Hollywood</MenuItem>
                                <MenuItem value={'webseries'}>Web Series</MenuItem>
                                <MenuItem value={'adult'}>Adult</MenuItem>
                                <MenuItem value={'media'}>Media Details</MenuItem>
                                <MenuItem value={'mediaadult'}>Media Details 18+</MenuItem>
                                <MenuItem value={'search'}>Search</MenuItem>
                                <MenuItem value={'404'}>404 Not Found</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{marginTop: 10}}
                            onClick={loadAd}
                        >Load
                        </Button>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Image"
                            name="image"
                            value={ad.image}
                            onChange={handleChange}
                            autoFocus
                            style={{backgroundColor: '#eee'}}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="link"
                            label="Promotion Link"
                            value={ad.link}
                            onChange={handleChange}
                            style={{backgroundColor: '#eee'}}
                        />
                        <FormControlLabel
                            control={<Switch checked={ad.enabled}
                                             onChange={() => setAd(prev => {
                                                 return {...prev, enabled: !ad.enabled}
                                             })}/>}
                            label="Enable"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={ad.image.length < 5 || ad.link.length < 5}
                            className={classes.submit}
                            onClick={() => setOpen(true)}
                        >Save Ad
                        </Button>

                    </form>
                </Paper>
            </Container>
        </div>
    );
}