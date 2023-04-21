import React from 'react';
import ModifyTicket from "../components/ModifyTicket";

class ModifyTicketForm extends React.Component {

    render() {
        const {ticketId} = this.props.match.params;
        const {authUser} = this.props;

        return (
            <ModifyTicket ticketId={ticketId} authUser={authUser} />
        )
    }

}

export default ModifyTicketForm;