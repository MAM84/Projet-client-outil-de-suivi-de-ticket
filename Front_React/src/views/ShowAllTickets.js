import React from 'react';
import ListTickets from "../components/ListTickets";
import {CButton, CContainer, CLink, CRow} from "@coreui/react";

class ShowAllTickets extends React.Component {

    render() {
        const {entreprise, user, step} = this.props.match.params;
        return (
            <CContainer>
                <CRow>
                    <CLink
                        to={"/new-ticket"}
                        style={{ textDecoration: 'none', color:"black" }}
                        className="w-100 d-flex justify-content-end">
                        <CButton className="m-2 bg-white btn-outline-info text-info">
                            Ecrire un ticket
                        </CButton>
                    </CLink>
                </CRow>
                <CRow>
                    <ListTickets sorter={true} filter={true} entreprise={entreprise} user={user} step={step} nbTickets={'all'} company={true} requester={true} dateEmission={true} dateResolution={true} nbLignes={12} />
                </CRow>
            </CContainer>
        )
    }

}

export default ShowAllTickets;