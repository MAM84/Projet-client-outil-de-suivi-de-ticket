import {baseUrl} from "../services/api";

export const getTopics = (displayTopics, displayError) => {
    baseUrl.get('topics')
        .then(res => {
            displayTopics(res.data.topicsList);
        })
        .catch(res => {
            displayError();
        })
}