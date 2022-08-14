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
import { clusterCreate, clusterUpdate, resetCluster} from '../../redux/actions';

// components
import PageTitle from '../../components/PageTitle';
import Spinner from '../../components/Spinner';
import { FormInput, VerticalForm } from '../../components';

interface ClusterData {
    id? : number;
    adminId? : number;
    name: string;
    api_url: string;
    cluster_url: string;
}

interface UpdateParameters {
    manage? : string;
    id? : string;
}

const ClusterForm = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    const history = useHistory();
    const urlParams: UpdateParameters = useParams();
    let clusterData:any = [];

    const { auth, cluster, loading, messageSuccess, messageError} = useSelector((state: RootState) => ({
        auth: state.Auth.user.data,
        cluster: state.Cluster.data,
        loading: state.Cluster.loading,
        messageSuccess: state.Cluster.messageSuccess,
        messageError: state.Cluster.messageError,
    }));

    useEffect(() => {
        dispatch(resetCluster());
    }, [dispatch]);

    /*
    if the page is Edit cluster
    */
    if(urlParams.manage)
    {
        if(cluster){
            const initData = cluster.filter((adm : ClusterData) => adm.id == urlParams.id);
            clusterData = initData[0];
        }
        else{
            window.alert( t('Unable to load cluster data! Please go to Cluster List and try again.') );
            history.push('/cluster/list');
        }
    }

    /*
    form validation schema
    */
    const schemaResolver = yupResolver(
        yup.object().shape({
            name: yup.string().required( t('Please enter Cluster Name') ),
            url: yup.string().required( t('Please enter API Url') ),
            cluster_url: yup.string().required( t('Please enter Cluster Url') ),
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
    const onSubmit = (formData: ClusterData) => {
        formData['adminId'] = auth.id;

        // create
        let submit = clusterCreate(formData);

        // update
        if(urlParams.manage){
            formData['id'] = clusterData.id;
            submit = clusterUpdate(formData);
        }

        dispatch(submit);
    };

    const successRedirect = () => {
        setTimeout(() => { 
            // history.push('/cluster/list'); 
            window.location.reload();
        }, 1000)
    }

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Cluster', path: '/cluster/list' },
                ]}
                title={'Cluster Management'}
            />

            <Card>
                <Card.Body>
                    <h4 className="header-title mt-0 mb-1">{urlParams.manage ? t('Edit Cluster') : t('Add Cluster') }</h4>

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

                    <VerticalForm<ClusterData>
                        onSubmit={onSubmit}
                        resolver={schemaResolver}
                        defaultValues={clusterData && {
                            name: clusterData.name, 
                            url: clusterData.url, 
                            cluster_url: clusterData.cluster_url
                        }}>
                        <FormInput
                            label={ t('Cluster Name') }
                            type="text"
                            name="name"
                            placeholder={ t('Enter Cluster Name') }
                            containerClass={'mt-3'}
                        />

                        <FormInput
                            label={ t('API Url') }
                            type="text"
                            name="url"
                            placeholder={ t('Enter API Url') }
                            containerClass={'mt-3'}
                        />
                        
                        <FormInput
                            label={ t('Cluster Url') }
                            type="text"
                            name="cluster_url"
                            placeholder={ t('Enter Cluster Url') }
                            containerClass={'my-3'}
                        />

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
                </Card.Body>
            </Card>
        </>
    );
};

export default ClusterForm;
