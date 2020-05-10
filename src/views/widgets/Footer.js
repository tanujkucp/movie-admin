import React from 'react';
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link/Link";
import configs from "../../configs";

function Copyright() {
    return (
        <Typography variant="body2" align="center" style={{color: '#d0d0d0'}}>
            {'Copyright © '}
            <Link color="inherit" href={configs.website_address}>
                {configs.website_name}
            </Link>{' '}
            {new Date().getFullYear()}

        </Typography>
    );
}

export default function Footer() {
    return (
        <footer style={{backgroundColor: 'rgb(36, 40, 44)', padding: 10}}>

            <Typography variant="h5" align="center" style={{color: 'white'}} component="p">
                We bring you the best of movies in Best Quality!
            </Typography>

            <Copyright/>
        </footer>
    );

}

