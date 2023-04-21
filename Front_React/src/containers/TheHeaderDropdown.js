import React, {Component} from 'react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
  CButton,
  CButtonGroup,
  CLink
} from '@coreui/react'
import avatar from '../images/6.jpg';

class TheHeaderDropdown extends Component {
  
  render(){
    return (
      <CDropdown
        inNav
        className="c-header-nav-items mx-2"
        direction="down"
      >
        <CDropdownToggle className="c-header-nav-link" caret={false}>
          <div className="c-avatar">
            <CImg
              src={avatar}
              className="c-avatar-img"
              alt="admin@bootstrapmaster.com"
            />
          </div>
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownItem color="secondary" header>
              <h4 class="w-100 text-center text-white">Prénom, nom</h4>
          </CDropdownItem>
          <CDropdownItem className="d-flex justify-content-between"             
            tag="div">
              <CButtonGroup className="mr-3">
              <CLink to={"/profil/"+ this.props.userId}>
                <CButton color="info">Profil</CButton>
                </CLink>
              </CButtonGroup>
              <CButtonGroup>
                <CLink to="">
                  <CButton color="dark" >Se déconnecter</CButton>
                </CLink>
              </CButtonGroup>
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    )
  }
}

export default TheHeaderDropdown
