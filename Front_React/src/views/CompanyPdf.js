import React from 'react';
import Pdf from "../components/Pdf";
import {CCol, CContainer, CRow, CSelect} from "@coreui/react";
import {getCompanies, getCompanyById} from "../services/apiCompanies";
import Error from "../components/Error";

class CompanyPdf extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            companies : [],
            companyName : "",
            companyId : parseInt(this.props.match.params.companyId),
            erreur : false,
            errorMessage : "",
        }
    }

    componentDidMount() {
        const {companyId} = this.state;
        if(companyId === 0) {
            getCompanies('all', this.displayCompaniesList, this.displayError);
        } else {
            getCompanyById(companyId, this.displayCompanyName, this.displayError);
        }
    }

    displayCompaniesList = (companies) => {
        this.setState({
            companies : companies,
        })
    }

    displayCompanyName = (company) => {
        if(company === 202) {
            this.setState({
                erreur : true,
                errorMessage : "L'entreprise demandée n'existe pas",
            })
        } else {
            this.setState({
                companyName : company.name,
                erreur : false,
                errorMessage : "",
            })
        }
    }

    dislayError = () => {
        this.setState({
            erreur : true,
        })
    }

    selectCompany = (ev) => {
        this.setState({
            companyName : ev.target.selectedOptions[0].label,
            companyId : ev.target.value,
        })
    }

    render() {
        const {companies, companyName, companyId, erreur, errorMessage} = this.state;
        let selectCompany;

        if(companyId === 0) {
            selectCompany =
                <CRow>
                    <CCol>
                        <CSelect onChange={this.selectCompany}>
                            <option value={0} >Sélectionner une entreprise</option>
                            {companies.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}
                        </CSelect>
                    </CCol>
                </CRow>
        }

        if(erreur) {
            return (
                <Error errorMessage={errorMessage} />
            )
        } else {
            return (
                <CContainer>
                    {selectCompany}
                    {companyId > 0 &&
                    <CRow>
                        <CCol>
                            <h2>Générer un pdf pour {companyName}</h2>
                            <Pdf id={companyId}/>
                        </CCol>
                    </CRow>
                    }
                </CContainer>
            )
        }
    }

}

export default CompanyPdf;