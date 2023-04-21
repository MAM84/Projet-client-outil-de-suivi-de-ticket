import {baseUrl} from "../services/api";

export const getPriorities = (displayPriorities, displayError) => {
    baseUrl.get('priorities')
        .then(res => {
            displayPriorities(res.data.prioritiesList);
        })
        .catch(res => {
            displayError();
        })
}