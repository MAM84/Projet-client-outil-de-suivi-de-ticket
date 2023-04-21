import React, { Component } from 'react';
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CCardTitle,
    CCardText,
    CCardImg,
    CSpinner, CLink, CButton,
}
    from "@coreui/react";
import {getCompanyById,} from "../services/apiCompanies";
import ListContrats from "./ListContrats";
import ListTickets from "./ListTickets";
import ListUsers from "./ListUsers";
import Error from "./Error";

class Company extends Component {

    constructor(props) {
        super(props);
        this.state = {
            company: [],
            companyIsLoaded : false,
            erreur : false,
            errorMessage : ""
        }
    };
    
    componentDidMount() {
        // requête pour récupérer l'entreprise du user connecté
        getCompanyById(this.props.companyId, this.displayCompany, this.displayError);
    }

    displayCompany = (company) => {
        if(company === 202) {
            this.setState({
                companyIsLoaded : true,
                erreur : true,
                errorMessage : "L'entreprise demandée n'existe pas"
            })
        } else {
            this.setState({
                company: company,
                companyIsLoaded : true,
            })
        }
    }

    displayError = () => {
        this.setState({
            companyIsLoaded : true,
            erreur : true,
        })
    }

    render() {
        const { company, companyIsLoaded, erreur, errorMessage } = this.state;
        const {authUser} = this.props;

        if(erreur) {
            return (
                <Error errorMessage={errorMessage}/>
            )
        } else {
            return (
                <CContainer fluid > 
                    <CCard>
                        <CCardHeader>
                            <CCardTitle>
                                {company.name}
                            </CCardTitle>
                        </CCardHeader>
                        
                        <CCardBody>
                            <CRow>
                            {
                                company.logo !== "" && 
                                <CCol>
                                    <CCardImg
                                        src={company.logo}
                                        />
                                </CCol>
                                }
                                <CCol>
                                    <CCardText>
                                        <strong>Adresse :</strong>
                                        {company.address} 
                                    </CCardText>
                                    {authUser.admin == 1 ?
                                        <CCardText>
                                            <strong>Commentaire sur l'entreprise :</strong>
                                            {company.comment}
                                        </CCardText>
                                    :
                                    <></>
                                    }
                                </CCol>
                            </CRow>
                            {authUser.admin == 1 ?
                                <CRow>
                                    <CCol>
                                        <CLink
                                            to={"/modify-company/" + company.id}
                                            style={{ textDecoration: 'none', color:"black" }}
                                            className="w-100 d-flex justify-content-end">
                                            <CButton className="m-2 bg-white btn-outline-info text-info">
                                                Modifier
                                            </CButton>
                                        </CLink>
                                    </CCol>
                                </CRow>
                            :
                            <></>
                            }
                        </CCardBody>
                    </CCard>
                    <CRow>
                        {/* <CCardGroup deck={true} columns={true}> */}
                            {
                                companyIsLoaded ?
                            <CCol sm="12" xl="4">
                                <CCard >
                                    <CCardHeader>
                                        <CCardTitle>
                                            Les Clients
                                        </CCardTitle>
                                    </CCardHeader>
                                    <CCardBody>
                                        {authUser.admin == 1 ?
                                            <ListUsers 
                                                sorter={true}
                                                filter={true}
                                                entreprise={company.id}
                                                nbUsers={'all'}
                                                showFunction={true}
                                                companyName={false}
                                                showAdmin={false}
                                                see={true}
                                                modify={false}
                                                nbLignes={5}
                                            />
                                            :
                                            <ListUsers 
                                                sorter={true}
                                                filter={true}
                                                entreprise={company.id}
                                                nbUsers={'all'}
                                                showFunction={true}
                                                companyName={false}
                                                showAdmin={false}
                                                see={false}
                                                modify={false}
                                                nbLignes={5}
                                            />
                                        }
                                    </CCardBody>
                                </CCard>
                            </CCol>
                            :
                            <CSpinner />
                            }
                            {
                                companyIsLoaded ?
                            <CCol sm="12" xl="8">
                                <CCard>
                                    <CCardHeader>
                                        <CCardTitle>
                                            Les Tickets
                                        </CCardTitle>
                                    </CCardHeader>
                                    <CCardBody>
                                        <ListTickets   
                                            sorter={true}
                                            filter={true}
                                            entreprise={company.id}
                                            user={'all'}
                                            step={'all'}
                                            nbTickets={'all'}
                                            company={false}
                                            requester={true}
                                            dateEmission={true}
                                            dateResolution={true}
                                            nbLignes={5}
                                        />
                                    </CCardBody>
                                </CCard>
                            </CCol>
                            :
                            <CSpinner />
                            }
                            {
                                companyIsLoaded ?
                            <CCol sm="12" xl="auto">
                                <CCard>
                                    <CCardHeader>
                                        <CCardTitle>
                                            Les Contrats
                                        </CCardTitle>
                                    </CCardHeader>
                                    <CCardBody>
                                        <ListContrats 
                                            entreprise={company.id}
                                            comment={false}
                                            nbLignes={5}
                                        />
                                    </CCardBody>
                                </CCard>
                            </CCol>
                            :
                            <CSpinner />
                            }
                            
                        {/* </CCardGroup> */}
                    </CRow>
                </CContainer>

            );
        }
    }
}

export default Company;
