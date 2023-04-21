import {baseUrl} from "../services/api";

export const getContrats = (entreprise, displayContrats, displayError) => {
    baseUrl.get('contracts/companies/' + entreprise)
        .then(res => {
            displayContrats(res.data.data);
        })
        .catch(res => {
            displayError();
        })
}