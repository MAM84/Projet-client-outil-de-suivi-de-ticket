import React, { Component } from 'react';
import { 
    CContainer,
    CCol,
    CButton,
    CForm,
    CTextarea,
    CInput,
    CLabel,
    CFormGroup,
    CSelect,
    CInputFile,
    CCard,
    CCardHeader,
    CCardBody,
    }
from "@coreui/react";
import {createCompany} from "../services/apiCompanies";
import Toast from "./Toast";
import {getContractModels} from "../services/apiContractModels";

class newCompany extends Component {
    constructor(props) {
        super(props);
        this.state = {
            erreur: false,
            contractmodels: [],
            visuContratDetail: false,
            toast: false,
            toastTitle: "",
            toastMsg: "",
            errorName: "",
            errorLogo: "",
            errorStartingDate: "",
        };
    };

    componentDidMount() {
        // requête pour récupérer les modèles de contrat
        getContractModels(this.displayContractModels, this.displayError)
    };

    displayContractModels = (contractModels) => {
        this.setState(
            {contractmodels: contractModels}
        )
    }

    displayError = () => {
        this.setState({
            erreur: true,
        })
    }

    selectContract = (ev) => {
        if (ev.target.value > 0) {
            this.setState(
                {visuContratDetail: true}
            )
        } else {
            this.setState(
                {visuContratDetail: false}
            )
        }
    };

    letsToast = (titre, message) => {
        this.setState({
            toast: true,
            toastTitle: titre,
            toastMsg: message,
        })

        setTimeout(() => {
            this.setState({
                toast: false,
            })
        }, 3000)
    }

    errors = (key, value) => {
        switch (key) {
            case 'name':
                this.setState({
                    errorName: value,
                })
                break
            case 'logo':
                this.setState({
                    errorLogo: value,
                })
                break
            case 'startingDate':
                this.setState({
                    errorStartingDate: value,
                })
                break
            default:
        }
    };

    valid = () => {
        this.setState({
            errorName: "",
            errorLogo: "",
            errorStartingDate: "",
        })
        this.props.history.push('/list-companies');
    };

    createCompany = (ev) => {
        ev.preventDefault();
        const {company, logo, address, comment, contractmodels, startingDate, contractComment} = ev.target;

        const data = new FormData();
        if (company.value) {
            data.append('name', company.value);
        }
        if (logo.files[0]) {
            data.append('logo', logo.files[0]);
        }
        if (address.value) {
            data.append('address', address.value);
        }
        if (comment.value) {
            data.append('comment', comment.value);
        }
        if (contractmodels.value > 0) {
            data.append('contractmodel_id', contractmodels.value);
            data.append('startingDate', startingDate.value);
            data.append('contractComment', contractComment.value);
        }

        this.setState({
            errorName: "",
            errorLogo: "",
            errorStartingDate: "",
        })

        createCompany(data, this.letsToast, this.valid, this.errors);
    };

    render() {
        const {erreur, contractmodels, visuContratDetail, toast, toastTitle, toastMsg, errorName, errorLogo, errorStartingDate} = this.state;

        if (erreur) {
            return (
                <p>Une erreur est survenue</p>
            )
        } else {
            return (
                <CContainer>
                    {toast ? <Toast toastTitle={toastTitle} toastMsg={toastMsg}/> : <></>}
                    <CCol xs="12" sm="10" md='6'>
                        <CCard>
                            <CCardHeader>
                                Nouvelle Entreprise
                            </CCardHeader>
                            <CCardBody>
                                <CForm action='' method='post' onSubmit={this.createCompany}
                                       encType="multipart/form-data">
                                    <CFormGroup>
                                        <CLabel htmlFor="company">Entreprise</CLabel>
                                        <CInput name="company" id="company"
                                                placeholder="Entrer le nom de votre société"/>
                                        <p className="text-danger"><small>{errorName}</small></p>
                                    </CFormGroup>
                                    <CFormGroup>
                                        <CLabel htmlFor="file-input">Logo</CLabel>
                                        <CInputFile id="file-input" name="logo"/>
                                        <p className="text-danger"><small>{errorLogo}</small></p>
                                    </CFormGroup>
                                    <CFormGroup>
                                        <CLabel htmlFor="street">Adresse</CLabel>
                                        <CInput name="address" id="street"
                                                placeholder="Entrer le siège social de votre société"/>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="textarea-input">Commentaire sur l'entreprise
                                                (facultatif)</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CTextarea
                                                name="comment"
                                                id="textarea-input"
                                                rows="3"
                                                placeholder="..."
                                            />
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="contractmodels">Modèle de contrat (facultatif)</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CSelect custom name="contractmodels" id="contractmodels"
                                                     onChange={this.selectContract}>
                                                {/*
                                                fonction map pour afficher tous les modèles de contrats de l'API
                                            */}
                                                <option value="0">Selectionner un modèle de contrat</option>
                                                {contractmodels.map(cm => (
                                                    <option value={cm.id} key={cm.id}>{cm.service}</option>
                                                ))}

                                            </CSelect>
                                        </CCol>
                                    </CFormGroup>
                                    {visuContratDetail && <CFormGroup>
                                        <CLabel htmlFor="sartingDate">Date de départ du contrat</CLabel>
                                        <CInput name="startingDate" type="date" id="sartingDate"/>
                                        <p className="text-danger"><small>{errorStartingDate}</small></p>
                                    </CFormGroup>}
                                    {visuContratDetail && <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="textarea-input">Commentaire sur le contrat
                                                (facultatif)</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CTextarea
                                                name="contractComment"
                                                id="textarea-input"
                                                rows="3"
                                                placeholder="..."
                                            />
                                        </CCol>
                                    </CFormGroup>}
                                    <CCol className='text-right'>
                                        <CButton type="submit" size="sm" color="primary">Envoyer</CButton>
                                    </CCol>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CContainer>
            )
        }
    }
}

export default newCompany;