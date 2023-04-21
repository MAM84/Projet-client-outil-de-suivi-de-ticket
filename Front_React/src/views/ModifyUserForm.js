import React from 'react';
import ModifyUser from "../components/ModifyUser";

class ModifyUserForm extends React.Component {

    render() {
        const {userId} = this.props.match.params;
        const {authUser} = this.props;

        return (
            <ModifyUser userId={userId} authUser={authUser} />
        )
    }

}

export default ModifyUserForm;