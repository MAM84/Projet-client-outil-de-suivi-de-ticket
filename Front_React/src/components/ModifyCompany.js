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
    CCardBody, CRow, CSpinner,
}
    from "@coreui/react";
import {getContractModels} from "../services/apiContractModels";
import {getCompanyById, modifyCompany} from "../services/apiCompanies";
import Toast from "./Toast";
import {withRouter} from "react-router";

class ModifyCompany extends Component {

    constructor(props) {
        super(props);
        this.state = {
            companyIsLoaded : false,
            erreur : false,
            contracts: [],
            createContract: false,
            contractmodels: [],
            modifyContract: false,
            nameCompany: "",
            addressCompany: "",
            commentCompany: "",
            contractCommentCompany:"",
            contractStartingDateCompany:"",
            toast : false,
            toastTitle : "",
            toastMsg : "",
            errorName: "",
            errorLogo: "",
            errorContractModel: "",
            errorStartingDate: "",
        }
    };

    componentDidMount() {
        // requête pour récupérer l'entreprise du user connecté
        getCompanyById(this.props.companyId, this.updateCompanyData, this.displayError);

        // requête pour récupérer les modèles de contrat
        getContractModels(this.displayContractModels, this.displayError)
    }

    updateCompanyData = (company) => {
        let contractComment = "";
        let contractStartingDate = "";
        if(company.contracts.length > 0) {
            contractComment = company.contracts[0].contractComment;
            contractStartingDate = company.contracts[0].startingDate;
        }
        this.setState({
            companyIsLoaded : true,
            contracts: company.contracts,
            nameCompany: company.name,
            addressCompany: company.address,
            commentCompany: company.comment,
            contractComment: contractComment,
            contractStartingDate: contractStartingDate,
        })
    }

    displayContractModels = (contractModels) => {
        this.setState({
            contractmodels: contractModels
        })
    }

    displayError = () => {
        this.setState({
            erreur: true,
        })
    }

    letsToast = (titre, message) => {
        this.setState({
            toast : true,
            toastTitle : titre,
            toastMsg : message,
        })

        setTimeout(() => {
            this.setState({
                toast : false,
            })
        }, 3000)
    }

    createContract = (ev) => {
        const {createContract} = this.state;
        this.setState({
            createContract: !createContract,
            errorContractModel: "",
            errorStartingDate: "",
        });
    };

    modifyContract = (ev) => {
        const {modifyContract} = this.state;
        this.setState({
            modifyContract: !modifyContract,
            errorContractModel: "",
            errorStartingDate: "",
        });
    };

    modifiyCompanyName = (ev) => {
        this.setState(
            {nameCompany: ev.target.value}
        );
    };

    modifiyCompanyAddress = (ev) => {
        this.setState(
            {addressCompany: ev.target.value}
        );
    };

    modifiyCompanyComment = (ev) => {
        this.setState(
            {commentCompany: ev.target.value}
        );
    };

    modifiyCompanyContractComment = (ev) => {
        this.setState(
            {contractComment: ev.target.value}
        );
    };

    modifiyCompanyContractStartingDate = (ev) => {
        this.setState(
            {contractStartingDate: ev.target.value}
        );
    };

    errors = (key, value) => {
        switch (key) {
            case 'name': this.setState({
                errorName : value,
            })
            break
            case 'logo': this.setState({
                errorLogo : value,
            })
            break
            case 'contractmodel_id': this.setState({
                errorContractModel : "Veuillez sélectionner un contrat",
            })
            break
            case 'startingDate': this.setState({
                errorStartingDate : value,
            })
            break
            default:
        }
    };

    valid = () => {
        this.setState({
            errorName : "",
            errorLogo : "",
            errorContractModel: "",
            errorStartingDate: "",
        })
        this.props.history.push('/company/' + this.props.companyId);
    };

    modifyCompany = (ev) => {
        ev.preventDefault();
        const {company, logo, address, comment, contractmodels, startingDate, contractComment, contractmodelsM, startingDateM, contractCommentM} = ev.target;
        const {createContract, modifyContract, contracts} = this.state;

        const data = new FormData();
        if(company.value){
            data.append('name', company.value);
        }
        if(logo.files[0]){
            data.append('logo', logo.files[0]);
        }
        if(address.value){
            data.append('address', address.value);
        }
        if(comment.value){
            data.append('comment', comment.value);
        }
        //pour la création d'un contrat
        if(createContract === true){
            data.append('contractmodel_id', contractmodels.value);
            data.append('startingDate', startingDate.value);
            data.append('contractComment', contractComment.value);
        }
        //pour modifier le dernier contrat
        if(modifyContract === true){
            data.append('company_contractmodel_id', contracts[0].id);
            data.append('contractmodel_id', contractmodelsM.value);
            data.append('startingDate', startingDateM.value);
            data.append('contractComment', contractCommentM.value);
        }

        this.setState({
            errorName : "",
            errorLogo : "",
            errorContractModel: "",
            errorStartingDate: "",
        })

        modifyCompany(this.props.companyId, data, this.letsToast, this.valid, this.errors);
    };

