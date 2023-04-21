import {baseUrl} from "../services/api";

export const getTickets = (nbTickets, displayTickets, displayError) => {
    baseUrl.get('tickets')
        .then(res => {
            if(nbTickets === 'all') {
                displayTickets(res.data.data);
            } else {
                displayTickets(res.data.data.slice(0,nbTickets));
            }
        })
        .catch(res => {
            displayError();
        })
}

export const getTicketById = (id, displayTicket, displayError) => {
    baseUrl.get('tickets/' + id)
        .then(res => {
            if(res.status === 200) {
                displayTicket(res.data.data);
            } else {
                displayTicket(res.status);
            }
        })
        .catch(res => {
            displayError();
        })
}

export const getTicketsByCompany = (companyId, nbTickets, displayTickets, displayError) => {
    baseUrl.get('tickets/companies/' + companyId)
        .then(res => {
            if(nbTickets === 'all') {
                displayTickets(res.data.data);
            } else {
                displayTickets(res.data.data.slice(0,nbTickets));
            }
        })
        .catch(res => {
            displayError();
        })
}

export const getTicketsByUser = (userId, nbTickets, displayTickets, displayError) => {
    baseUrl.get('tickets/users/' + userId)
        .then(res => {
            if(nbTickets === 'all') {
                displayTickets(res.data.data);
            } else {
                displayTickets(res.data.data.slice(0,nbTickets));
            }
        })
        .catch(res => {
            displayError();
        })
}

export const getTicketsByStep = (stepId, nbTickets, displayTickets, displayError) => {
    baseUrl.get('tickets/steps/' + stepId)
        .then(res => {
            if(nbTickets === 'all') {
                displayTickets(res.data.data);
            } else {
                displayTickets(res.data.data.slice(0,nbTickets));
            }
        })
        .catch(res => {
            displayError();
        })
}

export const modifyTicket = (ticketId, data, toast, valid) => {
    baseUrl.put('tickets/' + ticketId, data)
        .then(function(res){
            toast('Félicitations', 'Le ticket ' + ticketId + ' a bien été mis à jour' );
            valid();
        })
        .catch(res => toast('Oups', "Le ticket " + ticketId + " n'a pas pu mis à jour"));
}

export const createTicket = (data, toast, valid, errors) => {
    baseUrl.post('tickets', data)
        .then(function(res){
            toast('Félicitations', 'Le ticket a bien été enregistré' );
            valid();
        })
        .catch(function(res){
            toast('Oups', "Le ticket n'a pas pu être enregistré");
            for (const [key, value] of Object.entries(res.response.data)) {
                errors(`${key}`, `${value}`);
            }
        })
}

export const addStep = (ticketId, data, toast, valid) => {
    baseUrl.put('tickets/' + ticketId, data)
        .then(res =>
            baseUrl.post('addstep/tickets/' + ticketId, data)
                .then(function(res){
                    toast('Félicitations', 'Une étape a bien été ajoutée au ticket' );
                    valid();
                })
                .catch(res => toast('Oups', "L'étape n'a pas pu être ajoutée au ticket"))
        )
        .catch(res => toast('Oups', "L'étape n'a pas pu être ajoutée au ticket"))
}