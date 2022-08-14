import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// boostrap
import { Alert, Card, Col, Row, Button } from 'react-bootstrap';

// store
import { RootState, AppDispatch } from '../../redux/store';

// actions
import { moduleList, moduleDelete, moduleUpdateStatus, resetModule } from '../../redux/actions';

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
    const roleCanAdd : boolean = checkRole('moduleCreate');
    const roleCanUpdate : boolean = checkRole('moduleUpdate');
    const roleCanDelete : boolean = checkRole('moduleDelete');
    const roleCanSetActive : boolean = checkRole('moduleActive');

    const { auth, moduleListData, loading, error, messageSuccess, messageError } = useSelector((state: RootState) => ({
        auth: state.Auth.user.data,
        moduleListData: state.Module.data,
        loading: state.Module.loading,
        error: state.Module.dataError,
        messageError: state.Module.messageError,
        messageSuccess: state.Module.messageSuccess,
    }));

    useEffect(() => {
        dispatch(resetModule());
        !moduleListData && dispatch(moduleList());
    }, [dispatch]);

    /*
    handle refresh list
    */
    const handleRefreshList = () => {
        dispatch(moduleList());
    }

    /*
    handle update module status
    */
    const handleUpdateStatus = (parentId: number, childId: number, status : number) => {
        dispatch(moduleUpdateStatus(auth.id, parentId, childId, status));
    }

    /*
    handle update module status
    */
    const handleDelete = (parentId: number, childId : any = null) => {
        let text = t('Are you sure you want to delete this Module?');
        if (window.confirm(text) == true) {
            dispatch(moduleDelete(auth.id, parentId, childId));
        }
    }
    

    const SetButtons = (parentId : number, childId : number ) => {
        return (
            <>
                { 
                    roleCanUpdate && 
                    <Link to={`/module/edit/${parentId}/${childId}`}>
                        <Buttons name={ t('Edit') } color="success" classes="mx-1 btn-sm text-sm"/> 
                    </Link>
                }
                {
                    roleCanDelete && 
                    <Buttons name={ t('Delete') } color="danger" classes="mx-1 btn-sm" fn={() => handleDelete(parentId, childId)}/> 
                }
            </>
        );
    }

    const statusBadge = (active: number, parentId: number, childId : any = null) => {
        const isActive = active === 1 ? 
            {
                status: 0, //for update status
                name: t('Active'),
                color: 'primary'
            } : {
                status: 1, //for update status
                name: t('Inactive'),
                color: 'danger'
            };
        
        return (
            <Badges name={isActive.name} color={isActive.color} fn={() => roleCanSetActive && handleUpdateStatus(parentId, childId, isActive.status)}/>
        );
    };

    const data = moduleListData?.map((dt : any) => {
        const subRows = dt.child.map((chl : any) => {
            return {
                ...chl,
                status : statusBadge(chl.active, chl.module_parent, chl.id),
                action : SetButtons(chl.module_parent, chl.id)
            }
        });
        
        return {
            ...dt,
            status : statusBadge(dt.active, dt.module_parent, dt.id),
            action : SetButtons(dt.module_parent, dt.id),
            subRows : subRows
        };
    });

    const columns = [
        {
            Header: t('Name'),
            accessor: 'menu_name',
            sort: false,
        },
        {
            Header: t('Roles'),
            accessor: 'role',
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
                    { label: 'Module', path: '/module/list' , active: true},
                ]}
                title={t('Module Management')}
            />

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <div className='d-flex flex-row mb-4'>
                                <h4 className="header-title align-self-center m-0 flex-grow-1 bd-highlight">{ t('Module List') }</h4> 
                                { 
                                    roleCanAdd && 
                                    <Link
                                        to={'/module/create'}
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
                                        pageSize={200}
                                        isSortable={true}
                                        pagination={true}
                                        isSearchable={true}
                                        isExpandable={true}
                                        tableClass={'table-hover'}
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
