import React, {Component} from 'react'
import {
  CHeader,
  CHeaderNav,
  CHeaderNavItem,
  CButton,
  CLink,
  CTooltip, CToggler,
} from '@coreui/react'
import { CIcon} from '@coreui/icons-react';
import {freeSet} from '@coreui/icons';
import {logout} from "../services/login";

class TheHeader extends Component {
  logout = (ev) => {
    ev.preventDefault();
    logout(this.props.updateLogin);
  }

  render() {
    const {loggedIn, authUser} = this.props;

    return (
      <CHeader withSubheader>
        <CHeaderNav className="mr-auto">
          <CToggler
            inHeader
            onClick={this.props.handleSidebar}
          />
        </CHeaderNav>
        <CHeaderNav className="px-3">
          {loggedIn ?
              <>
              <CHeaderNavItem className='pr-1'>
                <CTooltip content='Créer un nouveau ticket' placement='bottom-start'>
                  <CLink to={"/new-ticket"} >
                    <CButton color='success' size={'sm'} variant='outline' shape='square' >
                      <CIcon content={freeSet.cilPlus} />
                    </CButton>
                  </CLink>
                </CTooltip>
              </CHeaderNavItem>
              <CHeaderNavItem>
                <CTooltip content='Générer un pdf' placement='bottom-start'>
                {authUser.admin == 1 ?
                  <CLink to={"/pdf/0"}>
                    <CButton color='dark' size={'sm'} variant='ghost' shape='square'>
                      <CIcon  content={freeSet.cilCalendarCheck}/>
                    </CButton>
                  </CLink>
                :
                <CLink to={"/pdf/" + authUser.companyId}>
                    <CButton color='dark' size={'sm'} variant='ghost' shape='square'>
                      <CIcon  content={freeSet.cilCalendarCheck}/>
                    </CButton>
                  </CLink>
                }
                </CTooltip>
              </CHeaderNavItem>
                <CHeaderNavItem className="px-3">
                  <CLink to={"/profil/" + authUser.id}>
                    <CIcon content={freeSet.cilUser} className='pr-1'/>
                    {authUser.firstname === null ? authUser.name : authUser.firstname + ' ' + authUser.name}
                  </CLink>
                </CHeaderNavItem>
                <CHeaderNavItem>
                  <CLink className='text-danger' onClick={this.logout}>
                    <CIcon content={freeSet.cilX} className='pr-1'/>
                    Déconnexion
                  </CLink>
                </CHeaderNavItem>
              </>
            :
            <CHeaderNavItem  >
            <CLink to={"/login"}>
            Connexion
            </CLink>
            </CHeaderNavItem>
          }
        </CHeaderNav>
      </CHeader>
    )
  }
}

export default TheHeader
