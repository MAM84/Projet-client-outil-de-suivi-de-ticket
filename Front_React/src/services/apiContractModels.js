import {baseUrl} from "../services/api";

export const getContractModels = (displayContractModels, displayError) => {
    baseUrl.get('contractmodels')
        .then(res => {
            displayContractModels(res.data.data);
        })
        .catch(res => {
            displayError();
        })
}