    render() {

        const {
            companyIsLoaded,
            erreur,
            contracts,
            createContract,
            contractmodels,
            modifyContract,
            nameCompany,
            addressCompany,
            commentCompany,
            contractComment,
            contractStartingDate,
            toast,
            toastTitle,
            toastMsg,
            errorName,
            errorLogo,
            errorContractModel,
            errorStartingDate,
        } = this.state;

        if (erreur) {
            return (
                <p>Une erreur est survenue</p>
            )
        } else {
            if (companyIsLoaded) {
                return (
                    <>
                        {toast ? <Toast toastTitle={toastTitle} toastMsg={toastMsg}/> : <></>}
                        <CContainer>
                            <CCol xs="12" sm="10" md='6'>
                                <CCard>
                                    <CCardHeader>
                                        Modifier les données de votre entreprise
                                    </CCardHeader>
                                    <CCardBody>
                                        <CForm action='' method='post' onSubmit={this.modifyCompany}
                                               encType="multipart/form-data">
                                            <CFormGroup>
                                                <CLabel htmlFor="company">Entreprise</CLabel>
                                                <CInput name="company" id="company" onChange={this.modifiyCompanyName}
                                                        value={nameCompany}/>
                                                <p className="text-danger"><small>{errorName}</small></p>
                                            </CFormGroup>
                                            <CFormGroup>
                                                <CLabel htmlFor="file-input">Logo</CLabel>
                                                <CInputFile id="file-input" name="logo"/>
                                                <p className="text-danger"><small>{errorLogo}</small></p>
                                            </CFormGroup>
                                            <CFormGroup>
                                                <CLabel htmlFor="street">Adresse</CLabel>
                                                <CInput name="address" id="street" onChange={this.modifiyCompanyAddress}
                                                        value={addressCompany}/>
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
                                                        onChange={this.modifiyCompanyComment}
                                                        value={commentCompany}
                                                    />
                                                </CCol>
                                            </CFormGroup>

                                            <CCol className='text-left'>
                                                <CButton size="sm" color="primary" onClick={this.createContract}
                                                         disabled={modifyContract}>Créer un contrat</CButton>
                                            </CCol>

                                            {createContract && <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="contractmodels">Modèle de contrat
                                                        (facultatif)</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CSelect custom name="contractmodels" id="contractmodels">
                                                        {/*
                                                fonction map pour afficher tous les modèles de contrats de l'API
                                            */}
                                                        <option value="0">Selectionner un modèle de contrat</option>
                                                        {contractmodels.map(cm => (
                                                            <option value={cm.id}
                                                                    key={cm.id}>{cm.service} - {cm.numberHours}h
                                                                - {cm.durationMonth}mois</option>
                                                        ))}
                                                    </CSelect>
                                                    <p className="text-danger"><small>{errorContractModel}</small></p>
                                                </CCol>
                                            </CFormGroup>}
                                            {createContract && <CFormGroup>
                                                <CLabel htmlFor="sartingDate">Date de départ du contrat</CLabel>
                                                <CInput name="startingDate" type="date" id="sartingDate"/>
                                                <p className="text-danger"><small>{errorStartingDate}</small></p>
                                            </CFormGroup>}
                                            {createContract && <CFormGroup row>
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

                                            <CCol className='text-left'>
                                                <CButton size="sm" color="primary" onClick={this.modifyContract}
                                                         disabled={createContract || contracts.length === 0}>Modifier un
                                                    contrat</CButton>
                                            </CCol>

                                            {modifyContract && <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="contractmodels">Modèle de contrat
                                                        (facultatif)</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CSelect custom name="contractmodelsM" id="contractmodels">
                                                        {/*
                                                fonction map pour afficher tous les modèles de contrats de l'API
                                            */}
                                                        <option
                                                            value={contracts[0].id_contractmodel}>{contracts[0].service} - {contracts[0].numberHours}h - {contracts[0].durationMonth}mois
                                                        </option>
                                                        {contractmodels.map(cm => (
                                                            <option value={cm.id}
                                                                    key={cm.id}>{cm.service} - {cm.numberHours}h
                                                                - {cm.durationMonth}mois</option>
                                                        ))}
                                                    </CSelect>
                                                </CCol>
                                            </CFormGroup>}
                                            {modifyContract && <CFormGroup>
                                                <CLabel htmlFor="sartingDate">Date de départ du contrat</CLabel>
                                                <CInput name="startingDateM" type="date" id="sartingDate"
                                                        onChange={this.modifiyCompanyContractStartingDate}
                                                        value={contractStartingDate}/>
                                                <p className="text-danger"><small>{errorStartingDate}</small></p>
                                            </CFormGroup>}
                                            {modifyContract && <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="textarea-input">Commentaire sur le contrat
                                                        (facultatif)</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CTextarea
                                                        name="contractCommentM"
                                                        id="textarea-input"
                                                        rows="3"
                                                        onChange={this.modifiyCompanyContractComment}
                                                        value={contractComment}
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
                    </>
                )
            } else {
                return (
                    <CContainer>
                        <CRow>
                            <CCol xl="12">
                                <CSpinner />
                            </CCol>
                        </CRow>
                    </CContainer>
                )
            }
        }
    }
}

export default withRouter(ModifyCompany);
