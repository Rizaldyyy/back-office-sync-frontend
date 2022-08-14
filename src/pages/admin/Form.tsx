import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';

// boostrap
import { Alert, Card, Button, Col, Row } from 'react-bootstrap';

// store
import { RootState, AppDispatch } from '../../redux/store';

// actions
import { adminCreate, adminUpdate, adminLocation, resetAdmin, roleList } from '../../redux/actions';

// components
import PageTitle from '../../components/PageTitle';
import Spinner from '../../components/Spinner';
import { FormInput, VerticalForm } from '../../components';

interface AdminData {
    id? : number;
    adminId? : number;
    username: string;
    password: string;
    password_confirmation: string;
    group_id: number | string;
    role: number | string;
    location_id: number | string;
    location: number | string;
    change_password: boolean;
}

interface UpdateParameters {
    manage? : string;
    id? : string;
}

const AdminForm = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    const history = useHistory();
    const urlParams: UpdateParameters = useParams();
    let adminData:any = [];

    const { auth, admin, loading, location, messageSuccess, messageError, role, roleLoading, roleError } = useSelector((state: RootState) => ({
        auth: state.Auth.user.data,
        admin: state.Admin.data,
        loading: state.Admin.loading,
        location: state.Admin.location,
        messageSuccess: state.Admin.messageSuccess,
        messageError: state.Admin.messageError,
        role: state.Role.data,
        roleLoading: state.Role.loading,
        roleError: state.Role.dataError,
    }));

    useEffect(() => {
        dispatch(resetAdmin());
        dispatch(adminLocation());
        dispatch(roleList());
    }, [dispatch]);
    

    const roleOption = (role || []).map((rl : any) => {
        return {
            value: rl.id,
            name: rl.name,
        };
    });

    const locationOption = (location || []).map((loc : any) => {
        return {
            value: loc.id,
            name: loc.name,
        };
    });

    /*
    if the page is Edit Admin
    */
    if(urlParams.manage)
    {
        if(admin){
            const initData = admin.filter((adm : AdminData) => adm.id == urlParams.id);
            adminData = initData[0];
        }
        else{
            window.alert( t('Unable to load Admin data! Please go to Admin List and try again.') );
            history.push('/admin/list');
        }
    }

    /*
    form validation schema
    */
    const isEdit: boolean = urlParams.manage ? true : false;
    const schemaResolver = yupResolver(
        yup.object().shape({
            edit: yup.boolean().default(isEdit),
            username: yup.string().required( t('Please enter Username') ).matches(/^[0-9a-z]+$/, t('The username may only contain letters and numbers.')),
            password: yup.string().when("edit", {
                is: false,
                then: yup.string().required( t('Please enter Password') )
            }),
            password_confirmation: yup
            .string()
            .when("edit", {
                is: false,
                then: yup.string().oneOf([yup.ref('password'), null], t("Passwords don't match") )
                .required( t('This Confirm Password is required') )
            }),
            role: yup.string().required( t('Please select a role') ),
            location: yup.string().required( t('Please select a location') ),
        })
    );

    /*
    form validation backend
    */
    const validationError = Object.keys(messageError?.messageValidation || {}).map((key : any) => {
        return (
            <div className="d-block invalid-feedback">{key.toUpperCase()} : {messageError?.messageValidation[key]}</div>
        )
    });

   /*
    handle form submission create
    */
    const onSubmit = (formData: AdminData) => {
        formData['adminId'] = auth.id;
        formData['group_id'] = formData['role'];
        formData['location_id'] = formData['location'];

        // create
        let submit = adminCreate(formData);

        // update
        if(urlParams.manage){
            formData['id'] = adminData.id;
            submit = adminUpdate(formData);
        }

        dispatch(submit);
    };

    const successRedirect = () => {
        setTimeout(() => { 
            // history.push('/admin/list'); 
            window.location.reload();
        }, 1000)
    }

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Admin', path: '/admin/list' },
                ]}
                title={'Admin Management'}
            />

            <Card>
                <Card.Body>
                    <h4 className="header-title mt-0 mb-1">{urlParams.manage ? t('Edit Admin') : t('Add New Admin') }</h4>

                    {messageSuccess && (
                        <Alert variant="success" className="my-2">
                            {messageSuccess}
                            {successRedirect()}
                        </Alert>
                    )}

                    {messageError && typeof messageError === 'string' && (
                        <Alert variant="danger" className="my-2">
                            { messageError }
                        </Alert>
                    )}

                    {validationError}

                    {
                        !roleLoading ? 
                        <VerticalForm<AdminData>
                            onSubmit={onSubmit}
                            resolver={schemaResolver}
                            defaultValues={adminData && {
                                username: adminData.username, 
                                role: adminData.group_id, 
                                location: adminData.location_id, 
                                change_password: adminData.change_password=='1'? 1 : 0, 
                            }}>
                            <FormInput
                                label={ t('Username') }
                                type="text"
                                name="username"
                                placeholder={ t('Enter your Username') }
                                containerClass={'mt-3'}
                            />

                            <FormInput
                                label={ t('Password') }
                                type="password"
                                name="password"
                                placeholder={ t('Password') }
                                containerClass={'mt-3'}
                            />

                            <FormInput
                                label={ t('Confirm Password') }
                                type="password"
                                name="password_confirmation"
                                placeholder={ t('Confirm Password') }
                                containerClass={'mt-3'}
                            />

                            <FormInput
                                label={ t('Role') }
                                type="select"
                                name="role"
                                containerClass={'mt-3'}
                                options={ roleOption }
                            />
                            {roleError!==null && (
                                <div className="d-block invalid-feedback">{ t('Role Error: Unable to load role list.') }</div>
                            )}

                            <FormInput
                                label={ t('Location') }
                                type="select"
                                name="location"
                                containerClass={'mt-3'}
                                options={ locationOption }
                            />

                            <FormInput
                                label={ t('Change Password?') }
                                type="switch"
                                name="change_password"
                                containerClass={'my-3'}
                            />

                            <div className="float-end text-md-end mb-0">
                                <Button variant="primary" className="me-1" type="submit" disabled={loading}>
                                    {urlParams.manage ? t('Update') : t('Submit') }
                                </Button>
                                <Link to={'/admin/list'}>
                                    <Button variant="secondary" type="reset">
                                        { t('Cancel') }
                                    </Button>
                                </Link>
                            </div>

                            {loading && (
                                <div className="float-end mb-0 mx-2">
                                    <Spinner color={'primary'}>
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </div>
                            )}
                        </VerticalForm>
                    :
                        <Col xl={12}>
                            <Spinner className="m-2" color={'primary'}>
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </Col>
                    }

                </Card.Body>
            </Card>
        </>
    );
};

export default AdminForm;
