import React from 'react';
import Ticket from "../components/Ticket";

class ShowTicket extends React.Component {

    render() {
        const {ticketId} = this.props.match.params;
        const {loggedIn, authUser} = this.props;

        return (
            <Ticket ticketId={ticketId} loggedIn={loggedIn} authUser={authUser} />
        )
    }

}

export default ShowTicket;