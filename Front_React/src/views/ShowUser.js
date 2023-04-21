import React from 'react';
import User from "../components/User";
import ListTickets from "../components/ListTickets";

class ShowUser extends React.Component {

    render() {
        const {userId} = this.props.match.params;
        const {authUser} = this.props;
        return (
            <>
                <User userId={userId} authUser={authUser}/>
                {authUser.admin == 1 ?
                    <ListTickets sorter={true} filter={true} entreprise={'all'} user={userId} step={'all'} nbTickets={'all'} company={false} requester={false} dateEmission={true} dateResolution={true} nbLignes={12} />
                    :
                    <ListTickets sorter={true} filter={true} entreprise={authUser.companyId} user={userId} step={'all'} nbTickets={'all'} company={false} requester={false} dateEmission={true} dateResolution={true} nbLignes={12} />
                }
            </>
        )
    }
}

export default ShowUser;