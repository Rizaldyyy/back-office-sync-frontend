// constants
import { ReportActionTypes } from './constants';

const INIT_STATE = {
    loading: false,
    dataError: null,
    messageSuccess: null,
    messageError: null,
};

interface ReportActionType {
    type:
        | ReportActionTypes.API_RESPONSE_SUCCESS
        | ReportActionTypes.API_RESPONSE_ERROR
        | ReportActionTypes.REPORT_GAME_TOWL
        | ReportActionTypes.REPORT_PLAYER_TOWL
        | ReportActionTypes.RESET;
    payload: {
        actionType?: string;
        data?: {};
        message: string;
        error?: string;
    };
}

interface State {
    dataGameTowl?: any;
    dataPlayerTowl?: any;
    loading?: boolean;
    dataError?: any;
    messageError?: any;
    messageSuccess?: any;
    value?: boolean;
}

const Report = (state: State = INIT_STATE, action: ReportActionType): any => {
    switch (action.type) {
        case ReportActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case ReportActionTypes.REPORT_GAME_TOWL: {
                    return {
                        ...state,
                        dataGameTowl: action.payload.data,
                        loading: false,
                    };
                }
                case ReportActionTypes.REPORT_PLAYER_TOWL: {
                    return {
                        ...state,
                        dataPlayerTowl: action.payload.data,
                        loading: false,
                    };
                }
                default:
                    return { ...state };
            }
            
        case ReportActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case ReportActionTypes.REPORT_GAME_TOWL: {
                    const param : any = action.payload.error;
                    const message = param.validation && param;
                    return {
                        ...state,
                        dataError: action.payload.error,
                        messageError: message,
                        loading: false,
                    };
                }
                case ReportActionTypes.REPORT_PLAYER_TOWL: {
                    const param : any = action.payload.error;
                    const message = param.validation && param;
                    return {
                        ...state,
                        dataError: action.payload.error,
                        messageError: message,
                        loading: false,
                    };
                }
                default:
                    return { ...state };
            }
        case ReportActionTypes.REPORT_GAME_TOWL:
            return { ...state, loading: true, dataGameTowl: null, dataError: null, messageError: null };
        case ReportActionTypes.REPORT_PLAYER_TOWL:
            return { ...state, loading: true, dataPlayerTowl: null, dataError: null, messageError: null };
        case ReportActionTypes.RESET:
            return {
                ...state,
                dataError: null,
                messageError: null,
                messageSuccess: null,
            };
        default:
            return { ...state };
    }
};

export default Report;
