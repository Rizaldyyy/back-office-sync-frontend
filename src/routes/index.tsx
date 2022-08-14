import React from 'react';
import { Route, RouteProps } from 'react-router-dom';

// components
import PrivateRoute from './PrivateRoute';
import Root from './Root';

// lazy load all the views

// auth
const Login = React.lazy(() => import('../pages/auth/Login'));
const Logout = React.lazy(() => import('../pages/auth/Logout'));
const ForgetPassword = React.lazy(() => import('../pages/auth/ForgetPassword'));
// const Register = React.lazy(() => import('../pages/auth/Register'));

// admin
const AdminForm = React.lazy(() => import('../pages/admin/Form'));
const AdminList = React.lazy(() => import('../pages/admin/List'));
const AdminLogs = React.lazy(() => import('../pages/admin/Logs'));
const AdminChangePassword = React.lazy(() => import('../pages/admin/ChangePassword'));

// bank-account
const BankAccountSyncBlackListForm = React.lazy(() => import('../pages/bank-account/BlackListFormSync'));

// provider
const ProviderList = React.lazy(() => import('../pages/provider/List'));

// game
const GamesFormSync = React.lazy(() => import('../pages/game/FormSync'));

// module
const ModuleForm = React.lazy(() => import('../pages/module/Form'));
const ModuleList = React.lazy(() => import('../pages/module/List'));

// role
const RoleForm = React.lazy(() => import('../pages/role/Form'));
const RoleList = React.lazy(() => import('../pages/role/List'));

// cluster
const ClusterForm = React.lazy(() => import('../pages/cluster/Form'));
const ClusterList = React.lazy(() => import('../pages/cluster/List'));

// content
const ContentBannerFormSync = React.lazy(() => import('../pages/content/BannerFormSync'));
const ContentPromotionFormSync = React.lazy(() => import('../pages/content/PromotionFormSync'));

// landing
const Landing = React.lazy(() => import('../pages/landing/'));

// dashboard
const EcommerceDashboard = React.lazy(() => import('../pages/dashboard/Ecommerce/'));

// reports
const GameTowlList = React.lazy(() => import('../pages/reports/GameTowlList'));
const PlayerTowlList = React.lazy(() => import('../pages/reports/PlayerTowlList'));

// extra pages
const Error404 = React.lazy(() => import('../pages/error/Error404'));
const Error500 = React.lazy(() => import('../pages/error/Error500'));

// -other
const Maintenance = React.lazy(() => import('../pages/other/Maintenance'));

export interface RoutesProps {
    path: RouteProps['path'];
    name?: string;
    component?: RouteProps['component'];
    route?: any;
    exact?: RouteProps['exact'];
    icon?: string;
    header?: string;
    roles?: string;
    children?: RoutesProps[];
}

// root routes
const rootRoute: RoutesProps = {
    path: '/',
    exact: true,
    component: () => <Root />,
    route: Route,
};

// dashboards
const dashboardRoutes: RoutesProps = {
    path: '/dashboard',
    name: 'Dashboards',
    header: 'Navigation',
    children: [
        {
            path: '/dashboard/ecommerce',
            name: 'Ecommerce',
            component: EcommerceDashboard,
            route: PrivateRoute,
        }
    ],
};

const adminRoutes: RoutesProps = {
    path: '/admin',
    name: 'Admin',
    route: PrivateRoute,
    roles: 'adminIndex',
    component: AdminList,
    header: 'Admin',
    children: [
        {
            path: '/admin/create',
            name: 'Add New Admin',
            roles: 'adminCreate',
            component: AdminForm,
            route: PrivateRoute,
        },
        {
            path: '/admin/:manage/:id',
            name: 'Update Admin',
            roles: 'adminUpdate',
            component: AdminForm,
            route: PrivateRoute,
        },
        {
            path: '/admin/list',
            name: 'Admin List',
            roles: 'adminIndex',
            component: AdminList,
            route: PrivateRoute,
        },
        {
            path: '/admin/logs',
            name: 'Admin Logs',
            roles: 'adminLogIndex',
            component: AdminLogs,
            route: PrivateRoute,
        },
        {
            path: '/admin/change-password',
            name: 'Admin Change Password',
            roles: 'adminChangePassword',
            component: AdminChangePassword,
            route: Route,
        },
    ],
};

const bankAccountRoutes: RoutesProps = {
    path: '/bank-account',
    name: 'Bank Account',
    route: PrivateRoute,
    roles: 'accountIndex',
    component: BankAccountSyncBlackListForm,
    header: 'Bank Account',
    children: [
        {
            path: '/bank-account/sync-blacklist',
            name: 'Sync Blacklist',
            roles: 'accountBlackSyncIndex',
            component: BankAccountSyncBlackListForm,
            route: PrivateRoute,
        }
    ],
};

const providerRoutes: RoutesProps = {
    path: '/provider',
    name: 'Provider',
    route: PrivateRoute,
    roles: 'providerIndex',
    component: ProviderList,
    header: 'Provider',
    children: [
        {
            path: '/provider/list',
            name: 'Provider List',
            roles: 'providerIndex',
            component: ProviderList,
            route: PrivateRoute,
        }
    ],
};

const gameRoutes: RoutesProps = {
    path: '/game',
    name: 'Game',
    route: PrivateRoute,
    roles: 'gameIndex',
    component: GamesFormSync,
    header: 'Game',
    children: [
        {
            path: '/game/sync',
            name: 'Game Sync',
            roles: 'gameSyncIndex',
            component: GamesFormSync,
            route: PrivateRoute,
        }
    ],
};

