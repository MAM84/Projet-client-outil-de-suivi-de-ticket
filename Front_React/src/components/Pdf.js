import React, { Component } from 'react';
import { 
    CContainer,
    CCol,
    CButton,
    CInput,
    CLabel,
    CFormGroup,
    CCard,
    CCardHeader,
    CCardBody,
    CInputCheckbox,
    CLink,
    CSelect
    } 
from "@coreui/react";
import {urlAPI} from "../services/api";
import {getCompanyById} from "../services/apiCompanies";
import Error from "./Error";

class Pdf extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            dateDebut: null,
            dateFin: null,
            dateDebutB: null,
            dateFinB: null,
            dateEmission: 1,
            step: 1,
            dateResolution: 1,
            priority: 1,
            requester: 1,
            title: 1,
            topic: 1,
            duration: 1,
            contracts: [],
            erreur : false,
        }
    };

    componentDidMount() {
        // requête pour récupérer l'entreprise du user connecté
        getCompanyById(this.props.id, this.updateCompanyData, this.displayError);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.id !== this.props.id) {
            getCompanyById(this.props.id, this.updateCompanyData, this.displayError);
        }
    }

    updateCompanyData = (company) => {
        if(company.contracts.length > 0) {
            this.setState({
                contracts: company.contracts,
            })
        }
    }

    displayError = () => {
        this.setState({
            erreur : true,
        })
    }

    selectContrat = (ev) => {
        const contracts = this.state;
        if(ev.target.value !== "null"){
            const i = ev.target.value;
            this.setState({
                dateDebut: contracts.contracts[i].startingDate,
                dateDebutB: contracts.contracts[i].startingDate,
                dateFin: contracts.contracts[i].finalDate,
                dateFinB: contracts.contracts[i].finalDate
            })
        }else{
            this.setState({
                dateDebut: "",
                dateFin: "",
                dateDebutB: null,
                dateFinB: null,
            })
        }
    }

    dateDebut = (ev) => {
        if(ev.target.value !== null){
            this.setState({
                dateDebut: ev.target.value,
                dateDebutB: ev.target.value
            })
        }
        if(ev.target.value === ""){
            this.setState({
                dateDebut: null,
                dateDebutB: null
            })
        }
    }

    dateFin = (ev) => {
        if(ev.target.value !== null){
            this.setState({
                dateFin: ev.target.value,
                dateFinB: ev.target.value,
            })
        }
        if(ev.target.value === ""){
            this.setState({
                dateFin: null,
                dateFinB: null,
            })
        }
    }

    dateEmission = (ev) => {
        if(ev.target.checked === false){
            this.setState({dateEmission: 0})
        }else{
            this.setState({dateEmission: 1});
        }
    }

    step = (ev) => {
        if(ev.target.checked === false){
            this.setState({step: 0})
        }else{
            this.setState({step: 1});
        }
    }

    dateResolution = (ev) => {
        if(ev.target.checked === false){
            this.setState({dateResolution: 0})
        }else{
            this.setState({dateResolution: 1});
        }
    }

    priority = (ev) => {
        if(ev.target.checked === false){
            this.setState({priority: 0})
        }else{
            this.setState({priority: 1});
        }
    }

    requester = (ev) => {
        if(ev.target.checked === false){
            this.setState({requester: 0})
        }else{
            this.setState({requester: 1});
        }
    }

    title = (ev) => {
        if(ev.target.checked === false){
            this.setState({title: 0})
        }else{
            this.setState({title: 1});
        }
    }

    topic = (ev) => {
        if(ev.target.checked === false){
            this.setState({topic: 0})
        }else{
            this.setState({topic: 1});
        }
    }

    duration = (ev) => {
        if(ev.target.checked === false){
            this.setState({duration: 0})
        }else{
            this.setState({duration: 1});
        }
    }

    render() {
        const { erreur, dateDebut, dateFin, dateDebutB, dateFinB, dateEmission, step, dateResolution, priority, requester, title, topic, duration, contracts } = this.state;

        const contractsbis = [];
        contracts.map((c,i) =>
            contractsbis.push({
                "id": c.id,
                "service": c.service,
                "numberHours": c.numberHours,
                "durationMonth": c.durationMonth,
                "startingDate": new Date(c.startingDate).toLocaleDateString()
            }));

        if(erreur) {
            return (
                <Error />
            )
        } else {
            return (
                <CContainer>
                    <CCol xs="12" sm="10" md='6'>
                        <CCard>
                            <CCardHeader>
                                Sélectionner les options souhaitées
                            </CCardHeader>
                            <CCardBody>
                                <b>Choix de la période</b> (facultatif) : Sélectionner la période du contrat souhaité ou sélectionner des dates spécifiques
                                <CCol xs="12" md="9">
                                    <CSelect custom name="contrat" id="contrat" onChange={this.selectContrat}>
                                        {/*
                                    fonction map pour afficher les contrats de l'entreprise
                                */}
                                        <option value="null">Sélectionner un contrat</option>
                                        {contractsbis.map((c,i) => (
                                            <option value={i} key={c.id} >{c.service} - {c.numberHours}h - {c.durationMonth}mois - du {c.startingDate}</option>
                                        ))}
                                    </CSelect>
                                </CCol>
                                <CCol md="9">
                                    <CLabel htmlFor="dateDebut">Date de début (facultatif)</CLabel>
                                    <CInput name="dateDebut" type="date" id="dateDebut" value={dateDebut} onChange={this.dateDebut}/>
                                    <CLabel htmlFor="dateFin">Date de fin (facultatif, date du jour par défaut)</CLabel>
                                    <CInput name="dateFin" type="date" id="dateFin" value={dateFin} onChange={this.dateFin}/>
                                </CCol>

                                <CCol md="9">
                                    <CFormGroup variant="custom-checkbox" >
                                        <CCol>
                                            <CInputCheckbox custom id="inline-checkbox1" name="dateEmission" defaultChecked onChange={this.dateEmission}/>
                                            <CLabel variant="custom-checkbox" htmlFor="inline-checkbox1">Date d'émission</CLabel>
                                        </CCol>
                                        <CCol>
                                            <CInputCheckbox custom id="inline-checkbox2" name="step" defaultChecked onChange={this.step}/>
                                            <CLabel variant="custom-checkbox" htmlFor="inline-checkbox2">Statut du ticket</CLabel>
                                        </CCol>
                                        <CCol>
                                            <CInputCheckbox custom id="inline-checkbox3" name="dateResolution" defaultChecked onChange={this.dateResolution}/>
                                            <CLabel variant="custom-checkbox" htmlFor="inline-checkbox3">Date de résolution</CLabel>
                                        </CCol>
                                        <CCol>
                                            <CInputCheckbox custom id="inline-checkbox4" name="priority" defaultChecked onChange={this.priority}/>
                                            <CLabel variant="custom-checkbox" htmlFor="inline-checkbox4">Priorité </CLabel>
                                        </CCol>
                                        <CCol>
                                            <CInputCheckbox custom id="inline-checkbox5" name="requester" defaultChecked onChange={this.requester}/>
                                            <CLabel variant="custom-checkbox" htmlFor="inline-checkbox5">Demandeur</CLabel>
                                        </CCol>
                                        <CCol>
                                            <CInputCheckbox custom id="inline-checkbox6" name="title" defaultChecked onChange={this.title}/>
                                            <CLabel variant="custom-checkbox" htmlFor="inline-checkbox6">Titre </CLabel>
                                        </CCol>
                                        <CCol>
                                            <CInputCheckbox custom id="inline-checkbox7" name="topic" defaultChecked onChange={this.topic}/>
                                            <CLabel variant="custom-checkbox" htmlFor="inline-checkbox7">Thème </CLabel>
                                        </CCol>
                                        <CCol>
                                            <CInputCheckbox custom id="inline-checkbox8" name="duration" defaultChecked onChange={this.duration}/>
                                            <CLabel variant="custom-checkbox" htmlFor="inline-checkbox8">Durée </CLabel>
                                        </CCol>
                                    </CFormGroup>
                                </CCol>
                                <CCol className='text-right'>
                                    <CLink target="_blank" href={urlAPI + 'tickets/companies/' + this.props.id + '/pdf/' + dateDebutB + '/' + dateFinB + '/dateEmission:' + dateEmission + ';step:' + step + ';dateResolution:' + dateResolution + ';priority:' + priority + ';requester:' + requester + ';title:' + title + ';topic:' + topic + ';duration:' + duration}> <CButton size="sm" color="primary">Générer le PDF</CButton> </CLink>
                                </CCol>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CContainer>
            )
        }
    }
}

export default Pdf;