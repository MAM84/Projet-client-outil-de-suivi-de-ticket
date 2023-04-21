import {baseUrl} from "../services/api";

export const getCompanies = (nbCompanies, displayCompanies, displayError) => {
    baseUrl.get('companies')
        .then(res => {
            if(nbCompanies === 'all') {
                displayCompanies(res.data.data);
            } else {
                displayCompanies(res.data.data.slice(0,nbCompanies));
            }
        })
        .catch(res => {
            displayError();
        })
}

export const getCompanyById = (id, displayCompany, displayError) => {
    baseUrl.get('companies/' + id)
        .then(res => {
            if(res.status === 200) {
                displayCompany(res.data.data);
            } else {
                displayCompany(res.status);
            }
        })
        .catch(res => {
            displayError();
        })
}

export const createCompany = (data, toast, valid, errors) => {
    baseUrl.post('companies', data)
        .then(function(res){
            toast('Félicitations', "L'entreprise " + data.get('name') + " a bien été enregistrée" );
            valid();
        })
        .catch(function(res){
            toast('Oups', "L'entreprise n'a pas pu être enregistrée");
            for (const [key, value] of Object.entries(res.response.data)) {
                errors(`${key}`, `${value}`);
            }
        })
}

export const modifyCompany = (id, data, toast, valid, errors) => {
    baseUrl.post('companies/' + id, data)//récupérer l'id de l'entreprise via la session du user
        .then(function(res){
            toast('Félicitations', "Les informations ont bien été mises à jour" );
            valid();
        })
        .catch(function(res){
            toast('Oups', "Les informations n'ont pas pu être mises à jour");
            for (const [key, value] of Object.entries(res.response.data)) {
                errors(`${key}`, `${value}`);
            }
        })
}