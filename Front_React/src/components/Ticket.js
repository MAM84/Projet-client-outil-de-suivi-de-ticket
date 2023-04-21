import React, { Component } from 'react';
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
    CFormGroup,
    CLabel,
    CListGroup,
    CListGroupItem,
    CCollapse,
    CModal,
    CTooltip, CSpinner, CLink,
}
    from "@coreui/react";
import { CIcon} from '@coreui/icons-react';
import {freeSet} from '@coreui/icons';
import {Form, ListGroup} from "react-bootstrap";
import {getTicketById, addStep} from "../services/apiTickets";
import Toast from "./Toast";
import Error from "./Error";


class Ticket extends Component {
    // TODO : voir si possible de séparer dans deux composants différents l'affichage et la modification du ticket (plus simple pour la gestion des droits...)
    constructor(props) {
        super(props);
        this.state = {
            'ticket' : {},
            'ticketIsLoaded' : false,
            'erreur' : false,
            'errorMessage' : "",
            'topicsList': [],
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
        getTicketById(this.state.ticketID, this.displayTicket, this.displayError);
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
            if(ticket.actual_step === 'Clos') {
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

    displayUsers = (users) => {
        this.setState({
            usersList : users,
        })
    }

    displayError = () => {
        this.setState({
            'ticketIsLoaded' : true,
            'erreur' : true,
        })
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

    updateState = ev => {
        ev.preventDefault();
        this.setState({
            [ev.target.name] : ev.target.value
        });
    }

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
        let {ticket, collapsed, duration, ticketID, closeTicket, closed, toast, toastTitle, toastMsg, ticketIsLoaded, erreur, errorMessage } = this.state;
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
                                        <span>
                                            <strong className='pr-1'> Priorité : </strong> {ticket.priority}
                                        </span>
                                    </CCol>
                                </CRow>
                                <CRow className='mb-5'>
                                    <CCol className=''>
                                        <ListGroup variant='flush'>
                                            <ListGroup.Item>
                                                <strong>Objet :</strong>  {ticket.title}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong>Thème :</strong>  {ticket.topic}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong>Durée :</strong>  {Math.round(ticket.duration / 60) + 'h' + (ticket.duration % 60) + 'min'}
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
                                                <strong>Affecté à :</strong>  {ticket.manager.id ? ticket.manager.name + ' ' + ticket.manager.firstname : "ticket non attribué"}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong>Description :</strong>  <br/> {ticket.description}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong>Fichier(s) :</strong>  <br/>
                                                {ticket['all_steps'].map(t => (
                                                    t.files.map(f => (
                                                        <CLink target="_blank" href={f}>{f} <br/> </CLink>
                                                    ))
                                                ))}
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </CCol>
                                </CRow>
                                <CRow className='pb-5'>
                                    <CCol>
                                        {ticket.hasOwnProperty('all_steps') && ticket['all_steps'].map((t, i) => {
                                            return(
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
                                                                    <strong>Commentaire : </strong>
                                                                    <p>
                                                                        {t.comment}
                                                                    </p>
                                                                    <small> </small>
                                                                    {/* Ajouter le nom de l'auteur */}
                                                                </CListGroupItem>
                                                                <CListGroupItem>
                                                                    <strong>Fichier(s) : </strong>
                                                                    {t.files.map(f => (
                                                                        <CLink target="_blank" href={f}>{f} <br/> </CLink>
                                                                    ))}
                                                                </CListGroupItem>
                                                            </CListGroup>
                                                        </CCardBody>
                                                    </CCollapse>
                                                </CCard>
                                                )}
                                            )}
                                    </CCol>
                                </CRow>
                            </CCardBody>
                            {this.props.authUser.admin == 1 &&
                                <CCardFooter>
                                    <CRow className='justify-content-end' fluid>
                                        <CCol xs='auto'>
                                            <CLink to={"/modify-ticket/" + ticket.id}>
                                                <CButton
                                                    color='warning'
                                                    variant='outline'
                                                    disabled={closed}
                                                >
                                                    <CIcon  content={freeSet.cilPencil} className='pr-1' />
                                                    Modifier
                                                </CButton>
                                            </CLink>
                                        </CCol>
                                        <CCol xs='auto'>
                                            <CButton
                                                color='danger'
                                                onClick={() => this.setState({'closeTicket' : !closeTicket})}
                                                disabled={closed}
                                            >
                                                <CIcon content={freeSet.cilXCircle} className='pr-1' />
                                                Clôturer
                                            </CButton>
                                        </CCol>
                                    </CRow>
                                </CCardFooter>
                            }
                        </CCard>
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

export default Ticket;
