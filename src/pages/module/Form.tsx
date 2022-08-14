import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';

// boostrap
import { Alert, Card, Button, Col, Row } from 'react-bootstrap';

// store
import { RootState, AppDispatch } from '../../redux/store';

// actions
import { moduleList, moduleCreate, moduleUpdate, resetModule} from '../../redux/actions';

// components
import PageTitle from '../../components/PageTitle';
import Spinner from '../../components/Spinner';
import { FormInput, VerticalForm } from '../../components';

interface ModuleData {
    id? : number;
    adminId? : number;
    menu_name: string;
    is_menu: number;
    sidebarName: string;
    position: number;
}

interface UpdateParameters {
    manage? : string;
    parentId? : string;
    childId? : string;
}

const ModuleForm = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    const history = useHistory();
    const urlParams: UpdateParameters = useParams();
    let moduleData:any = [];

    const { auth, moduleListData, loading, messageSuccess, messageError} = useSelector((state: RootState) => ({
        auth: state.Auth.user.data,
        moduleListData: state.Module.data,
        loading: state.Module.loading,
        messageSuccess: state.Module.messageSuccess,
        messageError: state.Module.messageError,
    }));

    useEffect(() => {
        dispatch(resetModule());
        !moduleListData && dispatch(moduleList());
    }, [dispatch]);

    const moduleParents = () => {
        const parents = [{name: 'Main Parent', value:1}];

        const moduleParents = (moduleListData || []).map(( data : ModuleData ) => {
            return { name: data.menu_name, value: data.id };
        });

        return parents.concat(moduleParents);
    };

    /*
    if the page is Edit module
    */
    if(urlParams.manage)
    {
        if(moduleListData){
            const id = urlParams.parentId !== '1' ? urlParams.parentId : urlParams.childId;
            let initData : any = moduleListData.filter((data : ModuleData) => data.id == id);

            if(urlParams.parentId !== '1'){
                initData = (initData[0].child || []).filter((data : ModuleData) => data.id == urlParams.childId);
            }
            
            moduleData = initData[0];
        }
        else{
            window.alert( t('Unable to load module data! Please go to Module List and try again.') );
            history.push('/module/list');
        }
    }

    /*
    form validation schema
    */
    const schemaResolver = yupResolver(
        yup.object().shape({
            module_parent: yup.string().required( t('Please select a Module Parent') ),
            menu_name: yup.string().required( t('Please enter Name') ),
            route: yup.string().required( t('Please enter Route') ),
            role: yup.string().required( t('Please enter Role Name') ),
            is_menu: yup.string().required( t('Please select if Menu or Not') ),
            module_order: yup.string().required( t('Please enter Menu Position') ),
        })
    );

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
    const onSubmit = (formData: ModuleData) => {
        formData['adminId'] = auth.id;

        // create
        let submit = moduleCreate(formData);

        // update
        if(urlParams.manage){
            formData['id'] = moduleData.id;
            submit = moduleUpdate(formData);
        }

        dispatch(submit);
    };

    const successRedirect = () => {
        setTimeout(() => { 
            // history.push('/module/list'); 
            window.location.reload();
        }, 1000)
    }

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Module', path: '/module/list' },
                ]}
                title={'Module Management'}
            />

            <Card>
                <Card.Body>
                    <h4 className="header-title mt-0 mb-1">{urlParams.manage ? t('Edit Module') : t('Add Module') }</h4>

                    {messageSuccess && (
                        <Alert variant="success" className="my-2">
                            {messageSuccess}
                            {successRedirect()}
                        </Alert>
                    )}

                    {messageError && typeof messageError === 'string' && (
                        <Alert variant="danger" className="my-2">
                            { messageError }
                        </Alert>
                    )}

                    {validationError}

                    <VerticalForm<ModuleData>
                        onSubmit={onSubmit}
                        resolver={schemaResolver}
                        defaultValues={moduleData && {
                            module_parent: moduleData.module_parent, 
                            menu_name: moduleData.menu_name, 
                            route: moduleData.route, 
                            role: moduleData.role, 
                            is_menu: moduleData.is_menu, 
                            menu_icon: moduleData.menu_icon, 
                            module_order: moduleData.module_order, 
                        }}>

                        <FormInput
                            label={ t('Module Parent') }
                            type="select"
                            name="module_parent"
                            options={moduleParents()}
                            containerClass={'mt-3'}
                        />
                        <FormInput
                            label={ t('Name') }
                            type="text"
                            name="menu_name"
                            placeholder={ t('Enter Name') }
                            containerClass={'mt-3'}
                        />

                        <FormInput
                            label={ t('Route') }
                            type="text"
                            name="route"
                            placeholder={ t('Enter Route') }
                            containerClass={'mt-3'}
                        />

                        <FormInput
                            label={ t('Role Name') }
                            type="text"
                            name="role"
                            placeholder={ t('Enter Role Name') }
                            containerClass={'mt-3'}
                        />
                        
                        <FormInput
                            label={ t('Is Menu?') }
                            type="select"
                            name="is_menu"
                            options={[
                                {
                                    value: 1,
                                    name: 'Yes'
                                },{
                                    value: 0,
                                    name: 'No'
                                }
                            ]}
                            containerClass={'mt-3'}
                        />

                        <FormInput
                            label={ t('Sidebar Icon') }
                            type="text"
                            name="menu_icon"
                            placeholder={ t('Enter Sidebar Icon') }
                            containerClass={'mt-3'}
                        />

                        <FormInput
                            label={ t('Menu Position') }
                            type="text"
                            name="module_order"
                            placeholder={ t('Enter Menu Position') }
                            containerClass={'my-3'}
                        />

                        <div className="float-end text-md-end mb-0">
                            <Button variant="primary" className="me-1" type="submit" disabled={loading}>
                                {urlParams.manage ? t('Update') : t('Submit') }
                            </Button>
                            <Link to={'/cluster/list'}>
                                <Button variant="secondary" type="reset">
                                    { t('Cancel') }
                                </Button>
                            </Link>
                        </div>

                        {loading && (
                            <div className="float-end mb-0 mx-2">
                                <Spinner color={'primary'}>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </div>
                        )}

                    </VerticalForm>
                </Card.Body>
            </Card>
        </>
    );
};

export default ModuleForm;
