import React from 'react';
import Company from "../components/Company";

class ShowCompany extends React.Component {

    render() {
        const {companyId} = this.props.match.params;
        const {authUser} = this.props;
        return (
            <Company companyId={companyId} authUser={authUser} />
        )
    }

}

export default ShowCompany;