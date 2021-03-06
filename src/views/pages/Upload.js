import React, {useState} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';
import Snackbar from "@material-ui/core/Snackbar";
import UploadPart1 from "../components/UploadPart1";
import UploadPart2 from "../components/UploadPart2";
import UploadPart3 from "../components/UploadPart3";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import configs from "../../configs";
import {Industry, MediaType} from "../../enums";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";


const useStyles = makeStyles((theme) => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        backgroundColor: '#cfd8dc',
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 800,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginBottom: theme.spacing(3),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const steps = ['Basic Info', 'Add references', 'Add Download Links'];

export default function AdminUpload() {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [activeStep, setActiveStep] = useState(0);
    const [response, setResponse] = useState();
    const [user_secret, setSecret] = useState('');
    const [media_id, setMediaID] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);
    const [data, setData] = useState({
        industry: Industry.BOLLYWOOD,
        media_type: MediaType.MOVIE,
        tags: [],
        title: '',
        language: '',
        IMDb_link: '',
        release_year: '',
        IMDb_rating: '',
        genre: '',
        screenshots: ['', '', '', ''],
        description: '',
        youtube_trailer_video_id: '',
        downloads: [],
        poster_link: ''
    });

    const validate = () => {
        if (data.title && data.language && data.IMDb_link && data.IMDb_rating && data.release_year && data.genre
            && data.description && data.youtube_trailer_video_id && data.poster_link) {
            //check downloads object
            return data.downloads[0].quality.length > 0 && data.downloads[0].size.length > 0 && data.downloads[0].links.length > 0;
        } else return false;
    };

    const handleNext = () => {
        if (activeStep === 2) {
            if (validate()) {
                //upload();
                setActiveStep(activeStep + 1);
            } else setError('Fill all details first!');
            // setActiveStep(activeStep + 1);
        } else setActiveStep(activeStep + 1);
    };
    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const upload = () => {
        setLoading(true);
        console.log(data);
        axios.post(configs.server_address + '/services/saveMedia',
            {user_secret: user_secret.trim(), data: data}).then(res => {
            if (res.data.success) {
                //change state of all elements
                setResponse(res.data);
            } else {
                //alert(res.data.message);
                setError(res.data.message)
            }
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
            if (err.response) setError(err.response.data.message);
        });
    };

    const update = () => {
        setLoading(true);
        console.log(data);
        axios.post(configs.server_address + '/services/updateMedia', {
            user_secret: user_secret.trim(),
            data: data,
            media_id: media_id.trim()
        }).then(res => {
            if (res.data.success) {
                //change state of all elements
                setResponse(res.data);
            } else {
                //alert(res.data.message);
                setError(res.data.message)
            }
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
            if (err.response) setError(err.response.data.message);
        });
    };

    //fetch data from server with given media_id
    const loadData = () => {
        setLoading(true);
        axios.post(configs.server_address + '/getMedia', {media_id: media_id.trim()}).then(res => {
            if (res.data.success) {
                //change state of all elements
                setData(res.data.data);
                console.log(res.data.data);
            } else {
                setError(res.data.message);
            }
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
            if (err.response) setError(err.response.data.message);
        });
    };

    const downloadFile = () => {
        let text = {
            title: data.title,
            tags: data.tags,
            poster_link: data.poster_link,
            media_id: response.media_id,
            genre: data.genre,
            language: data.language,
            release_year: data.release_year,
            objectID: response.media_id
        };
        let element = document.createElement("a");
        let file = new Blob([JSON.stringify(text, null, 2)], {type: 'application/json'});
        element.href = URL.createObjectURL(file);
        element.download = text.title + ".json";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <UploadPart1 getData={getData} data={data}/>;
            case 1:
                return <UploadPart2 getData={getData} data={data}/>;
            case 2:
                return <UploadPart3 getData={getData} data={data}/>;
            default:
                throw new Error('Unknown step');
        }
    };

    const getData = (d) => {
        setData(d);
        //  console.log(d);
    };

    return (
        <div style={{backgroundColor: '#cfd8dc', paddingTop: 20}}>
            <Container component="main" className={classes.layout}>

                <Snackbar open={error} autoHideDuration={5000} onClose={() => setError(null)}>
                    <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                </Snackbar>

                <CssBaseline/>

                {loading ? (
                    <LinearProgress variant="query" color="secondary"/>
                ) : null}
                <Paper style={{padding: 20, marginBottom: 10}}>
                    <FormControlLabel
                        control={<Switch checked={isUpdate} onChange={() => setIsUpdate(prev => !prev)}/>}
                        label="Update Mode"
                    />
                    {isUpdate ? (<div>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Enter Media ID"
                            value={media_id}
                            onChange={(e) => setMediaID(e.target.value)}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={loadData}
                        >
                            Load Data
                        </Button>
                    </div>) : (null)}


                </Paper>

                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h4" align="center">
                        Media Upload
                    </Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <React.Fragment>
                        {activeStep === steps.length ?
                            (loading ? (
                                <LinearProgress variant="query" color="secondary"/>
                            ) : (
                                response ? (
                                    <React.Fragment>
                                        <Typography variant="h5" gutterBottom>
                                            Thank you for your upload.
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            Your upload ID is {response.media_id} . You can check the details page <a
                                            target="_blank" rel="noopener noreferrer"
                                            href={configs.website_address + 'm/' + response.media_id}>here </a>.
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={downloadFile}
                                        >Download Index</Button>
                                    </React.Fragment>
                                ) : (
                                    <div>
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            fullWidth
                                            multiline
                                            rowsMax={6}
                                            label="Enter Your Secret Key"
                                            value={user_secret}
                                            onChange={(e) => setSecret(e.target.value)}
                                            style={{backgroundColor: '#eee'}}
                                        />
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={isUpdate? update : upload}
                                        >
                                            Verify and {isUpdate? 'Update': 'Upload'}
                                        </Button>
                                    </div>
                                )
                            ))
                            : (
                                <React.Fragment>
                                    {getStepContent(activeStep)}
                                    <div className={classes.buttons}>
                                        {activeStep !== 0 && (
                                            <Button onClick={handleBack} className={classes.button}>
                                                Back
                                            </Button>
                                        )}
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleNext}
                                            className={classes.button}
                                        >
                                            {activeStep === steps.length - 1 ? 'Confirm All' : 'Next'}
                                        </Button>
                                    </div>
                                </React.Fragment>
                            )}
                    </React.Fragment>
                </Paper>

            </Container>
        </div>
    );
}
