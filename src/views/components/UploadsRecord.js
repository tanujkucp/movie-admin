import React, {useEffect, useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from '../widgets/Title';
import axios from "axios";
import configs from "../../configs";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import withStyles from "@material-ui/core/styles/withStyles";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from '@material-ui/icons/Delete';

export default function UploadsRecord() {
    const [latest, setLatest] = useState();
    const [loading, setLoading] = useState(false);
    const [responses, setResponses] = useState([]);
    const [user_secret, setSecret] = useState('');
    const [open, setOpen] = useState(false);
    const [forDeletion, setForDeletion] = useState();

    //fetch data from server
    const loadData = (timestamp) => {
        let filters = {};
        if (timestamp) filters.timestamp = timestamp;

        axios.post(configs.server_address + '/getLatest', {filters: filters}).then(res => {
            if (res.data.success) {
                //change state of all elements
                setLatest(res.data.data);
            } else {
                alert(res.data.message);
            }
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
            setLatest(null);
        });
    };

    //delete selected title
    const deleteTitle = () => {
        console.log(forDeletion, user_secret);
        setLoading(true);
        axios.post(configs.server_address + '/services/deleteMedia', {
            media_id: forDeletion,
            user_secret: user_secret.trim()
        }).then(res => {
            setForDeletion(null);
            if (res.data.success) {
                //change state of all elements
                loadData();
                alert('Delete Operation successful!');
            } else {
                setLoading(false);
                alert(res.data.message);
            }
        }).catch(err => {
            setForDeletion(null);
            console.log(err);
            setLoading(false);
            if (err.response) alert(err.response.data.message);
        });
    };

    useEffect(() => {
        setLoading(true);
        loadData();
    }, []);

    const handleBack = () => {
        let oldRes = responses;
        let l = oldRes.pop();
        setResponses(oldRes);
        setLatest(l);
    };
    const handleNext = () => {
        setLoading(true);
        let newRes = responses;
        newRes.push(latest);
        //  console.log(newRes);
        setResponses(newRes);
        loadData(latest[latest.length - 1].created_at);
    };

    const StyledTableRow = withStyles((theme) => ({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }))(TableRow);

    return (
        <React.Fragment>
            <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Admin Action</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To do this action you need to provide your user secret key generated at the time of login.
                    </DialogContentText>
                    <TextField
                        variant={"outlined"}
                        multiline={true}
                        rowsMax={6}
                        autoFocus
                        margin="dense"
                        label="Secret Key"
                        fullWidth
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
                        deleteTitle()
                    }} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Title>Recent Uploads</Title>
            {loading ? (<LinearProgress variant="query" color="secondary" style={{width: '100%'}}/>) : null}
            {latest ? (
                <div>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow style={{backgroundColor: 'rgb(36, 40, 44)'}}>
                                    <TableCell style={{color: 'white'}}>Date</TableCell>
                                    <TableCell style={{color: 'white'}}>Title</TableCell>
                                    <TableCell style={{color: 'white'}}>Media ID</TableCell>
                                    <TableCell style={{color: 'white'}}>Uploaded By</TableCell>
                                    <TableCell style={{color: 'white'}} align="right">Options</TableCell>
                                </TableRow>

                            </TableHead>
                            <TableBody>
                                {latest.map((row) => (
                                    <StyledTableRow key={row.media_id}>
                                        <TableCell>{new Date(row.created_at._seconds * 1000).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</TableCell>
                                        <TableCell>{row.title.substr(0, 35)}{row.title.length > 35 ? '...' : null}</TableCell>
                                        <TableCell>{<a href={configs.website_public_address + '/m/' + row.media_id}
                                                       target="_blank"
                                                       rel="noopener noreferrer">{row.media_id}</a>}</TableCell>
                                        <TableCell>{row.username}</TableCell>
                                        <TableCell align="right"> <Button
                                            variant="contained"
                                            color="secondary"
                                            size={'small'}
                                            onClick={() => {
                                                setForDeletion(row.media_id);
                                                setOpen(true)
                                            }}
                                            startIcon={<DeleteIcon/>}>
                                            Delete
                                        </Button>
                                        </TableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div style={{justifyContent: 'center', display: 'flex'}}>
                        <Card style={{
                            justifyContent: 'space-between',
                            display: 'flex',
                            marginTop: 20,
                            width: '60%'
                        }}>
                            <Button onClick={handleBack} disabled={responses.length < 1}>
                                {<KeyboardArrowLeft/>}
                                Back
                            </Button>
                            <Typography style={{alignSelf: 'center'}}>See more results</Typography>
                            <Button onClick={handleNext} disabled={latest.length < 9}>
                                Next
                                {<KeyboardArrowRight/>}
                            </Button>
                        </Card>
                    </div>

                </div>
            ) : null}

        </React.Fragment>
    );
}