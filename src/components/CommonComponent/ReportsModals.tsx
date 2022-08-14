import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// components
import { FormInput, VerticalForm } from '../../components';
import Spinner from '../../components/Spinner';

// store
import { RootState } from '../../redux/store';

// boostrap
import { Button, Modal } from 'react-bootstrap';

// ApiCore
import { APICore } from '../../helpers/api/apiCore';

import { DateRangePickerInput } from '../CommonComponent';

interface ModalsProps {
    name: string;
    endpoint: string;
    reportType: any;
}

interface RefetchData {
    adminId: number;
    cluster: string;
    whitelabel: number;
    dateFrom: string;
    dateTo: string;
    reportType: string;
}

const ReportModals = ({ name, endpoint, reportType } : ModalsProps) => {
    const api = new APICore();
    const { t } = useTranslation();
    const [show, setShow] = useState<boolean>(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [errorMessage, setErrorMessage] = useState('');
    const [refetchLoading, setRefetchLoading] = useState<boolean>(false);
    const [refetchDateFrom, setRefetchDateFrom] = useState<string>(new Date().toISOString().slice(0, 10));
    const [refetchDateTo, setRefetchDateTo] = useState<string>(new Date().toISOString().slice(0, 10));
    const [whitelabels, setWhitelabels] = useState<string[]>([]);

    const { auth, cluster } = useSelector((state: RootState) => ({
        auth: state.Auth.user.data,
        cluster: state.Cluster.data,
    }));

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

        setRefetchDateFrom(dateFrom);
        setRefetchDateTo(dateTo);
    }

    /*
    form validation backend
    */
    const validationError = Object.keys(errorMessage || {}).map((key : any) => {
        return (
            <div className="d-block invalid-feedback">{key.toUpperCase()} : {errorMessage[key]}</div>
        )
    });
    
    /*
    onchange get whitelabels
    */
    const getWhitelabels = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMessage('');
        setWhitelabels([]);

        const params = {};
        const cluster = e.target.value;
        if(cluster === ""){
            return false;
        }

        const baseUrl = `api/get/${cluster}/whitelabel`;
        const response = await api.get(`${baseUrl}`, params)
            .then((response) => {
                const whitelabels : string[] = response.data.data.map((whitelabel : any) => {
                    return { value: whitelabel.whitelabel_id, name: whitelabel.whitelabel_name, }
                });
                setWhitelabels(whitelabels);
            }, (error) => {
                alert(error);
                return false;
            });
    };

    /*
    handle submit
    */
    const handleSubmit = async (formData : RefetchData) => {
        setErrorMessage('');
        setRefetchLoading(true);
        
        const cluster : any = document.querySelectorAll('select[name=cluster]');
        formData['cluster'] = cluster[0].value;

        const whitelabel : any = document.querySelectorAll('select[name=whitelabel]');
        formData['whitelabel'] = whitelabel[0].value;

        formData['adminId'] = auth.id;
        formData['dateFrom'] = refetchDateFrom;
        formData['dateTo'] = refetchDateTo;
        formData['reportType'] = reportType;

        const baseUrl = endpoint;
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

        setRefetchLoading(false);
    }

    return (
        <>
            <div className="button-list">
                <Button variant="primary" className="btn-sm" onClick={handleShow}>
                    {name}
                </Button>
            </div>

            {/* standard modal */}
            <Modal show={show} onHide={handleClose}>
                <VerticalForm<RefetchData>
                    onSubmit={handleSubmit}
                    >
                    <Modal.Header onHide={handleClose} closeButton>
                        <Modal.Title as="h5">{name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {validationError}
                        <div className="my-1">
                            <FormInput
                                label={ t('Cluster') }
                                type="select"
                                name="cluster"
                                options={ clustersOptions }
                                onChange={e => getWhitelabels(e)}
                            />
                        </div>
                        <div className="my-2">
                            <FormInput
                                label={ t('Whitelabel Cluster') }
                                type="select"
                                name="whitelabel"
                                options={ whitelabels }
                            />
                        </div>
                        <div className="my-2">
                            <label className="form-label">Date Range</label> 
                            <DateRangePickerInput fn={handleDateChange}/>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {refetchLoading && (
                            <Spinner className="float-start mx-3" color={'primary'}>
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        )}
                        <Button variant="light" onClick={handleClose}>
                            { t('Cancel') }
                        </Button>
                        <Button variant="primary" type="submit" disabled={refetchLoading}>
                            { t('Submit') }
                        </Button>
                    </Modal.Footer>
                </VerticalForm>
            </Modal>
        </>
    );
};

export default ReportModals;