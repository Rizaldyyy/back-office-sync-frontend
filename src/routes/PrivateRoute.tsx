import React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';

import { APICore } from '../helpers/api/apiCore';

interface PrivateRouteProps {
    component: React.FunctionComponent<RouteProps>;
    roles?: string;
}

/**
 * Private Route forces the authorization before the route can be accessed
 * @param {*} param0
 * @returns
 */
const PrivateRoute = ({ component: Component, roles, ...rest }: PrivateRouteProps) => {
    const api = new APICore();
    const loggedInUser = api.getLoggedInUser();
    
    return (
        <Route
            {...rest}
            render={(props: RouteComponentProps) => {
                if (api.isUserAuthenticated() === false) {
                    // not logged in so redirect to login page with the return url
                    return (
                        <Redirect
                            to={{ pathname: '/logout' }}
                        />
                    );
                }

                const group = JSON.parse(loggedInUser.data.group.module_roles);
                // check if route is restricted by role
                if (roles && group.indexOf(roles) === -1) {
                    // role not authorised so redirect to home page
                    return <Redirect to={{ pathname: '/error-500' }} />;
                }

                if (loggedInUser.data.change_password === 1) {
                    return <Redirect to={{ pathname: '/admin/change-password' }} />;
                }
                
                // authorised so return component
                return <Component {...props} />;
            }}
        />
    );
};

export default PrivateRoute;