const moduleRoutes: RoutesProps = {
    path: '/module',
    name: 'Module',
    route: PrivateRoute,
    roles: 'moduleIndex',
    component: ModuleList,
    header: 'Module',
    children: [
        {
            path: '/module/list',
            name: 'Module List',
            roles: 'moduleIndex',
            component: ModuleList,
            route: PrivateRoute,
        },
        {
            path: '/module/create',
            name: 'Module Create',
            roles: 'moduleCreate',
            component: ModuleForm,
            route: PrivateRoute,
        },
        {
            path: '/module/:manage/:parentId/:childId?',
            name: 'Module Update',
            roles: 'moduleUpdate',
            component: ModuleForm,
            route: PrivateRoute,
        }
    ],
};

const roleRoutes: RoutesProps = {
    path: '/role',
    name: 'Role',
    route: PrivateRoute,
    roles: 'roleIndex',
    component: RoleList,
    header: 'Role',
    children: [
        {
            path: '/role/list',
            name: 'Role List',
            roles: 'roleIndex',
            component: RoleList,
            route: PrivateRoute,
        },
        {
            path: '/role/create',
            name: 'Role Create',
            roles: 'roleCreate',
            component: RoleForm,
            route: PrivateRoute,
        },
        {
            path: '/role/:manage/:id',
            name: 'Role Update',
            roles: 'roleUpdate',
            component: RoleForm,
            route: PrivateRoute,
        }
    ],
};

const clusterRoutes: RoutesProps = {
    path: '/cluster',
    name: 'Cluster',
    route: PrivateRoute,
    roles: 'clusterIndex',
    component: ClusterForm,
    header: 'Cluster',
    children: [
        {
            path: '/cluster/list',
            name: 'Cluster List',
            roles: 'clusterIndex',
            component: ClusterList,
            route: PrivateRoute,
        },
        {
            path: '/cluster/create',
            name: 'Cluster Create',
            roles: 'clusterCreate',
            component: ClusterForm,
            route: PrivateRoute,
        },
        {
            path: '/cluster/:manage/:id',
            name: 'Cluster Update',
            roles: 'clusterUpdate',
            component: ClusterForm,
            route: PrivateRoute,
        }
    ],
};

const contentRoutes: RoutesProps = {
    path: '/content',
    name: 'Content',
    route: PrivateRoute,
    roles: 'contentIndex',
    component: ContentPromotionFormSync,
    header: 'Content',
    children: [
        {
            path: '/content/sync-promotion',
            name: 'Content Promotion',
            roles: 'contentPromotionSyncIndex',
            component: ContentPromotionFormSync,
            route: PrivateRoute,
        },
        {
            path: '/content/sync-banner',
            name: 'Content Banner',
            roles: 'contentSyncSlotBannerIndex',
            component: ContentBannerFormSync,
            route: PrivateRoute,
        }
    ],
};

const reportsRoutes: RoutesProps = {
    path: '/reports',
    name: 'Reports',
    route: PrivateRoute,
    roles: 'reportsIndex',
    component: GameTowlList,
    header: 'Reports',
    children: [
        {
            path: '/reports/game-towl',
            name: 'Game TOWL',
            roles: 'reportsGameTowl',
            component: GameTowlList,
            route: PrivateRoute,
        },
        {
            path: '/reports/player-towl',
            name: 'Player TOWL',
            roles: 'reportsPlayerTowl',
            component: PlayerTowlList,
            route: PrivateRoute,
        }
    ],
};

const appRoutes = [adminRoutes, bankAccountRoutes, providerRoutes, gameRoutes, moduleRoutes, roleRoutes, clusterRoutes, contentRoutes, reportsRoutes];


// auth
const authRoutes: RoutesProps[] = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
        route: Route,
    },
    {
        path: '/forget-password',
        name: 'Forget Password',
        component: ForgetPassword,
        route: Route,
    },
    {
        path: '/logout',
        name: 'Logout',
        component: Logout,
        route: Route,
    },
];

// public routes
const otherPublicRoutes: RoutesProps[] = [
    {
        path: '/landing',
        name: 'landing',
        component: Landing,
        route: Route,
    },
    {
        path: '/maintenance',
        name: 'Maintenance',
        component: Maintenance,
        route: Route,
    },
    {
        path: '/error-404',
        name: 'Error - 404',
        component: Error404,
        route: Route,
    },
    {
        path: '/error-500',
        name: 'Error - 500',
        component: Error500,
        route: Route,
    },
];

// flatten the list of all nested routes
const flattenRoutes = (routes: RoutesProps[]) => {
    let flatRoutes: RoutesProps[] = [];

    routes = routes || [];
    routes.forEach((item: RoutesProps) => {
        flatRoutes.push(item);

        if (typeof item.children !== 'undefined') {
            flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)];
        }
    });
    return flatRoutes;
};

// All routes
const authProtectedRoutes = [rootRoute, dashboardRoutes, ...appRoutes];
const publicRoutes = [...authRoutes, ...otherPublicRoutes];

const authProtectedFlattenRoutes = flattenRoutes([...authProtectedRoutes]);
const publicProtectedFlattenRoutes = flattenRoutes([...publicRoutes]);
export { publicRoutes, authProtectedRoutes, authProtectedFlattenRoutes, publicProtectedFlattenRoutes };
