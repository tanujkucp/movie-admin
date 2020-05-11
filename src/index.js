import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom'
import LinearProgress from "@material-ui/core/LinearProgress";
import Home from './views/pages/Dashboard';

// const SignIn = React.lazy(() => import('./views/pages/SignIn'));
// const Upload = React.lazy(() => import('./views/pages/Upload'));
const Page404 = React.lazy(() => import('./views/pages/Page404'));

const loading = () => <LinearProgress variant="query" style={{width: '100%'}} color="secondary"/>;

const routing = (
    <Router>
        <React.Suspense fallback={loading()}>
            <Switch>
                <Route exact path="/" component={Home}/>

                <Route component={Page404}/>
            </Switch>
        </React.Suspense>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
