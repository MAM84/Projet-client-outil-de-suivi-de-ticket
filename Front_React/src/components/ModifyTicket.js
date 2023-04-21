import React, { Component } from 'react';
import AddStep from './AddStep'
import {
    CContainer,
    CRow,
    CCol,
    CButton,
    CBadge,
    CCard,
    CCardHeader,
    CCardBody,
    CCardFooter,
    CInput,
    CSelect,
    CFormGroup,
    CLabel,
    CListGroup,
    CListGroupItem,
    CCollapse,
    CModal,
    CTooltip, CSpinner,
}
    from "@coreui/react";
import { CIcon} from '@coreui/icons-react';
import {freeSet} from '@coreui/icons';
import {Form, ListGroup} from "react-bootstrap";
import {getTopics} from "../services/apiTopics";
import {getPriorities} from "../services/apiPriorities";
import {getTicketById, modifyTicket, addStep} from "../services/apiTickets";
import Toast from "./Toast";
import Error from "./Error";
import {getUsers} from "../services/apiUsers";
import {withRouter} from "react-router";


class ModifyTicket extends Component {
    // TODO : voir si possible de séparer dans deux composants différents l'affichage et la modification du ticket (plus simple pour la gestion des droits...)
    constructor(props) {
        super(props);
        this.state = {
            'ticket' : {},
            'ticketIsLoaded' : false,
            'erreur' : false,
            'errorMessage' : "",
            'topicsList': [],
            'prioritiesList': [],
            'usersList' : [],
            'actual_step' : '',
            'selectedStep' : '',
            'commentTicket': '',
            'collapsed' : [],
            'topic' : '',
            'ticketID' : this.props.ticketId,
            'priority' : '',
            'duration': "",
            'addStep': false,
            'closeTicket' : false,
            'badgeColor' : '',
            'closed' : false,
            'toast' : false,
            'toastTitle' : "",
            'toastMsg' : "",
        }
    };
    
    componentDidMount() {
        // recupère le ticket
        getTicketById(this.props.ticketId, this.displayTicket, this.displayError);
        if(this.props.authUser.admin == 1) {
            // récupère la liste des thèmes (pour le menu déroulant si on modifie le ticket -> admin seulement)
            getTopics(this.displayTopics, this.displayError);
            // récupère la liste des priorités (pour le menu déroulant si on modifie le ticket -> admin seulement)
            getPriorities(this.displayPriorities, this.displayError);
            // récupère les users pour le choix lors de la modification de l'affectation (-> admin seulement)
            getUsers('all', 'all', this.displayUsers, this.displayError);
        }
    };

    displayTicket = (ticket) => {
        if(ticket === 202) {
            this.setState({
                ticketIsLoaded: true,
                erreur: true,
                errorMessage: "Le ticket demandé n'existe pas"
            })
        } else {
            const nbHeures = Math.round(ticket.duration / 60) < 10 ? '0' + Math.round(ticket.duration / 60) : Math.round(ticket.duration / 60);
            const nbMinutes = ticket.duration % 60 < 10 ? '0' + ticket.duration % 60 : ticket.duration % 60;

            this.setState({
                'ticketIsLoaded': true,
                'ticket' : ticket,
                'collapsed' : ticket.all_steps.map(t => false),
                'ticketID' : ticket.id,
                'step_id' : ticket.actual_step,
                'duration' : nbHeures + ':' + nbMinutes ,
            });

            // Empêche de modifier ou cloturer un ticket lorsqu'il est clos
            if(this.state.step_id === 'Clos') {
                this.setState({
                    'closed' : true
                })
            }
        }
    }

    displayTopics = (topics) => {
        this.setState({
            topicsList : topics,
        })
    }

    displayPriorities = (priorities) => {
        this.setState({
            prioritiesList : priorities,
        })
    }

    displayUsers = (users) => {
        const adminUsers = users.filter( user => user.admin == 1)
        this.setState({
            usersList : adminUsers,
        })
    }

    displayError = () => {
        this.setState({
            'ticketIsLoaded' : true,
            'erreur' : true,
        })
    }

    manageAddStepModal = () => {
        this.setState({
            'addStep' : !this.state.addStep,
        })
    }

    updateState = ev => {
        ev.preventDefault();
        this.setState({
            [ev.target.name] : ev.target.value
        });
    }

    manageCollapse = (i) => {
        let {collapsed} = this.state;

        if(this.state.collapsed[i]) {
            collapsed[i] = false;
        } else {
            collapsed[i] = true;
        }

        this.setState({
            'collapsed' : collapsed
        })
    }

    // Modifier le ticket
    updateTicket = (ev) => {
        ev.preventDefault();
        const {topic, priority, duration, manager_id, commentTicket, ticketID} = this.state;

        const data = {
            'topic_id': topic,
            'priority_id': priority,
            'duration': duration,
            'manager_id': manager_id,
            'comment': commentTicket
        }

        modifyTicket(ticketID, data, this.letsToast, this.valid);
    };

