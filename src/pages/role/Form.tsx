import React, { SyntheticEvent, useEffect } from 'react';
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
import { roleCreate, roleUpdate, resetRole, moduleList, resetModule, clusterList, resetCluster } from '../../redux/actions';

// components
import PageTitle from '../../components/PageTitle';
import Spinner from '../../components/Spinner';
import { FormInput, VerticalForm } from '../../components';

interface RoleData {
    id? : number;
    adminId? : number;
    name: string;
    module_roles: string[];
    cluster_roles: string[];
}

interface UpdateParameters {
    manage? : string;
    id? : string;
}

const RoleForm = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const history = useHistory();
    const urlParams: UpdateParameters = useParams();

    let roleData:any = [];
    let checkRole:any = [];
    let checkCluster:any = [];

    const { auth, role, loading, messageSuccess, messageError, moduleListData, modulesLoading, modulesError, clusterListData, clusterLoading, clusterError} = useSelector((state: RootState) => ({
        auth: state.Auth.user.data,
        role: state.Role.data,
        loading: state.Role.loading,
        messageSuccess: state.Role.messageSuccess,
        messageError: state.Role.messageError,
        moduleListData: state.Module.data,
        modulesLoading: state.Module.loading,
        modulesError: state.Module.dataError,
        clusterListData: state.Cluster.data,
        clusterLoading: state.Cluster.loading,
        clusterError: state.Cluster.dataError,
    }));

    useEffect(() => {
        dispatch(resetRole());
        dispatch(resetModule());
        dispatch(resetCluster());
        !moduleListData && dispatch(moduleList());
        !clusterListData && dispatch(clusterList(''));
    }, [dispatch]);

    const handleModuleInputCheckAll = (event: SyntheticEvent) => {
        const target : any = event.target;
        
        const modulesCheckboxes = document.querySelectorAll('.module-checkbox');
        modulesCheckboxes.forEach((checkbox : any) => {
            return checkbox.checked = target.checked;
        });
    };
    
    const handleClusterInputCheckAll = (event: SyntheticEvent) => {
        const target : any = event.target;

        const clustersCheckboxes = document.querySelectorAll('.cluster-checkbox');
        clustersCheckboxes.forEach((checkbox : any) => {
            return checkbox.checked = target.checked;
        });
    };

    /*
    if the page is Edit role
    */
    if(urlParams.manage)
    {
        if(role){
            const initData = role.filter((adm : RoleData) => adm.id == urlParams.id);
            roleData = initData[0];
            checkRole = JSON.parse(roleData.module_roles);
            checkCluster = JSON.parse(roleData.cluster_roles);
        }
        else{
            window.alert( t('Unable to load role data! Please go to Role List and try again.') );
            history.push('/role/list');
        }
    }

    /*
    form validation schema
    */
    const schemaResolver = yupResolver(
        yup.object().shape({
            name: yup.string().required( t('Please enter Role Name') ),
            module_roles: yup.array().of(yup.string()),
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
    const onSubmit = (formData: RoleData) => {
        formData['adminId'] = auth.id;
        formData['module_roles'] = [];
        formData['cluster_roles'] = [];

        const moduleCheckboxes = document.querySelectorAll('.module-checkbox');
        moduleCheckboxes.forEach((checkbox : any) => {
            return checkbox.checked && formData['module_roles'].push(checkbox.value);
        });

        const clustersCheckboxes = document.querySelectorAll('.cluster-checkbox');
        clustersCheckboxes.forEach((checkbox : any) => {
            return checkbox.checked && formData['cluster_roles'].push(checkbox.value);
        });

        // create
        let submit = roleCreate(formData);

        // update
        if(urlParams.manage){
            formData['id'] = roleData.id;
            submit = roleUpdate(formData);
        }

        dispatch(submit);
    };

    const successRedirect = () => {
        setTimeout(() => { 
            // history.push('/role/list'); 
            window.location.reload();
        }, 1000)
    }

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Role', path: '/role/list' },
                ]}
                title={'Role Management'}
            />

            <Card>
                <Card.Body>
                    <h4 className="header-title mt-0 mb-1">{urlParams.manage ? t('Edit Role') : t('Add Role') }</h4>

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
                        !modulesLoading && !clusterLoading ? 
                            <VerticalForm<RoleData>
                                onSubmit={onSubmit}
                                resolver={schemaResolver}
                                defaultValues={roleData && {
                                    name: roleData.name, 
                                }}>
                                <FormInput
                                    label={ t('Role Name') }
                                    type="text"
                                    name="name"
                                    placeholder={ t('Enter Role Name') }
                                    containerClass={'mt-3'}
                                />
                                <section className='my-3 border-top'>
                                    <div className="flex flex-row">
                                        <div><h5 className="my-3">{ t('Module') }</h5></div>
                                        <div className="form-check my-2">
                                            <input
                                                type="checkbox" 
                                                className="form-check-input module-checkbox" 
                                                value="checkAllModules"
                                                name="checkAllModules"
                                                id="checkAllModules"
                                                onChange={handleModuleInputCheckAll}
                                            />
                                            <label htmlFor="checkAllModules" className="form-check-label">
                                                { t('Check All') }
                                            </label>
                                        </div>
                                    </div>
                                    {modulesError!==null && (
                                        <div className="d-block invalid-feedback">{ t('Module: Unable to load module list.') }</div>
                                    )}
                                    <Row>
                                    {
                                        (moduleListData || []).map((module : any, key : number) => {
                                            return (
                                                <Col xl={3} className="my-2" key={key}>
                                                    <h5 className="header-title mt-0 mb-1">{ module.menu_name }</h5>
                                                    {
                                                        (module.child || []).map((chl : any, keyChild : number) => {
                                                            return (
                                                                <div className="form-check my-2" key={keyChild}>
                                                                    <input
                                                                        type="checkbox" 
                                                                        className="form-check-input module-checkbox" 
                                                                        value={chl.role}
                                                                        name={chl.role}
                                                                        id={chl.role}
                                                                        defaultChecked={ checkRole.indexOf(chl.role) === -1 ? false : true }
                                                                    />
                                                                    <label htmlFor={chl.role} className="form-check-label">
                                                                        {chl.menu_name}
                                                                    </label>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </Col>
                                            );
                                        })
                                    }
                                    </Row>
                                </section>

                                <section className="my-3 border-top">
                                    <div className="flex flex-row">
                                        <div><h5 className="mt-3">{ t('Clusters') }</h5></div>
                                        <div className="form-check my-2">
                                            <input
                                                type="checkbox" 
                                                className="form-check-input" 
                                                value="checkAllClusters"
                                                name="checkAllClusters"
                                                id="checkAllClusters"
                                                onChange={handleClusterInputCheckAll}
                                            />
                                            <label htmlFor="checkAllClusters" className="form-check-label">
                                                { t('Check All') }
                                            </label>
                                        </div>
                                    </div>
                                    <Row>
                                        {clusterError!==null && (
                                            <div className="d-block invalid-feedback">{ t('Clusters Error: Unable to load cluster list.') }</div>
                                        )}
                                        {
                                            (clusterListData || []).map((cluster : any, key : number) => {
                                                return (
                                                    <Col xl={2} key={key}>
                                                        <div className="form-check my-2">
                                                            <input
                                                                type="checkbox" 
                                                                className="form-check-input cluster-checkbox" 
                                                                value={ cluster.slug }
                                                                name={ cluster.slug }
                                                                id={ cluster.slug }
                                                                defaultChecked={ checkCluster.indexOf(cluster.slug) === -1 ? false : true }
                                                            />
                                                            <label htmlFor={ cluster.slug } className="form-check-label">
                                                            { cluster.name.toUpperCase() }
                                                            </label>
                                                        </div>
                                                    </Col>
                                                );
                                            })
                                        }
                                    </Row>
                                </section>

                                <div className="float-end text-md-end mb-0">
                                    <Button variant="primary" className="me-1" type="submit" disabled={loading}>
                                        {urlParams.manage ? t('Update') : t('Submit') }
                                    </Button>
                                    <Link to={'/cluster/list'}>
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

export default RoleForm;
