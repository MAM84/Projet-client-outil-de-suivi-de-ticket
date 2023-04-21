import React from 'react';
import ListCompanies from "../components/ListCompanies";
import {CButton, CContainer, CLink, CRow} from "@coreui/react";

class ShowAllCompanies extends React.Component {

    render() {
        return (
            <CContainer>
                <CRow>
                    <CLink
                        to={"/new-company"}
                        style={{ textDecoration: 'none', color:"black" }}
                        className="w-100 d-flex justify-content-end">
                        <CButton className="m-2 bg-white btn-outline-info text-info">
                            Ajouter une entreprise
                        </CButton>
                    </CLink>
                </CRow>
                <CRow>
                    <ListCompanies sorter={true} filter={true} nbCompanies={'all'} nbTickets={true} usersLink={true} modifyLink={true} exportPdf={true} onlyOpenTickets={false} nbLignes={12} />
                </CRow>
            </CContainer>
        )
    }

}

export default ShowAllCompanies;