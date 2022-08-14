import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';

// boostrap
import { Alert, Card, Button, Col, Row } from 'react-bootstrap';

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
    vendor: string;
}

interface SyncData {
    adminId? : number;
    clusters: string[];
    vendor: string;
    process: number;
    gamelists: string[];
}

const FormSync = () => {
    const api = new APICore();
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    const [getLoading, setGetLoading] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [vendor, setVendor] = useState('');
    const [vendors, setVendors] = useState([]);
    const [getList, setGetList] = useState([]);
    const [syncList, setSyncList] = useState([]);

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
    get list
    */
    const selectList = (data:any, id:number) : void =>  {
        setSyncList(prevSync => prevSync.concat(data));
        setGetList(prevGet => {
            return prevGet.filter((dt : any) => dt.slots_lobby_id !== id)
        });
    };

    const selectListAll = () : void =>  {
        getList.map((data : any, key : number) => {
            data.is_show && setSyncList(prevSync => prevSync.concat(data));
        });
        setGetList([]);
    };

    const searchList = (e: React.ChangeEvent<HTMLInputElement>) : void =>  {
        const name = e.target.value.toUpperCase();
        setGetList((prevList : any) => prevList.map((ls : any) => {
            return { ...ls, is_show : ls.slots_lobby_name.toUpperCase().includes(name) ? true : false };
        }));
    };

    /*
    selected list
    */
    const removeList = (data:any, id:number) : void =>  {
        setGetList(prevGet => prevGet.concat(data));
        setSyncList(prevSync => {
            return prevSync.filter((dt : any) => dt.slots_lobby_id !== id)
        });
    };

    const removeListAll = () : void =>  {
        syncList.map((data : any, key : number) => {
            data.is_show && setGetList(prevGet => prevGet.concat(data));
        });
        setSyncList([]);
    };

    const searchSelectedList = (e: React.ChangeEvent<HTMLInputElement>) : void =>  {
        const name = e.target.value.toUpperCase();
        setSyncList((prevList : any) => prevList.map((ls : any) => {
            return { ...ls, is_show : ls.slots_lobby_name.toUpperCase().includes(name) ? true : false };
        }));
    };

    /*
    onchange vendor
    */
    const vendorSet = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const vend = e.target.value;
        setVendor(vend);
    };

    /*
    onchange get vendors
    */
    const getVendors = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const params = {};
        const cluster = e.target.value;
        setVendors([]);
        setVendor('');
        setGetList([]);
        setSyncList([]);

        if(cluster === ""){
            return false;
        }

        const baseUrl = `/api/sync/get/${cluster}/vendors`;
        const response = await api.get(`${baseUrl}`, params)
            .then((response) => {
                const vends = response.data.data.map((vendor : any) => {
                    return { value: vendor.vendor_slug, name: vendor.vendor_name, }
                });
                setVendors(vends);
            }, (error) => {
                alert(error);
                return false;
            });
    };

    /*
    form validation schema get
    */
    const schemaResolverGet = yupResolver(
        yup.object().shape({
            cluster: yup.string().required( t('Please enter Cluster') ),
            vendor: yup.string().required( t('Please enter Vendor') ),
        })
    );

    /*
    form validation schema sync
    */
    const schemaResolverSync = yupResolver(
        yup.object().shape({
            process: yup.number().required( t('Please enter what Process') ),
        })
    );

   /*
    handle form submission get
    */
    const onSubmitGet = async (formData: GetData) => {
        const params = {};
        const cluster = formData['cluster'];
        const vendor = formData['vendor'];
        setGetList([]);
        setSyncList([]);
        setGetLoading(true);

        const baseUrl = `/api/sync/get/${cluster}/${vendor}/games`;
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
        formData['gamelists'] = [];
        formData['vendor'] = vendor;


        const clusters = document.querySelectorAll('input[name=clusters]');
        clusters.forEach((list : any) => {
            return formData['clusters'].push(list.value);
        });

        const blacklist = document.querySelectorAll('input[name=gamelists]');
        blacklist.forEach((list : any) => {
            return formData['gamelists'].push(list.value);
        });

        const baseUrl = `/api/sync/data/games`;
        const response = await api.create(`${baseUrl}`, formData)
        .then((response) => {
            alert(`Success: ${response.data.message}`);
            window.location.reload();
        }, (error) => {
            if (error.validation === true){
                setErrorMessage(error.messageValidation);
            }else{
                alert(`Error: ${error}`);
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
                    { label: 'Games Sync', path: '/bank-account/sync-games' },
                ]}
                title={'Game Management'}
            />

            <Row>
            <Col xl={6}>
                    <Card>
                        <Card.Body>
                            <h4 className="header-title mt-0 mb-1">{ t('From Cluster') }</h4>
                            <VerticalForm<GetData>
                                onSubmit={onSubmitGet}
                                resolver={schemaResolverGet}
                                >
                                {dataError!==null && (
                                    <div className="d-block invalid-feedback">{ t('Clusters Error: Unable to load cluster list.') }</div>
                                )}
                                
                                <FormInput
                                    label={ t('Cluster') }
                                    type="select"
                                    name="cluster"
                                    containerClass={'mt-3'}
                                    options={ clustersOptions }
                                    onChange={e => getVendors(e)}
                                />

                                <FormInput
                                    label={ t('Game Vendor') }
                                    type="select"
                                    name="vendor"
                                    options={vendors}
                                    containerClass={'mt-3'}
                                    onChange={e => vendorSet(e)}
                                />

                                <div style={{ height: '92px' }}></div>

                                <div className="mt-4 mb-2 d-flex flex-row justify-content-between align-items-center">
                                    <span className="text-uppercase"> { t('Games List') } </span>
                                    <Button variant="success" className="btn-xs" onClick={() => selectListAll()}>
                                            { t('Select All') }
                                    </Button>
                                </div>
                                <FormInput
                                    type="text"
                                    name="search"
                                    placeholder={ t('Search games') }
                                    onChange={e => searchList(e)}
                                />
                                <div className="border p-1" style={{ overflowX: 'hidden', height: '350px' }}>
                                    {
                                        getList.map((data : any, key : number) => {
                                            return (
                                                <div key={key} style={{ display: data.is_show ? 'block' : 'none' }}>
                                                    <div className="my-1 border p-2 d-flex flex-row justify-content-between align-items-center">
                                                        <label className="pl-0"> { data.slots_lobby_name } </label>
                                                        <Button variant="success" className="btn-xs" onClick={() => selectList(data, data.slots_lobby_id)}>
                                                            { t('Select') }
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>

                                <div className="text-md-start mt-3 mb-0">
                                    <Button variant="outline-warning" className="me-1" type="submit" disabled={getLoading}>
                                        { t('Get List') }
                                    </Button>
                                    <span className='mx-2'>{ t('Games List') }: { getList.length }</span>
                                    {getLoading && (
                                        <Spinner className="float-end" color={'primary'}>
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    )}
                                </div>
                            </VerticalForm>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card>
                        <Card.Body>
                            <h4 className="header-title mt-0 mb-1">{ t('To Cluster') }</h4>

                            {validationError}

                            <VerticalForm<SyncData>
                                onSubmit={onSubmitSync}
                                resolver={schemaResolverSync}
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
                                <FormInput
                                    label={ t('Game Vendor') }
                                    type="select"
                                    name="vendor"
                                    options={vendors}
                                    value={vendor}
                                    containerClass={'mt-3'}
                                    disabled
                                />
                                <FormInput
                                    label={ t('Sync Process') }
                                    type="select"
                                    name="process"
                                    options={[
                                        { value: 0, name: 'Default' },
                                        { value: 1, name: 'Truncate then Add' },
                                    ]}
                                    containerClass={'mt-3'}
                                />
                                
                                <div className="mt-4 mb-2 d-flex flex-row justify-content-between align-items-center">
                                    <span className="text-uppercase"> { t('Selected Games') } </span>
                                    <Button variant="danger" className="btn-xs" onClick={() => removeListAll()}>
                                            { t('Remove All') }
                                    </Button>
                                </div>
                                <FormInput
                                    type="text"
                                    name="search"
                                    placeholder={ t('Search selected games') }
                                    onChange={e => searchSelectedList(e)}
                                />
                                
                                <div className="border p-1" style={{ overflowX: 'hidden', height: '350px' }}>
                                    {
                                        (syncList || []).map((data : any, key : number) => {
                                            return (
                                                <div key={key} style={{ display: data.is_show ? 'block' : 'none' }}>
                                                    <input type="hidden" name="gamelists" value={data.rawData}/>
                                                    <div className="my-1 border p-2 d-flex flex-row justify-content-between align-items-center">
                                                        <label className="pl-0"> { data.slots_lobby_name } </label>
                                                        <Button variant="danger" className="btn-xs" onClick={() => removeList(data, data.slots_lobby_id)}>
                                                            { t('Remove') }
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>

                                <div className="d-flex flex-row justify-content-between align-items-center mt-3 mb-0">
                                    <div>
                                        <span className='mx-2'>{ t('Games List') }: { syncList.length }</span>
                                    </div>
                                    <div>
                                        {syncLoading && (
                                            <Spinner className="float-start mx-3" color={'primary'}>
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner>
                                        )}

                                        <Button variant="primary" className="me-1" type="submit" disabled={syncLoading}>
                                            { t('Sync') }
                                        </Button>
                                        <Button variant="secondary" type="reset" onClick={refreshPage}>
                                            { t('Cancel') }
                                        </Button>
                                    </div>
                                </div>
                            </VerticalForm>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default FormSync;
