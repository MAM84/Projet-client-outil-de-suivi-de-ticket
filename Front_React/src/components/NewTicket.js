import React, { Component } from 'react';
import { 
    CContainer,
    CRow,
    CCol,
    CButton,
    CForm,
    CTextarea,
    CInput,
    CLabel,
    CFormGroup,
    CSelect,
    CInputRadio,
    CCard,
    CCardHeader,
    CCardBody,
    } 
from "@coreui/react";
import { DropzoneArea } from 'material-ui-dropzone';
import {createTicket} from "../services/apiTickets";
import {getUsers} from "../services/apiUsers";
import {getCompanies} from "../services/apiCompanies";
import {getTopics} from "../services/apiTopics";
import Toast from "./Toast";


class NewTicket extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            users: [],
            topics: [],
            files: [],
            toast : false,
            toastTitle : "",
            toastMsg : "",
            errorTitle: "",
            errorDescription: "",
            errorCompany: "",
            errorRequester: "",
            errorTopic: "",
            errorPriority: "",
        };
    };
    
    componentDidMount() {
        if(this.props.authUser.admin == 1) {
            // requête pour récupérer les entreprises
            getCompanies('all', this.displayCompanies, this.displayError);
        }
        // requête pour récupérer les thèmes
        getTopics(this.displayTopics, this.displayError);
    };

    selectAuteur = (ev) => {
        getUsers(ev.target.value, 'all', this.displayPossibleAuteurs, this.displayError);
    };

    displayPossibleAuteurs = (users) => {
        this.setState(
            {users: users}
        );
    }

    displayCompanies = (companies) => {
        this.setState(
            {companies: companies}
        )
    }

    displayTopics = (topics) => {
        this.setState(
            {topics: topics}
        )
    }

    displayError = () => {
        this.setState(
            {erreur: true}
        )
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

    dropzoneChange = (files) => {
        this.setState({
            files: files
        });
    }

    errors = (key, value) => {
        switch (key) {
            case 'title': this.setState({
                errorTitle : value,
            })
            break
            case 'description': this.setState({
                errorDescription : value,
            })
            break
            case 'requester_id': this.setState({
                errorCompany: "Veuillez sélectionner une entreprise",
                errorRequester : value,
            })
            break
            case 'topic_id': this.setState({
                errorTopic : value,
            })
            break
            case 'priority_id': this.setState({
                errorPriority : value,
              })
              break
            default:
        }
    };

    valid = () => {
        const {authUser} = this.props;
        this.setState({
            errorTitle: "",
            errorDescription: "",
            errorCompany: "",
            errorRequester: "",
            errorTopic: "",
            errorPriority: "",
        })
        if(authUser.admin == 1){
            this.props.history.push('/list-tickets/all/all/all');
        }else{
            this.props.history.push('/list-tickets/' + authUser.companyId + '/' + authUser.id + '/all');
        }
        
    };

    sendTicket = (ev) => {
        ev.preventDefault();
        const {title, description, requester, topic, priority} = ev.target;
        const {authUser} = this.props;

        const data = new FormData();
        data.append('title', title.value);
        data.append('description', description.value);
        data.append('author_id', authUser.id);

        if(authUser.admin == 1) {
            if(requester.value !== "0"){
                data.append('requester_id', requester.value);
            }else{
                data.append('requester_id', "");
            }
        }else{
            data.append('requester_id', authUser.id);
        }

        if(topic.value !=="0"){
            data.append('topic_id', topic.value);
        }else{
            data.append('topic_id', "");
        }

        data.append('priority_id', priority.value);
        data.append('filesNb', this.state.files.length);
        let i=0;
        for(let file of this.state.files) {
            data.append('file-'+i, file);
            i++;
        }

        this.setState({
            errorTitle: "",
            errorDescription: "",
            errorCompany: "",
            errorRequester: "",
            errorTopic: "",
            errorPriority: "",
        })

        createTicket(data, this.letsToast, this.valid, this.errors);
    };

    render() {
        const { erreur, companies, users, topics, toast, toastTitle, toastMsg, errorTitle, errorDescription, errorCompany, errorRequester, errorTopic, errorPriority} = this.state;
        const {authUser} = this.props;

        if(erreur) {
            return (
                <p>Une erreur est survenue</p>
            )
        } else {
            return (
                <CContainer>
                    {toast ? <Toast toastTitle={toastTitle} toastMsg={toastMsg}/> : <></>}
                    <CRow>
                        <CCol xs='12 ' md='6'>
                            <CCard>
                                <CCol className='text-center'>
                                    <CCardHeader>
                                        Nouveau Ticket
                                    </CCardHeader>
                                </CCol>
                                <CCardBody>
                                    <CForm action='' method='post' onSubmit={this.sendTicket}
                                           encType="multipart/form-data">
                                        <CFormGroup>
                                            <CLabel htmlFor='title'>Titre</CLabel>
                                            <CInput
                                                type='text'
                                                id='title'
                                                name='title'
                                                placeholder='Titre du tiket'
                                            />
                                            <p className="text-danger"><small>{errorTitle}</small></p>
                                        </CFormGroup>
                                        {authUser.admin == 1 ?
                                            <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="enterprise">Entreprise</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CSelect custom name="entreprise" id="entreprise"
                                                             onChange={this.selectAuteur}>
                                                        <option value="0">Selectionner une entreprise</option>
                                                        {companies.map(company => (
                                                            <option value={company.id}
                                                                    key={company.id}>{company.name}</option>
                                                        ))}
                                                    </CSelect>
                                                    <p className="text-danger"><small>{errorCompany}</small></p>
                                                </CCol>
                                            </CFormGroup>
                                            :
                                            <></>
                                        }
                                        {authUser.admin == 1 ?
                                            <CFormGroup row>
                                                <CCol md="3">
                                                <CLabel htmlFor="auteur">Demandeur</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                <CSelect custom name="requester" id="auteur">
                                                    {/*
                                                        fonction map pour afficher tous les auteurs
                                                        <- appartenant à l'entreprise choisie plus haut
                                                    */}
                                                <option value="0">Selectionner un demandeur</option>
                                                {users.map(u => (
                                                    <option value={u.id} key={u.company_id}>{u.name} {u.firstname}</option>
                                                ))}

                                                </CSelect>
                                                </CCol>
                                                <p className="text-danger"><small>{errorRequester}</small></p>
                                            </CFormGroup>
                                            :
                                            <></>
                                        }
                                        <CFormGroup row>
                                            <CCol md="3">
                                                <CLabel htmlFor="thème">Thème</CLabel>
                                            </CCol>
                                            <CCol xs="12" md="9">
                                                <CSelect custom name="topic" id="thème">
                                                    {/*
                                                    fonction map pour afficher tous les thèmes d'un ticket
                                                */}
                                                    <option value="0">Selectionner un thème</option>
                                                    {topics.map(t => (
                                                        <option value={t.id} key={t.id}>{t.name}</option>
                                                    ))}
                                                </CSelect>
                                            </CCol>
                                            <p className="text-danger"><small>{errorTopic}</small></p>
                                        </CFormGroup>
                                        <CFormGroup row>
                                            <CCol md="3">
                                                <CLabel>Priorité</CLabel>
                                            </CCol>
                                            <CCol md="9">
                                                <CFormGroup variant="custom-radio" inline>
                                                    <CInputRadio custom id="inline-radio1" name="priority" value="1"/>
                                                    <CLabel variant="custom-checkbox"
                                                            htmlFor="inline-radio1">Faible</CLabel>
                                                </CFormGroup>
                                                <CFormGroup variant="custom-radio" inline>
                                                    <CInputRadio custom id="inline-radio2" name="priority" value="2"/>
                                                    <CLabel variant="custom-checkbox"
                                                            htmlFor="inline-radio2">Normale</CLabel>
                                                </CFormGroup>
                                                <CFormGroup variant="custom-radio" inline>
                                                    <CInputRadio custom id="inline-radio3" name="priority" value="3"/>
                                                    <CLabel variant="custom-checkbox"
                                                            htmlFor="inline-radio3">Elevée</CLabel>
                                                </CFormGroup>
                                            </CCol>
                                            <p className="text-danger"><small>{errorPriority}</small></p>
                                        </CFormGroup>
                                        <CFormGroup row>
                                            <CCol md="3">
                                                <CLabel htmlFor="textarea-input">Description</CLabel>
                                            </CCol>
                                            <CCol xs="12" md="9">
                                                <CTextarea
                                                    name="description"
                                                    id="textarea-input"
                                                    rows="9"
                                                    placeholder="..."
                                                />
                                            </CCol>
                                            <p className="text-danger"><small>{errorDescription}</small></p>
                                        </CFormGroup>
                                        <CFormGroup row>
                                            <CCol md="3">
                                                <CLabel>Importez vos fichiers</CLabel>
                                            </CCol>
                                            <CCol xs="12" md="9">
                                                <DropzoneArea
                                                    onChange={this.dropzoneChange}
                                                    dropzoneText={"Déposez vos fichiers ou cliquez pour sélectionner"}
                                                    filesLimit={5} // suffisant ?
                                                    // acceptedFiles={['image/*']}
                                                    //getFileLimitExceedMessage
                                                    //getFileAddedMessage
                                                    //getFileRemovedMessage
                                                    //getDropRejectMessage
                                                    showAlerts={false}
                                                />
                                            </CCol>
                                        </CFormGroup>
                                        <CCol className='text-right'>
                                            <CButton type="submit" size="sm" color="primary">Envoyer</CButton>
                                        </CCol>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CContainer>
            )
        }
    }
}

export default NewTicket;
