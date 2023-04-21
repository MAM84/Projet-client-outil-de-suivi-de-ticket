import React, {Component} from 'react'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CImg,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import logo from "../images/logo-RingoStudio.png";

class TheSidebar extends Component{
  constructor(props) {
    super(props);
    this.state = {
      navigation : [],
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {authUser} = this.props;
    if (authUser !== prevProps.authUser) {
      if(authUser === undefined || authUser === null) {
        this.setState({
          navigation: [],
        })
      } else if (authUser.admin == 1) {
        this.setState({
          navigation : [
            {
              _tag: 'CSidebarNavItem',
              name: 'Dashboard',
              to: '/admin-dashboard'
            },
            {
              _tag: 'CSidebarNavItem',
              name: 'Profil',
              to: '/profil/' + authUser.id
            },
            {
              _tag: 'CSidebarNavDropdown',
              name: 'Tickets',
              route: '/base',
              _children: [
                {
                  _tag: 'CSidebarNavItem',
                  name: 'Liste des tickets',
                  to: '/list-tickets/all/all/all',
                },
                {
                  _tag: 'CSidebarNavItem',
                  name: 'Créer un ticket',
                  to: '/new-ticket',
                },
              ],
            },
            {
              _tag: 'CSidebarNavDropdown',
              name: 'Utilisateurs',
              route: '/base',
              _children: [
                {
                  _tag: 'CSidebarNavItem',
                  name: 'Liste des utilisateurs',
                  to: '/list-users/all',
                },
                {
                  _tag: 'CSidebarNavItem',
                  name: 'Créer un utilisateur',
                  to: '/create-user',
                },
              ],
            },
            {
              _tag: 'CSidebarNavDropdown',
              name: 'Entreprises',
              route: '/base',
              _children: [
                {
                  _tag: 'CSidebarNavItem',
                  name: 'Voir les entreprises',
                  to: '/list-companies',
                },
                {
                  _tag: 'CSidebarNavItem',
                  name: 'Créer une entreprise',
                  to: '/new-company',
                }
              ],
            }
          ]
        })
      } else {
        this.setState({
          navigation : [
            {
              _tag: 'CSidebarNavItem',
              name: 'Accueil',
              to: '/user-dashboard'
            },
            {
              _tag: 'CSidebarNavItem',
              name: 'Mon profil',
              to: '/profil/' + authUser.id
            },
            {
              _tag: 'CSidebarNavDropdown',
              name: 'Tickets',
              route: '/base',
              _children: [
                {
                  _tag: 'CSidebarNavItem',
                  name: 'Mes tickets',
                  to: '/list-tickets/' + authUser.companyId + '/' + authUser.id + '/all',
                },
                {
                  _tag: 'CSidebarNavItem',
                  name: 'Créer un ticket',
                  to: '/new-ticket',
                },
              ],
            },
            {
              _tag: 'CSidebarNavDropdown',
              name: 'Mon entreprise',
              route: '/base',
              _children: [
                {
                  _tag: 'CSidebarNavItem',
                  name: 'Compte',
                  to: '/company/' + authUser.companyId,
                },
                {
                  _tag: 'CSidebarNavItem',
                  name: 'Liste des tickets',
                  to: '/list-tickets/' + authUser.companyId + '/all/all',
                },
              ],
            }
          ]
        })
      }
    }
  }

  render(){
    const {navigation} = this.state;

    return (
      <CSidebar
        show={this.props.show}
      >
        <CSidebarBrand className="d-md-down-none" to="/admin-dashboard">
          <CImg
            src={logo}
            className="m-2 w-50"
          />
          <CIcon
            className="c-sidebar-brand-minimized"
            name="sygnet"
            height={35}
          />
        </CSidebarBrand>
        <CSidebarNav>
          <CCreateElement
            items={navigation}
            components={{
              CSidebarNavDivider,
              CSidebarNavDropdown,
              CSidebarNavItem,
              CSidebarNavTitle
            }}
          />
        </CSidebarNav>
      </CSidebar>
    )
  }
}

export default TheSidebar
