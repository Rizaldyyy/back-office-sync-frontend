import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import Admin from './admin/reducers';
import Role from './role/reducers';
import Cluster from './cluster/reducers';
import Module from './module/reducers';
import Report from './report/reducers';

export default combineReducers({
    Auth,
    Layout,
    Admin,
    Role,
    Cluster,
    Module,
    Report,
});
