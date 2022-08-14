import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

// boostrap
import { Alert, Card, Col, Row, Button } from 'react-bootstrap';

// store
import { RootState, AppDispatch } from '../../redux/store';

// actions
import { reportGameTowlList, resetReport } from '../../redux/actions';

// helper
import { checkRole } from '../../helpers/roles';

// components
import PageTitle from '../../components/PageTitle';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';
import { VerticalForm } from '../../components';
import { 
    ReportsModals, 
    DateRangePickerInput, 
    ClusterMultiSelect 
} from '../../components/CommonComponent';

interface ReportData {
    clusters: string[];
    dateFrom: string;
    dateTo: string;
    reportType: string;
}

const List = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const [selectedDateFrom, setSelectedDateFrom] = useState<string>(new Date().toISOString().slice(0, 10));
    const [selectedDateTo, setSelectedDateTo] = useState<string>(new Date().toISOString().slice(0, 10));

    // check role
    const reportsRefetchGameTowl : boolean = checkRole('reportsRefetchGameTowl');

    const { auth, dataGameTowl, loading, error, messageError } = useSelector((state: RootState) => ({
        auth: state.Auth.user.data,
        dataGameTowl: state.Report.dataGameTowl,
        loading: state.Report.loading,
        error: state.Report.dataError,
        messageError: state.Report.messageError
    }));

    useEffect(() => {
        dispatch(resetReport());
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
            Header: t('Game Name'),
            accessor: 'data_name',
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

    const data = dataGameTowl?.map((dt : any) => {
        return {
            ...dt,
            winloss : parseInt(dt.winloss) < 0 ? (<span className="text-danger"> {dt.winloss} </span>) : dt.winloss
        };
    });

    /*
    handle date change
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
        formData['reportType'] = "towlGame";

        const clusters = document.querySelectorAll('input[name=clusters]');
        clusters.forEach((list : any) => {
            return list.value !== "" && formData['clusters'].push(list.value);
        });
        
        dispatch(reportGameTowlList(formData));
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
                                <h4 className="header-title align-self-center m-0 flex-grow-1 bd-highlight">{ t('Game Turnover - Winloss') }</h4>
                                { 
                                    reportsRefetchGameTowl && 
                                    <ReportsModals 
                                        name="Refetch Game TOWL" 
                                        endpoint="http://dev-backend.syncgames.xyz/api/reports/turnover-winloss-refetch" 
                                        reportType="towlGame"
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
                                isSearchable={true}
                            />

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default List;
