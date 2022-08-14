import { useSelector } from 'react-redux';

// store
import { RootState } from '../redux/store';

const GetAuth = () => {
    const { auth } = useSelector((state: RootState) => ({
        auth: state.Auth.user.data,
    }));

    return auth;
}

const checkRole = (role : string) : boolean => {
    const authData = GetAuth();
    return authData.group.module_roles.toLowerCase().includes(role.toLowerCase());
}

export { checkRole };
