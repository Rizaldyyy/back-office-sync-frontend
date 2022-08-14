import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// boostrap
import { Alert, Card, Col, Row, Button } from 'react-bootstrap';

// store
import { RootState, AppDispatch } from '../../redux/store';

// actions
import { adminList, adminDelete, adminUpdateStatus, resetAdmin } from '../../redux/actions';

// helper
import { checkRole } from '../../helpers/roles';

// components
import PageTitle from '../../components/PageTitle';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';
import { Buttons, Badges, Toasts } from '../../components/CommonComponent';

const List = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch<AppDispatch>();
    const roleCanAdd : boolean = checkRole('adminCreate');
    const roleCanUpdate : boolean = checkRole('adminUpdate');
    const roleCanDelete : boolean = checkRole('adminDelete');
    const roleCanSetActive : boolean = checkRole('adminActive');

    const { auth, adminListData, loading, error, messageSuccess, messageError } = useSelector((state: RootState) => ({
        auth: state.Auth.user.data,
        adminListData: state.Admin.data,
        loading: state.Admin.loading,
        error: state.Admin.dataError,
        messageError: state.Admin.messageError,
        messageSuccess: state.Admin.messageSuccess,
    }));

    useEffect(() => {
        dispatch(resetAdmin());
        !adminListData && dispatch(adminList());
    }, [dispatch]);

    /*
    handle refresh list
    */
    const handleRefreshList = () => {
        dispatch(adminList());
    }

    /*
    handle update admin status
    */
    const handleUpdateStatus = (id: number, status : number) => {
        dispatch(adminUpdateStatus(auth.id, id, status));
    }

    /*
    handle update admin status
    */
    const handleDelete = (id: number) => {
        let text = t('Are you sure you want to delete this Admin?');
        if (window.confirm(text) == true) {
            dispatch(adminDelete(auth.id, id));
        }
    }
    

    const SetButtons = (id : number) => {
        return (
            <>
                { 
                    roleCanUpdate && 
                    <Link to={`/admin/edit/${id}`}>
                        <Buttons name={ t('Edit') } color="success" classes="mx-1 btn-sm text-sm"/> 
                    </Link>
                }
                {
                    roleCanDelete && 
                    <Buttons name={ t('Delete') } color="danger" classes="mx-1 btn-sm" fn={() => handleDelete(id)}/> 
                }
            </>
        );
    }

    const data = adminListData?.map((dt : any) => {

        const statusInfo = dt.status === 1 ? 
            {
                status: 0, //for update status
                name: t('Active'),
                color: 'primary'
            } : {
                status: 1, //for update status
                name: t('Inactive'),
                color: 'danger'
            };
        
        return {
            ...dt,
            status : <Badges name={statusInfo.name} color={statusInfo.color} fn={() => roleCanSetActive && handleUpdateStatus(dt.id, statusInfo.status)}/>,
            action : SetButtons(dt.id)
        };
    });

    const columns = [
        {
            Header: t('Username'),
            accessor: 'username',
            sort: true,
        },
        {
            Header: t('Location'),
            accessor: 'location.name',
            sort: false,
        },
        {
            Header: t('Role'),
            accessor: 'group.name',
            sort: false,
        },
        {
            Header: t('Last Login Date'),
            accessor: 'login_date',
            sort: false,
        },
        {
            Header: t('Last Login IP'),
            accessor: 'login_ip',
            sort: false,
        },
        {
            Header: t('Status'),
            accessor: 'status',
            sort: false
        },
        {
            Header: '',
            accessor: 'action',
            sort: false,
        },
    ];

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Admin', path: '/admin/list' , active: true},
                ]}
                title={t('Admin Management')}
            />

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <div className='d-flex flex-row mb-4'>
                                <h4 className="header-title align-self-center m-0 flex-grow-1 bd-highlight">{ t('Admin List') }</h4> 
                                { 
                                    roleCanAdd && 
                                    <Link
                                        to={'/admin/create'}
                                    >
                                    <Buttons name={ t('Add New') } color="primary" classes="mx-2 btn-sm"/> 
                                    </Link>
                                }
                                <Buttons name={ t('Refresh List') } color="info" classes="btn-sm bd-highlight" fn={() => handleRefreshList()}/> 
                            </div>

                            {error && (
                                <Alert variant="danger" className="my-2">
                                    {error}
                                </Alert>
                            )}

                            {messageSuccess && (
                                <Toasts message={messageSuccess} color="success" />
                            )}
                            
                            {messageError && (
                                <Toasts message={messageError} color="danger" />
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
                                <Col xl={12}>
                                    <Spinner className="m-2" color={'primary'}>
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </Col>
                            }

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default List;
