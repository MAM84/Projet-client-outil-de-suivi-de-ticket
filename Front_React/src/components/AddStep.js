import React, { Component } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import { 
    CModal,
    CRow,
    CCol,
    CButton,
    CCard,
    CCardBody,
    CCardFooter,
    CSelect,
    CFormGroup,
    CLabel,
    CTextarea,
    } 
from "@coreui/react";
import {Form} from "react-bootstrap";
import {addStep} from "../services/apiTickets";
import {getUsers} from "../services/apiUsers";
import Error from "./Error";
import {withRouter} from "react-router";

class AddStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users : [],
            files: [],
            selectedStep : "0",
            erreur : false,
        }
    }

    componentDidMount() {
        getUsers('all', 'all', this.displayUsers, this.displayError);
    }

    displayUsers = (users) => {
        const adminUsers = users.filter( user => user.admin == 1)
        this.setState({
            users : adminUsers,
        })
    }

    displayError = () => {
        this.setState({
            erreur : true,
        })
    }

    selectStep = (ev) => {
        this.setState({
            selectedStep : ev.target.value,
        })
    }

    dropzoneChange = (files) => {
        this.setState({
            files: files
        });
    };

   // Ajouter une étape / Méthode PUT
   sendForm = (ev) => {
        ev.preventDefault();
        const {ticketID} = this.props;
        const {step_id, manager_id, commentTicket} = ev.target;

        const data = new FormData();
        data.append('step_id', step_id.value);
        data.append('manager_id', step_id.value === "2" ? manager_id.value : null);
        data.append('comment', commentTicket.value);
        data.append('filesNb', this.state.files.length);
        
        let i=0;
        for(let file of this.state.files) {
            data.append('file-'+i, file);
            i++;
        }

        addStep(ticketID, data, this.letsToast, this.valid);

        this.props.closeModal();
    }

    valid = () => {
        const {ticketID} = this.props;
        this.props.history.push('/ticket/' + ticketID);
    };

    abort = (ev) => {
        ev.preventDefault();
        this.props.closeModal();
    }

    letsToast = (titre, message) => {
       this.props.letsToast(titre, message);
    }


    render() {
        const { users, selectedStep, erreur } = this.state;
        const { addStep} = this.props;

        if(erreur) {
            return (
                <Error />
            )
        } else {
            return (
                <CModal show={ addStep }>
                    <Form onSubmit={this.sendForm}>
                        <CCard>
                            <CCardBody>
                                <CLabel>Modifiez l'étape</CLabel>
                                <CSelect onChange={this.selectStep}
                                         name='step_id'
                                >
                                    <option value="0">Choisir une étape</option>
                                    <option value="2">Affecté</option>
                                    <option value="3">En Cours</option>
                                </CSelect>
                                {selectedStep === "2" &&
                                <CSelect name='manager_id'>
                                    <option value="0">Affecter à</option>
                                    {users.map(u => <option key={u.id} value={u.id}>{u.name + ' ' + u.firstname}</option>)}
                                </CSelect>
                                }
                                <CFormGroup>
                                    <CLabel htmlFor='comment'><strong>Commentaire</strong></CLabel>
                                    <CTextarea
                                        name="commentTicket"
                                        id="commentTicket"
                                        rows="6"
                                        placeholder="Entrez votre commentaire"
                                    />
                                </CFormGroup>
                                <strong>Fichier(s) :</strong>
                                <DropzoneArea onChange={this.dropzoneChange} 
                                              dropzoneText={"Déposez vos fichiers ou cliquez pour sélectionner"}
                                              filesLimit={5} // suffisant ?
                                              showAlerts={false}
                                /> 
                            </CCardBody>
                            <CCardFooter className='d-flex justify-content-end' >
                                <CRow>
                                    <CCol>
                                        <CButton
                                            type='submit'
                                            color='success'
                                            className='mr-4'
                                        >
                                            Valider
                                        </CButton>
                                        <CButton
                                            color='light'
                                            onClick={this.abort}
                                        >
                                            Annuler
                                        </CButton>
                                    </CCol>
                                </CRow>
                            </CCardFooter>
                        </CCard>
                    </Form>
                </CModal>
            )
        }
    }
}

export default withRouter(AddStep);