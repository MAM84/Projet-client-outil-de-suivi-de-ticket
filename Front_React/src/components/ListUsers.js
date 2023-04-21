import React from 'react';
import {
    CBadge, CCol, CContainer,
    CDataTable,
    CLink, CRow, CSpinner,
} from '@coreui/react';
import {getUsers} from "../services/apiUsers";

class ListUsers extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
          users : [],
          usersAreLoaded : false,
          erreur : false,
    }
  }

    componentDidMount() {
        const { entreprise, nbUsers } = this.props;
        // récupérer les utilisateurs
        getUsers(entreprise, nbUsers, this.displayUsers, this.displayError);
    }

    displayUsers = (users) => {
        users = users.map(u => ({
            'id' : u.id,
            'user' : u.name + ' ' + u.firstname,
            'function' : u.function,
            'companyName' : u.companyName,
            'companyId' : u.companyId,
            'admin' : u.admin,
        }));

        this.setState({
            users: users,
            usersAreLoaded : true,
        })
    }

    displayError = () => {
        this.setState({
            usersAreLoaded : true,
            erreur : true,
        })
    }

  render() {
    const { users, usersAreLoaded, erreur } = this.state;
      const { sorter, filter, showFunction, companyName, showAdmin, modify, nbLignes, see } = this.props;

    const fields = [
          {
            key: 'user',
            label: 'Utilisateur',
          }
      ]
      if(showFunction) {
          fields.push({
              key: 'function',
              label: 'Fonction',
          })
      }
      if(companyName) {
          fields.push({
              key: 'companyName',
              label: 'Entreprise',
          })
      }
      if(showAdmin) {
          fields.push({
              key: 'admin',
              label: 'Statut',
          })
      }
      if(see) {
        fields.push({
            key: 'see',
            label: 'Voir',
            sorter: false,
            filter: false,
        });
        }
      if(modify) {
          fields.push({
              key: 'modify',
              label: 'Modifier',
              sorter: false,
              filter: false,
          })
      }

      const getBadge = (admin)=>{
          switch (admin) {
              case "1": return 'success'
              case "0": return 'primary'
              case 1: return 'success'
              case 0: return 'primary'
              default: return 'secondary'
          }
      }

      if(erreur) {
          return (
              <p>Une erreur est survenue</p>
          )
      } else {
          if (usersAreLoaded) {

              return (
                  <CDataTable
                      items={users}
                      fields={fields}
                      columnFilter={filter}
                      itemsPerPage={nbLignes}
                      hover
                      sorter={sorter}
                      pagination
                      scopedSlots={{
                          'companyName':
                              (item) => (
                                  <td>
                                      <CLink
                                          color="primary"
                                          variant="outline"
                                          shape="square"
                                          size="sm"
                                          to={'/company/' + item.companyId}
                                      >
                                          {item.companyName}
                                      </CLink>
                                  </td>
                              ),
                          'admin':
                              (item) => (
                                  <td>
                                      <CBadge color={getBadge(item.admin)}>
                                          {item.admin == 1 ? 'admin' : 'client'}
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
                                          to={'/profil/' + item.id}
                                      >
                                          Voir
                                      </CLink>
                                  </td>
                              ),
                          'modify':
                              (item) => (
                                  <td>
                                      <CLink
                                          color="primary"
                                          variant="outline"
                                          shape="square"
                                          size="sm"
                                          to={'/modify-user/' + item.id}
                                      >
                                          Modifier
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

export default ListUsers
