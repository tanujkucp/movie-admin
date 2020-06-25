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
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import {FilePicker} from 'react-file-picker'
import Divider from "@material-ui/core/Divider";


const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20
    },
    form: {
        width: '90%', // Fix IE 11 issue.
        paddingBottom: 20,
    },

}));

export default function SignIn() {
    const classes = useStyles();
    const [user_secret, setSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [backup, setBackup] = useState(null);
    const [file, setFile] = useState();
    let iter = 0;

    const upload = (data) => {
        console.log(data);
        axios.post(configs.server_address + '/services/saveMedia',
            {user_secret: user_secret.trim(), data: data}).then(res => {
            if (res.data.success) {
                //change state of all elements
                console.log('successful!');
            } else {
               alert(res.data.message)
            }
        }).catch(err => {
            console.log(err);
            if (err.response) alert(err.response.data.message);
        });
    };

    const startIter = ()=>{
        setLoading(true);
        let timer = setInterval(() => {
            if (iter >= backup.length) {
                clearInterval(timer);
                setLoading(false);
                alert('All uploads done!');
            } else {
                upload(backup[iter]);
                iter = iter + 1;
            }
        }, 1000);
    }

    return (
        <div style={{backgroundColor: '#cfd8dc'}}>
            {loading ? (<LinearProgress variant="query" color="secondary"/>) : (null)}
            <Container component="main" maxWidth="sm" style={{backgroundColor: '#cfd8dc'}}>
                <CssBaseline/>
                <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Enter your secret key to proceed!</DialogTitle>
                    <DialogContent>
                        <TextField autoFocus margin="dense" label="Secret Key" fullWidth type="password"
                                   multiline
                                   variant="outlined"
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
                            startIter();
                        }} color="primary">
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>

                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h5" style={{marginTop: 10, marginBottom: 10}}>
                        Choose the backup file from computer
                    </Typography>
                    <form className={classes.form} noValidate>
                        <FilePicker
                            extensions={['json']}
                            onChange={FileObject => {
                                setFile(FileObject);
                                const reader = new FileReader();
                                reader.addEventListener("load", e => {
                                    let backup = JSON.parse(e.target.result)
                                    console.log(backup);
                                    setBackup(backup);
                                });
                                reader.readAsText(FileObject);
                            }}
                            style={{float: 'left', marginRight: 10}}
                            onError={errMsg => alert(errMsg)}>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >Select File
                            </Button>
                        </FilePicker>
                        {file ? file.name : null}
                    </form>
                    {backup ? (
                        <div style={{width: '90%', marginBottom: 10}}>
                            <Divider variant="middle" style={{width: "100%", marginBottom: 10, marginRight: 20}}/>
                            <Typography component="h1" variant="h6" style={{marginTop: 10, marginBottom: 10}}>
                                {backup.length} Records found!
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={() => {
                                  setOpen(true);
                                }}
                            >Upload All Records
                            </Button>
                        </div>
                    ) : null}

                </Paper>
            </Container>
        </div>
    );
}