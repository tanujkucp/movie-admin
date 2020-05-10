import React, {Component} from 'react';
import {Col, Container, Row} from 'reactstrap';
import CssBaseline from "@material-ui/core/CssBaseline";
import Footer from "../widgets/Footer";
import configs from "../../configs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

class Page404 extends Component {

    render() {
        return (
            <React.Fragment>
                <CssBaseline/>
                <div style={{
                    backgroundColor: "#cfd8dc",
                    paddingTop: 200,
                    paddingBottom: 200,
                    justifyContent: 'center',
                    display: 'flex'
                }}>
                    <Container>
                        <Row className="justify-content-center">
                            <Col md="6">
                                <div className="clearfix">
                                    <h1 className="float-left display-3 mr-4">404</h1>
                                    <h4 className="pt-3">Oops! You're lost.</h4>
                                    <p className="text-muted float-left">The page you are looking for was not found.</p>
                                </div>

                            </Col>
                        </Row>
                        <Row className={'justify-content-center'}>
                            <Typography variant="h5" color="textPrimary" gutterBottom>
                                You can view our <Link href={configs.website_address}> Home
                                Page </Link> for more options.
                            </Typography>
                        </Row>
                    </Container>
                </div>
                {/* Footer */}
                <Footer/>
                {/* End footer */}
            </React.Fragment>
        );
    }
}

export default Page404;
