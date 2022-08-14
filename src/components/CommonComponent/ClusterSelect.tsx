import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FormInput } from '..';

// store
import { RootState, AppDispatch } from '../../redux/store';

// actions
import { clusterList } from '../../redux/actions';

interface ClusterSelectInputProps {
    fn?: any;
}

const ClusterSelect = ({fn} : ClusterSelectInputProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    
    const { auth, cluster, dataError } = useSelector((state: RootState) => ({
        auth: state.Auth.user.data,
        cluster: state.Cluster.data,
        dataError: state.Cluster.dataError
    }));

    useEffect(() => {
        dispatch(clusterList(''));
    }, [dispatch]);

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

    return (
        <>
            {dataError!==null && (
                <div className="d-block invalid-feedback">{ t('Clusters Error: Unable to load cluster list.') }</div>
            )}

            <FormInput
                label={ t('Cluster') }
                type="select"
                name="cluster"
                containerClass={'mt-3'}
                options={ clustersOptions }
                onChange={fn}
            />
        </>
    );
};

export default ClusterSelect;
