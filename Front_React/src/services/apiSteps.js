import {baseUrl} from "../services/api";

export const getSteps = (displaySteps, displayError) => {
    baseUrl.get('steps')
        .then(res => {
            displaySteps(res.data.stepsList);
        })
        .catch(res => {
            displayError();
        })
}