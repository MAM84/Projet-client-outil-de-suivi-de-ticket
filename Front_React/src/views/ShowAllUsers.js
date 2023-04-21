import React from 'react';
import ListUsers from "../components/ListUsers";
import {CButton, CContainer, CLink, CRow} from "@coreui/react";

class ShowAllUsers extends React.Component {

    render() {
        const {entreprise} = this.props.match.params;
        return (
            <CContainer>
                <CRow>
                    <CLink
                        to={"/create-user"}
                        style={{ textDecoration: 'none', color:"black" }}
                        className="w-100 d-flex justify-content-end">
                        <CButton className="m-2 bg-white btn-outline-info text-info">
                            Ajouter un utilisateur
                        </CButton>
                    </CLink>
                </CRow>
                <CRow>
                    <ListUsers sorter={true} filter={true} entreprise={entreprise} nbUsers={'all'} showFunction={true} companyName={true} showAdmin={true} modify={true} see={true}nbLignes={12} />
                </CRow>
            </CContainer>
        )
    }

}

export default ShowAllUsers;