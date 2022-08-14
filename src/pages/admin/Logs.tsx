import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// store
import { RootState, AppDispatch } from '../../redux/store';

// actions
import { adminLogs, resetAdmin } from '../../redux/actions';

// components
import PageTitle from '../../components/PageTitle';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';
import { Buttons } from '../../components/CommonComponent';


const Logs = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();


    const { data, loading, error } = useSelector((state: RootState) => ({
        data: state.Admin.logs,
        loading: state.Admin.loading,
        error: state.Admin.dataError,
    }));

    useEffect(() => {
        !data && dispatch(adminLogs('','','',''));
        dispatch(resetAdmin());
    }, [dispatch]);

    /*
    handle refresh list
    */
    const handleRefreshList = () => {
        dispatch(adminLogs('','','',''));
    }

    const columns = [
        {
            Header: t('Admin Name'),
            accessor: 'admin.username',
            sort: true,
        },
        {
            Header: t('Cluster'),
            accessor: 'cluster',
            sort: false,
        },
        {
            Header: t('Action'),
            accessor: 'action',
            sort: false,
        },
        {
            Header: t('Detail'),
            accessor: 'detail',
            sort: false,
        },
        {
            Header: t('Log IP'),
            accessor: 'admin_ip',
            sort: false,
        },
        {
            Header: t('Date'),
            accessor: 'created_at',
            sort: false,
        }
    ];

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Admin', path: '/admin/list' , active: true},
                ]}
                title={t('Admin Management')}
            />

            <div className="w-100">
                <Row>
                    <Col xl={12}>
                        <Card>
                            <Card.Body>
                            <div className='d-flex flex-row mb-4'>
                                <h4 className="header-title align-self-center m-0 flex-grow-1 bd-highlight">{t('Admin Logs')}</h4> 
                                <Buttons name={ t('Refresh List') } color="info" classes="btn-sm bd-highlight" fn={() => handleRefreshList()}/>
                            </div>

                                {error && (
                                    <Alert variant="danger" className="my-2">
                                        {error}
                                    </Alert>
                                )}

                                {
                                !loading ? 
                                    <Table
                                        columns={columns}
                                        data={data || []}
                                        // pageSize={50}
                                        isSortable={true}
                                        pagination={true}
                                        isSearchable={true}
                                    />
                                :
                                    <Spinner className="m-2 text-center" color={'primary'}>
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                    
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default Logs;
