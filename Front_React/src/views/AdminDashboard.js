import React from 'react';
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CCallout,
} from '@coreui/react';
import ListTickets from "../components/ListTickets";
import ListCompanies from "../components/ListCompanies";
import {getTicketsByStep} from "../services/apiTickets";
import NonAuthorizedPage from "../components/NonAuthorizedPage";

class AdminDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nbNewTickets : '',
        }
    }

    componentDidMount() {
        if(this.props.authUser.admin == 1) {
            getTicketsByStep(1, 'all', this.displayNbTickets, this.displayError);
        }
    }

    displayNbTickets = (tickets) => {
        this.setState({
            nbNewTickets : tickets.length,
        })
    }

    displayError = () => {
        // à compléter // TODO : ici...
    }

    render() {
        if(this.props.authUser.admin == 1) {
            const {nbNewTickets} = this.state;
            let nbTicketsRender = <CCallout> </CCallout>
            if(nbNewTickets === 0) {
                nbTicketsRender = <CCallout color='danger'>  <small> aucun nouveau ticket </small> <br/><strong className='h4' > {nbNewTickets} </strong> </CCallout>
            } else if(nbNewTickets === 1) {
                nbTicketsRender = <CCallout color='info'>  <small> nouveau ticket</small> <br/> <strong className='h4'>{nbNewTickets}</strong> </CCallout>
            } else if(nbNewTickets > 1) {
                nbTicketsRender = <CCallout color='info'>  <small> nouveaux tickets </small>  <br/> <strong className='h4'> {nbNewTickets} </strong>  </CCallout>
            }

            return (
                <CContainer>
                    <CCard>
                        <CCardBody>
                            <CRow>
                                <CCol sm={2}>
                                    {nbTicketsRender}
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol sm="12" xl="6">
                                    <CCard>
                                        <CCardHeader className='h2'>
                                            Liste des nouveaux tickets
                                        </CCardHeader>
                                        <CCardBody>
                                            <ListTickets sorter={false} filter={false} entreprise={'all'} user={'all'} step={1} nbTickets={'all'} company={true} requester={false} dateEmission={false} dateResolution={false} />
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                                <CCol sm="12" xl="6">
                                    <CCard>
                                        <CCardHeader>
                                            <h2>Les clients ayant des tickets ouverts</h2>
                                        </CCardHeader>
                                        <CCardBody>
                                            <ListCompanies sorter={false} filter={false} nbCompanies={'all'} nbTickets={true} usersLink={false} modifyLink={false} exportPdf={false} onlyOpenTickets={true} />
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CContainer>
            )
        } else {
            return (
                <NonAuthorizedPage />
            )
        }
    }
}

export default AdminDashboard;
