import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// boostrap
import { Alert, Card, Col, Row, Button } from 'react-bootstrap';

// store
import { RootState, AppDispatch } from '../../redux/store';

// actions
import { roleList, roleDelete, roleUpdateStatus, resetRole } from '../../redux/actions';

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
    const roleCanAdd : boolean = checkRole('roleCreate');
    const roleCanUpdate : boolean = checkRole('roleUpdate');
    const roleCanDelete : boolean = checkRole('roleDelete');
    const roleCanSetActive : boolean = checkRole('roleActive');

    const { auth, roleListData, loading, error, messageSuccess, messageError } = useSelector((state: RootState) => ({
        auth: state.Auth.user.data,
        roleListData: state.Role.data,
        loading: state.Role.loading,
        error: state.Role.dataError,
        messageError: state.Role.messageError,
        messageSuccess: state.Role.messageSuccess,
    }));

    useEffect(() => {
        dispatch(resetRole());
        !roleListData && dispatch(roleList());
    }, [dispatch]);

    /*
    handle refresh list
    */
    const handleRefreshList = () => {
        dispatch(roleList());
    }

    /*
    handle update role status
    */
    const handleUpdateStatus = (id: number, status : number) => {
        dispatch(roleUpdateStatus(auth.id, id, status));
    }

    /*
    handle update role status
    */
    const handleDelete = (aid: number) => {
        let text = t('Are you sure you want to delete this Role?');
        if (window.confirm(text) == true) {
            dispatch(roleDelete(auth.id, aid));
        }
    }
    

    const SetButtons = (id : number) => {
        return (
            <>
                { 
                    roleCanUpdate && 
                    <Link to={`/role/edit/${id}`}>
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

    const data = roleListData?.map((dt : any) => {

        const statusInfo = dt.active === 1 ? 
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
            Header: t('Name'),
            accessor: 'name',
            sort: true,
        },
        {
            Header: t('Modules'),
            accessor: 'module_roles',
            sort: false,
        },
        {
            Header: t('Roles'),
            accessor: 'cluster_roles',
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
                    { label: 'Role', path: '/role/list' , active: true},
                ]}
                title={t('Role Management')}
            />

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <div className='d-flex flex-row mb-4'>
                                <h4 className="header-title align-self-center m-0 flex-grow-1 bd-highlight">{ t('Role List') }</h4> 
                                { 
                                    roleCanAdd && 
                                    <Link
                                        to={'/role/create'}
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
