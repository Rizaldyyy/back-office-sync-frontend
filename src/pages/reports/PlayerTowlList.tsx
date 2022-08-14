import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

// boostrap
import { Alert, Card, Col, Row, Button } from 'react-bootstrap';

// store
import { RootState, AppDispatch } from '../../redux/store';

// actions
import { reportPlayerTowlList, resetReport, clusterList } from '../../redux/actions';

// helper
import { checkRole } from '../../helpers/roles';

// components
import PageTitle from '../../components/PageTitle';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';
import { FormInput, VerticalForm } from '../../components';
import { 
    ReportsModals, 
    DateRangePickerInput, 
    ClusterMultiSelect 
} from '../../components/CommonComponent';

interface ReportData {
    clusters: string[];
    dateFrom: string;
    dateTo: string;
    filter: string;
    groupBy: string;
    reportType: string;
}

const List = () => {
    const { t } = useTranslation();
    const dateToday = new Date();
    const dispatch = useDispatch<AppDispatch>();
    const [selectedDateFrom, setSelectedDateFrom] = useState<string>(new Date().toISOString().slice(0, 10));
    const [selectedDateTo, setSelectedDateTo] = useState<string>(new Date().toISOString().slice(0, 10));

    // check role
    const reportsRefetchPlayerTowl : boolean = checkRole('reportsRefetchPlayerTowl');

    const { auth, dataPlayerTowl, loading, error, messageError, cluster } = useSelector((state: RootState) => ({
        auth: state.Auth.user.data,
        dataPlayerTowl: state.Report.dataPlayerTowl,
        loading: state.Report.loading,
        error: state.Report.dataError,
        messageError: state.Report.messageError,
        cluster: state.Cluster.data,
    }));

    useEffect(() => {
        dispatch(resetReport());
        dispatch(clusterList(''));
    }, [dispatch]);

    const columns = [
        {
            Header: t('Cluster'),
            accessor: 'cluster_name',
            sort: false,
        },
        {
            Header: t('Date'),
            accessor: 'towl_date',
            sort: true,
        },
        {
            Header: t('Player Name'),
            accessor: 'data_name',
            sort: false,
        },
        {
            Header: t('Brand'),
            accessor: 'agent_name',
            sort: false,
        },
        {
            Header: t('Game'),
            accessor: 'provider_name',
            sort: false,
        },
        {
            Header: t('Turnover'),
            accessor: 'turnover',
            sort: false,
        },
        {
            Header: t('Winloss'),
            accessor: 'winloss',
            sort: false,
        },
    ];

    const data = dataPlayerTowl?.map((dt : any) => {
        return {
            ...dt,
            winloss : parseInt(dt.winloss) < 0 ? (<span className="text-danger"> {dt.winloss} </span>) : dt.winloss
        };
    });

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
    date change handle
    */
    const handleDateChange = (start: string, end: string) => {
        let dateStart = new Date(start);
        dateStart.setDate(dateStart.getDate() + 1);
        dateStart.toISOString().slice(0, 10);

        const dateFrom = new Date(dateStart).toISOString().slice(0, 10);
        const dateTo = new Date(end).toISOString().slice(0, 10);

        setSelectedDateFrom(dateFrom);
        setSelectedDateTo(dateTo);
    }

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
    const onSubmit = (formData: ReportData) => {
        formData['clusters'] = [];
        formData['dateFrom'] = selectedDateFrom;
        formData['dateTo'] = selectedDateTo;
        formData['reportType'] = "towlPlayer";

        const clusters = document.querySelectorAll('input[name=clusters]');
        clusters.forEach((list : any) => {
            return list.value !== "" && formData['clusters'].push(list.value);
        });

        const filter : any = document.querySelectorAll('input[name=filter]');
        formData['filter'] = filter[0].value;
        
        const groupby : any= document.querySelectorAll('select[name=groupBy]');
        formData['groupBy'] = groupby[0].value;
        
        dispatch(reportPlayerTowlList(formData));
    };

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Reports', path: '/reports/game-towl' , active: true},
                ]}
                title={t('Reports Management')}
            />

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <div className='d-flex flex-row mb-3'>
                                <h4 className="header-title align-self-center m-0 flex-grow-1 bd-highlight">{ t('Player Turnover - Winloss') }</h4>
                                { 
                                    reportsRefetchPlayerTowl && 
                                    <ReportsModals 
                                        name="Refetch Player TOWL" 
                                        endpoint="http://dev-backend.syncgames.xyz/api/reports/turnover-winloss-refetch" 
                                        reportType="towlPlayer"
                                    />
                                }
                            </div>

                            {error && typeof error === 'string' && (
                                <Alert variant="danger" className="my-2">
                                    { error }
                                </Alert>
                            )}

                            {validationError}
                            <br />

                            <VerticalForm<ReportData>
                                onSubmit={onSubmit}
                                >
                                    <div className="float-start w-25 mx-1">
                                        <label className="form-label">Clusters</label>
                                        <ClusterMultiSelect />
                                    </div>
                                    <div className="float-start w-25 mx-1">
                                        <label className="form-label">Date Range</label>
                                        <DateRangePickerInput fn={handleDateChange}/>
                                    </div>
                                    <div className="float-start w-20 mx-1">
                                        <FormInput
                                            label={ t('Player Name') }
                                            type="text"
                                            name="filter"
                                            placeholder={ t('Enter player name') }
                                        />
                                    </div>
                                    <div className="float-start w-20 mx-1">
                                        <FormInput
                                            label={ t('Group By') }
                                            type="select"
                                            name="groupBy"
                                            options={[
                                                {
                                                    name: "Agent",
                                                    value: "agent",
                                                },
                                                {
                                                    name: "Game",
                                                    value: "game",
                                                }
                                            ]}
                                        />
                                    </div>

                                    <div className="float-start text-start mx-1" style={{ 'marginTop': '28px' }}>
                                        <Button variant="primary" className="me-1" type="submit" disabled={loading}>
                                            { t('Submit') }
                                        </Button>
                                    </div>

                                    {loading && (
                                        <div className="float-start text-start mx-1" style={{ 'marginTop': '28px' }}>
                                            <Spinner color={'primary'}>
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner>
                                        </div>
                                    )}
                            </VerticalForm>
                            
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />

                            <Table
                                columns={columns}
                                data={data || []}
                                // pageSize={50}
                                isSortable={true}
                                pagination={true}
                                isSearchable={false}
                            />

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default List;
