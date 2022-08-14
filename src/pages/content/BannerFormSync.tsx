import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';

// boostrap
import { Form, Card, Button, Col, Row } from 'react-bootstrap';

// store
import { RootState, AppDispatch } from '../../redux/store';

// actions
import { clusterList, resetCluster} from '../../redux/actions';

// components
import PageTitle from '../../components/PageTitle';
import { FormInput, VerticalForm } from '../../components';
import Spinner from '../../components/Spinner';

// ApiCore
import { APICore } from '../../helpers/api/apiCore';
interface GetData {
    cluster: string;
}

interface SyncData {
    adminId? : number;
    clusters: string[];
    slotbanner_name: string;
    slotbanner: string[];
}

const BannerFormSync = () => {
    const api = new APICore();
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    const [getLoading, setGetLoading] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [getList, setGetList] = useState([]);

    const { auth, cluster, dataError } = useSelector((state: RootState) => ({
        auth: state.Auth.user.data,
        cluster: state.Cluster.data,
        dataError: state.Cluster.dataError,
    }));

    useEffect(() => {
        dispatch(resetCluster());
        dispatch(clusterList(''));
    }, [dispatch]);

    const refreshPage = () => {
        window.location.reload();
    };

    /*
    cluster options
    */
    const clustersRoles = JSON.parse(auth.group.cluster_roles);
    const filteredClusters = (cluster || []).filter((br : any) => clustersRoles.indexOf(br.name) !== -1)
    const clustersOptions = (filteredClusters || []).map((br : any) => {
        return {
            value: br.slug,
            name: br.name.toUpperCase(),
            label: br.name.toUpperCase(),
        };
    });

    /*
    search data
    */
    const searchList = (e: React.ChangeEvent<HTMLInputElement>) : void =>  {
        const name = e.target.value.toUpperCase();
        setGetList((prevList : any) => prevList.map((ls : any) => {
            return { ...ls, is_show : ls.slotbanner_name.toUpperCase().includes(name) ? true : false };
        }));
    };

    /*
    form validation schema get
    */
    const schemaResolverGet = yupResolver(
        yup.object().shape({
            cluster: yup.string().required( t('Please enter Cluster') ),
        })
    );

   /*
    handle form submission get
    */
    const onSubmitGet = async (formData: GetData) => {
        const params = {};
        const cluster = formData['cluster'];
        setGetList([]);
        setGetLoading(true);

        const baseUrl = `/api/sync/get/${cluster}/slotbanners`;
        const response = await api.get(`${baseUrl}`, params)
        .then((response) => {
            setGetList(response.data.data);
        }, (error) => {
            alert(error);
            return false;
        });

        setGetLoading(false);
    };

    /*
    handle form submission sync
    */
    const onSubmitSync = async (formData: SyncData) => {
        setErrorMessage('');
        setSyncLoading(true);

        formData['adminId'] = auth.id;
        formData['clusters'] = [];

        const clusters = document.querySelectorAll('input[name=clusters]');
        clusters.forEach((list : any) => {
            return formData['clusters'].push(list.value);
        });

        const slotbanner: any = document.querySelectorAll('input[name=slotbanner]:checked');
        formData['slotbanner'] = slotbanner[0]?.value; // get value of selected slot banner
        formData['slotbanner_name'] = slotbanner[0]?.labels[0].textContent; // get name of selected slot banner

        const baseUrl = `/api/sync/data/slotbanners`;
        const response = await api.create(`${baseUrl}`, formData)
        .then((response) => {
            alert(`Success: ${response.data.message}`);
            // window.location.reload();
        }, (error) => {
            if (error.validation === true){
                setErrorMessage(error.messageValidation);
            }else{
                alert(error);
            }
            return false;
        });

        setSyncLoading(false);
    };

    /*
    form validation backend
    */
    const validationError = Object.keys(errorMessage || {}).map((key : any) => {
        return (
            <div className="d-block invalid-feedback">{key.toUpperCase()} : {errorMessage[key]}</div>
        )
    });

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Slot Banner Sync', path: '/content/sync slot-banner' },
                ]}
                title={'Content Management'}
            />
            <Card>
                <Card.Body>
                    <h4 className="header-title mt-0 mb-1">{ t('From Cluster') }</h4>

                    {dataError!==null && (
                        <div className="d-block invalid-feedback">{ t('Clusters Error: Unable to load cluster list.') }</div>
                    )}

                    {validationError}

                    

                    <Row>
                        <Col xl={6}>

                            <VerticalForm<GetData>
                                onSubmit={onSubmitGet}
                                resolver={schemaResolverGet}
                                >
                        
                                <FormInput
                                    label={ t('Cluster') }
                                    type="select"
                                    name="cluster"
                                    containerClass={'mt-3'}
                                    options={ clustersOptions }
                                />
                            
                                <div className="text-md-start mt-3 mb-0">
                                    <Button variant="outline-warning" className="me-1" type="submit">
                                        { t('Get Slot Banner') }
                                    </Button>
                                    <span className='mx-2'>{ t('Slot Banner List') }: { getList.length }</span>
                                    {getLoading && (
                                        <Spinner className="float-end" color={'primary'}>
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    )}
                                </div>
                            </VerticalForm>
                        </Col>
                        <Col xl={6}>
                            <VerticalForm<SyncData>
                                    onSubmit={onSubmitSync}
                                    >
                                <div className="mt-3">
                                    <label className="form-label">Clusters</label>
                                    <Select
                                        name={'clusters'}
                                        placeholder={'Select Clusters'}
                                        isMulti={true}
                                        options={ clustersOptions }
                                        className="react-select react-select-container"
                                        classNamePrefix="react-select"></Select>
                                </div>
                                <div className="d-flex flex-row justify-content-between align-items-center mt-3 mb-0">
                                    <div>
                                        <span className='mx-2'>Slot Banner List: </span>
                                    </div>
                                    <div>
                                        {syncLoading && (
                                            <Spinner className="float-start mx-3" color={'primary'}>
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner>
                                        )}
                                        <Button variant="primary" className="me-1" type="submit">
                                            { t('Sync') }
                                        </Button>
                                        <Button variant="secondary" type="reset" onClick={refreshPage}>
                                            { t('Cancel') }
                                        </Button>
                                    </div>
                                </div>
                            </VerticalForm>
                        </Col>
                    </Row>

                    <div className="mt-4 mb-2 d-flex flex-row justify-content-between align-items-center">
                        <span className="text-uppercase"> { t('Slot Banner List') } </span>
                    </div>
                    <FormInput
                        type="text"
                        name="search"
                        placeholder={ t('Search slot banner') }
                        onChange={e => searchList(e)}
                    />
                    <div className="border p-1" style={{ overflowX: 'hidden', height: '350px' }}>
                        {
                            getList.map((data : any, key : number) => {
                                return (
                                    <div key={key} style={{ display: data.is_show ? 'block' : 'none' }}>
                                        <div className="my-1 border p-2 d-flex flex-row justify-content-start align-items-center">
                                            <Form.Check
                                                type="radio"
                                                className="mb-1"
                                                id={data.site_id}
                                                name="slotbanner"
                                                label={data.slotbanner_name}
                                                value={data.rawData}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Card.Body>
            </Card>
        </>
    );
};

export default BannerFormSync;
