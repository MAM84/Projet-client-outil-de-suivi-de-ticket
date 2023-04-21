import React from 'react';
import {
    CDataTable,
    CLink,
    CBadge, CSpinner, CContainer, CRow, CCol,
} from '@coreui/react';
import {getTickets, getTicketsByCompany, getTicketsByStep, getTicketsByUser} from '../services/apiTickets';
import {getSteps} from "../services/apiSteps";
import Error from "./Error";

class ListTickets extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        tickets : [],
        ticketsAreLoaded : false,
        erreur : false,
    }
  }

  componentDidMount() {
      // récupérer les noms des steps
      getSteps(this.updateSteps, this.displayError);

      const { entreprise, user, step, nbTickets } = this.props;

      // récupérer les tickets
          if(entreprise !== 'all' && user === 'all') {
              getTicketsByCompany(entreprise, nbTickets, this.displayTickets, this.displayError);
          } else if (entreprise !== 'all' && user !== 'all') {
              getTicketsByUser(user, nbTickets, this.displayTickets, this.displayError);
          } else if (step !== 'all') {
              getTicketsByStep(step, nbTickets, this.displayTickets, this.displayError);
          } else {
              getTickets(nbTickets, this.displayTickets, this.displayError);
          }
  }

    displayTickets = (tickets) => {
      const {step} = this.props;

      tickets = tickets.map(t => ({
              'id' : t.id,
              'company' : t.requester.company,
              'requester' : t.requester.name + ' ' + t.requester.firstname,
              'dateEmission' : t.dateEmission,
              'actual_step' : t.actual_step,
              'actual_step_id' : t.actual_step_id,
              'dateResolution' : t.dateResolution,
              'title' : t.title,
          }));

      if(step !== 'all') {
          tickets = tickets.filter(t => t.actual_step_id === step);
      }

      this.setState({
          tickets: tickets,
          ticketsAreLoaded : true,
      })
  }

  updateSteps = (steps) => {
      this.steps = steps;
  }

  displayError = () => {
      this.setState({
          ticketsAreLoaded : true,
          erreur : true,

      })
  }

  render() {
    const { tickets, ticketsAreLoaded, erreur } = this.state;
    const { sorter, filter, company, requester, dateEmission, dateResolution, nbLignes } = this.props;

      const fields = []
      if(company) {
          fields.push({
                  key: 'company',
                  label: 'Entreprise',
              })
      }
      if(requester) {
          fields.push({
              key: 'requester',
              label: 'Demandeur',
          })
      }
      if(dateEmission) {
          fields.push({
              key: 'dateEmission',
              label: 'Emis le',
              filter: false,
          })
      }
      fields.push({
          key: 'actual_step',
          label: 'Etat',
      });
      if(dateResolution) {
          fields.push({
              key: 'dateResolution',
              label: 'Résolu le',
              filter: false,
          })
      }
      fields.push({
              key: 'title',
              label: 'Titre',
          },
          {
              key: 'see',
              label: 'Détails',
              sorter: false,
              filter: false,
          });

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
              <Error />
          )
      } else {

          if (ticketsAreLoaded) {

              return (
                  <CDataTable
                      items={tickets}
                      fields={fields}
                      columnFilter={filter}
                      itemsPerPage={nbLignes}
                      hover
                      sorter={sorter}
                      pagination
                      scopedSlots={{
                          'actual_step':
                              (item) => (
                                  <td>
                                      <CBadge color={getBadge(item.actual_step)}>
                                          {item.actual_step}
                                      </CBadge>
                                  </td>
                              ),
                          'see':
                              (item) => (
                                  <td>
                                      <CLink
                                          color="primary"
                                          variant="outline"
                                          shape="square"
                                          size="sm"
                                          to={'/ticket/' + item.id}
                                      >
                                          Voir
                                      </CLink>
                                  </td>
                              ),
                      }}
                  />
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

export default ListTickets
