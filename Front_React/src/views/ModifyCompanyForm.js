import React from 'react';
import ModifyCompany from "../components/ModifyCompany";

class ModifyCompanyForm extends React.Component {

    render() {
        const {companyId} = this.props.match.params;
        return (
            <ModifyCompany companyId={companyId} />
        )
    }

}

export default ModifyCompanyForm;