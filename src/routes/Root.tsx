import React from 'react';
import { Redirect } from 'react-router-dom';

import { APICore } from '../helpers/api/apiCore';

const Root = () => {
    const api = new APICore();

    const getRootUrl = () => {
        let url: string = 'login';

        // check if user logged in or not and return url accordingly
        if (api.isUserAuthenticated() === false) {
            url = 'login';
        } else {
            url = 'dashboard/ecommerce';
        }
        return url;
    };

    const url = getRootUrl();

    return <Redirect to={`/${url}`} />;
};

export default Root;