    valid = () => {
        const {ticketID} = this.state;
        this.props.history.push('/ticket/' + ticketID);
    };

    // Clôture un ticket
    setCloseTicket = (ev) => {
        ev.preventDefault();
        const {ticketID, closeTicket, duration} = this.state

        const data = {
            'duration': duration,
            'step_id': 5
        }

        addStep(ticketID, data, this.letsToast);
        this.setState({'closeTicket' : !closeTicket,})
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
    
    render() {
        let {ticket, collapsed, topicsList, prioritiesList, usersList, addStep, duration, ticketID, closeTicket, closed, toast, toastTitle, toastMsg, ticketIsLoaded, erreur, errorMessage } = this.state;
        // Affecte la couleur du badge en fonction de l'état du ticket
        const getBadge = (status)=>{
            switch (status) {
                case 'Nouveau': return 'primary'
                case 'Affecté': return 'success'
                case 'Clos': return 'secondary'
                default: return 'warning'
            }
        }

        if(erreur) {
            return (
                <Error errorMessage={errorMessage} />
            )
        } else {
            if(ticketIsLoaded) {
                return (
                    <CContainer>
                        {toast ? <Toast toastTitle={toastTitle} toastMsg={toastMsg}/> : <></>}
                        <AddStep
                            ticketID = {ticketID}
                            addStep = {addStep}
                            letsToast = {this.letsToast}
                            closeModal={this.manageAddStepModal}
                        />
                        <CModal
                            show={this.state.closeTicket}
                        >
                            <CCard>
                                <Form onSubmit={this.setCloseTicket}>
                                    <CCardHeader>
                                        <strong> Clôture du ticket </strong>
                                    </CCardHeader>
                                    <CCardBody
                                        className='text-center'
                                    >
                                        <p> Êtes-vous sûr de clôturer ce ticket ? </p>
                                        <CFormGroup>
                                            <CLabel>Durée</CLabel>
                                            <CInput
                                                // TODO : Permettre d'incrémenter de 10 en 10
                                                type='time'
                                                value={duration}
                                                name='duration'
                                                onChange={this.updateState}
                                                onKeyDown={() => this.setDuration}
                                            />
                                        </CFormGroup>
                                    </CCardBody>
                                    <CCardFooter
                                        className='d-flex justify-content-end'
                                    >
                                        <CButton
                                            color='danger'
                                            type='submit'
                                            className='mr-2'
                                        >
                                            <CIcon content={freeSet.cilXCircle} className='pr-1'  />
                                            Clôturer
                                        </CButton>
                                        <CButton
                                            color='light'
                                            onClick={() => this.setState({'closeTicket' : !closeTicket})}
                                        >
                                            <CIcon content={freeSet.cilX} className='pr-1'  />
                                            Annuler
                                        </CButton>
                                    </CCardFooter>
                                </Form>
                            </CCard>
                        </CModal>
                        <Form onSubmit={this.updateTicket}>
                            <CCard>
                                <CCardHeader>
                                    <CRow className='justify-content-center pm-4'>
                                        <CCol md='4'  className='text-center mt-5'>
                                            <h1>Ticket n°{ticketID} </h1>
                                            <CBadge
                                                color={getBadge(ticket.actual_step)}
                                            >
                                                {ticket.actual_step}
                                            </CBadge>
                                        </CCol>
                                    </CRow>
                                </CCardHeader>
                                <CCardBody>
                                    <CRow className='justify-content-end mb-5'>
                                        <CCol md='4' xs='3'>
                                            <CFormGroup>
                                                <CLabel> <strong>Priorité :</strong> </CLabel>
                                                <CSelect
                                                    name='priority'
                                                    onChange={this.updateState}
                                                >
                                                    <option value="0">{ticket.priority}</option>
                                                            {
                                                                prioritiesList.map((priority) =>
                                                                    <option
                                                                        key={priority.id}
                                                                        value={priority.id}
                                                                    >
                                                                        {priority.name}
                                                                    </option>
                                                                )
                                                            }
                                                </CSelect>
                                            </CFormGroup>
                                        </CCol>
                                    </CRow>
                                    <CRow className='mb-5'>
                                        <CCol className=''>
                                            <ListGroup variant='flush'>
                                                <ListGroup.Item>
                                                    <strong>Objet :</strong>  {ticket.title}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <CFormGroup>
                                                        <CLabel> <strong>Thème :</strong> </CLabel>
                                                        <CSelect
                                                            name="topic"
                                                            onChange={this.updateState}
                                                        >
                                                            <option value="0">{ticket.topic}</option>
                                                            {
                                                                topicsList.map((topic) =>
                                                                    <option
                                                                        key={topic.id}
                                                                        value={topic.id}
                                                                    >
                                                                        {topic.name}
                                                                    </option>
                                                                )
                                                            }
                                                        </CSelect>
                                                    </CFormGroup>
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <CFormGroup>
                                                        <CLabel> <strong>Durée :</strong> </CLabel>
                                                        <CInput
                                                            // TODO : Permettre d'incrémenter de 10 en 10
                                                            type='time'
                                                            value={duration}
                                                            name='duration'
                                                            onChange={this.updateState}
                                                            onKeyDown={() => this.setDuration}
                                                        />
                                                    </CFormGroup>
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <strong>Auteur :</strong>  {ticket.author.name + ' ' + ticket.author.firstname}
                                                </ListGroup.Item>
                                                { ticket.author.id !== ticket.requester.id &&
                                                    <ListGroup.Item>
                                                        <strong>Demandeur :</strong>  {ticket.requester.name + ' ' + ticket.requester.firstname}
                                                    </ListGroup.Item>
                                                }
                                                <ListGroup.Item>
                                                    <CFormGroup>
                                                        <CLabel> <strong>Affecté à :</strong> </CLabel>
                                                        <CSelect
                                                            name="manager_id"
                                                            onChange={this.updateState}
                                                        >
                                                            <option value={ticket.manager.id}>{ticket.manager.id ? ticket.manager.name + ' ' + ticket.manager.firstname : "ticket non attribué"}</option>
                                                            {
                                                                usersList.map((user) =>
                                                                        <option
                                                                            key={user.id}
                                                                            value={user.id}
                                                                        >
                                                                            {user.name + ' ' + user.firstname}
                                                                        </option>
                                                                )
                                                            }
                                                        </CSelect>
                                                    </CFormGroup>
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <strong>Description :</strong>  <br/> {ticket.description}
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </CCol>
                                    </CRow>
                                    <CRow
                                        className='pb-5'
                                    >
                                        <CCol>

                                            <CButton
                                                color='primary'
                                                shape='outline'
                                                onClick={this.manageAddStepModal}
                                                className='mb-2'
                                                block
                                                disabled={closed}
                                            >
                                                <CIcon content={freeSet.cilLibraryAdd} className='pr-1'  />
                                                Ajouter une étape
                                            </CButton>

                                            <>
                                                {
                                                    ticket.hasOwnProperty('all_steps') &&
                                                    ticket.all_steps
                                                        .map((t, i) =>
                                                            <CCard key={t.id}>
                                                                <CButton block onClick={() => this.manageCollapse(i)}>
                                                                    <CTooltip
                                                                        content='Cliquez pour afficher plus de détails'
                                                                        placement='top'
                                                                    >
                                                                        <CCardHeader className='d-flex justify-content-between'>
                                                                            <CCol>
                                                                                {new Date(t.date).toLocaleDateString()}
                                                                            </CCol>
                                                                            <CCol>
                                                                                <CBadge color={getBadge(t.step)}>
                                                                                    {t.step}
                                                                                </CBadge>
                                                                            </CCol>
                                                                        </CCardHeader>
                                                                    </CTooltip>
                                                                </CButton>
                                                                <CCollapse show={collapsed[i]}>
                                                                    <CCardBody>
                                                                        <CListGroup>
                                                                            <CListGroupItem>
                                                                                <strong>Commentaire</strong>
                                                                                <p>
                                                                                    {t.comment}
                                                                                </p>
                                                                                <small>  </small>
                                                                                {/* Ajouter le nom de l'auteur */}
                                                                            </CListGroupItem>
                                                                            <CListGroupItem>
                                                                                <strong>Fichier(s)</strong>
                                                                                {t.files}
                                                                            </CListGroupItem>
                                                                        </CListGroup>
                                                                    </CCardBody>
                                                                </CCollapse>
                                                            </CCard>
                                                        )
                                                }
                                            </>
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                                <CCardFooter>
                                    <CRow
                                        className='justify-content-end'
                                        fluid
                                    >
                                        <CCol
                                            xs='auto'
                                        >
                                            <CButton
                                                color='success'
                                                variant='outline'
                                                type='submit'
                                            >
                                                <CIcon content={freeSet.cilCheck} className='pr-1'  />
                                                Valider
                                            </CButton>
                                        </CCol>
                                        <CCol
                                            xs='auto'
                                        >
                                            <CButton
                                                color='danger'
                                                onClick={() => this.setState({'closeTicket' : !closeTicket})}
                                                disabled={closed}
                                            >
                                                <CIcon content={freeSet.cilXCircle} className='pr-1'  />
                                                Clôturer
                                            </CButton> {/*TODO : demande de cloture si non admin ?*/}
                                        </CCol>
                                    </CRow>
                                </CCardFooter>
                            </CCard>
                        </Form>
                    </CContainer>
                )
            } else {
                return (
                    <CSpinner />
                )
            }
        }
    }
}

export default withRouter(ModifyTicket);
