import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';

// boostrap
import { Alert, Card, Button } from 'react-bootstrap';

// store
import { RootState, AppDispatch } from '../../redux/store';

// components
import PageTitle from '../../components/PageTitle';
import { FormInput, VerticalForm } from '../../components';

// actions
import { resetAdmin, adminChangePassword } from '../../redux/actions';

interface ChangePasswordData {
    id: number;
    password: string;
    new_password: string;
    new_password_confirmation: string;
}

const ChangePassword = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const history = useHistory();

    const { auth, loading, messageSuccess, messageError } = useSelector((state: RootState) => ({
        auth: state.Auth.user.data,
        loading: state.Admin.loading,
        messageSuccess: state.Admin.messageSuccess,
        messageError: state.Admin.messageError,
    }));

    useEffect(() => {
        dispatch(resetAdmin());
    }, [dispatch]);
    

    /*
    form validation schema
    */

    const schemaResolver = yupResolver(
        yup.object().shape({
            password: yup.string().required( t('Please enter Password') ),
            new_password: yup.string().required( t('Please enter New Password') ),
            new_password_confirmation: yup
            .string()
            .oneOf([yup.ref('new_password'), null], t("New Passwords don't match") )
            .required( t('This Confirm New Password is required') ),
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
    const onSubmit = (formData: ChangePasswordData) => {
        formData['id'] = auth.id;
        dispatch(adminChangePassword(formData));
    };

    const successRedirect = () => {
        setTimeout(() => { history.push('/admin/list'); }, 1000)
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
                    <h4 className="header-title mt-0 mb-1">{t('Change Password') }</h4>

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

                    <VerticalForm<ChangePasswordData>
                        onSubmit={onSubmit}
                        resolver={schemaResolver}>

                        <FormInput
                            label={ t('Password') }
                            type="password"
                            name="password"
                            placeholder={ t('Password') }
                            containerClass={'mt-3'}
                        />

                        <FormInput
                            label={ t('New Password') }
                            type="password"
                            name="new_password"
                            placeholder={ t('New Password') }
                            containerClass={'mt-3'}
                        />
                         <div className="d-block fs-11 text-warning">{ t('* Password min 8 characters. Password must consist of uppercase, lowercase letter and number') }</div>

                        <FormInput
                            label={ t('Confirm New Password') }
                            type="password"
                            name="new_password_confirmation"
                            placeholder={ t('Confirm New Password') }
                            containerClass={'my-3'}
                        />

                        <div className="text-md-end mb-0">
                            <Button variant="primary" className="me-1" type="submit">
                                { t('Submit') }
                            </Button>
                            <Link to={'/admin/list'}>
                                <Button variant="secondary" type="reset">
                                    { t('Cancel') }
                                </Button>
                            </Link>
                        </div>
                    </VerticalForm>
                </Card.Body>
            </Card>
        </>
    );
};

export default ChangePassword;
