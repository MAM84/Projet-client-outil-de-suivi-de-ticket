import {baseUrl} from "../services/api";

export const getUsers = (entreprise, nbUsers, displayUsers, displayError) => {
    if(entreprise === 'all') {
        baseUrl.get('users')
            .then(res => {
                if(nbUsers === 'all') {
                    displayUsers(res.data.data);
                } else {
                    displayUsers(res.data.data.slice(0,nbUsers));
                }
            })
            .catch(res => {
                displayError();
            })
    } else {
        baseUrl.get('users/companies/' + entreprise)
            .then(res => {
                if(nbUsers === 'all') {
                    displayUsers(res.data.data);
                } else {
                    displayUsers(res.data.data.slice(0,nbUsers));
                }
            })
            .catch(res => {
                displayError();
            })
    }
}

export const getUserById = (id, displayUser, displayError) => {
    baseUrl.get('users/' + id)
        .then(res => {
            if(res.status === 200) {
                displayUser(res.data.data);
            } else {
                displayUser(res.status);
            }
        })
        .catch(res => {
            displayError();
        })
}

export const createUser = (data, toast, valid, errors) => {
    baseUrl.post('users', data)
        .then(function(res){
            toast('Félicitations', data.name + ' ' + data.firstname +' a bien été enregistré' );
            valid();
        })
        .catch(function(res){
            toast('Oups', "L'utilisateur n'a pas pu être enregistré");
            for (const [key, value] of Object.entries(res.response.data)) {
                errors(`${key}`, `${value}`);
            }
        })
}


export const modifyUser = (id, data, toast, valid, errors) => {
    baseUrl.put('users/' + id, data)
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