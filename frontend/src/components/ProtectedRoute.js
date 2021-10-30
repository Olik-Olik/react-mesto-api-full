/*//этим компонентом защитите роут /, чтобы на него не смогли перейти неавторизованные пользователи
import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
const ProtectedRoute = ({ component: Component, ...props  }) => {
    console.log('Waza!!!');
    return (

        <Route>
            { () => props.loggedIn ? <Component {...props} /> : <Redirect to="/sign-in" />
            }
        </Route>
    )
}
export default ProtectedRoute;*/


import React from 'react';
import {Redirect, Route} from "react-router-dom";

const ProtectedRoute = ({component: Component, ...props}) => {
    return (
        <Route exact={props.exact} path={props.path}>
            {() =>
                props.loggedIn === true ? <Component {...props} /> : <Redirect to="/sign-in"/>
            }
        </Route>
    );
};

export default ProtectedRoute;
