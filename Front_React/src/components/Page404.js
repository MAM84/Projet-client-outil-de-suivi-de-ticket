import React, {Component} from 'react'
import {
  CCol,
  CContainer,
  CRow
} from '@coreui/react'

class Page404 extends Component {

  render() {
    return(
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <div className="clearfix">
              <h1 className="float-left display-3 mr-4">404</h1>
              <h4 className="pt-3">Oops! Vous êtes perdus</h4>
              <p className="text-muted float-left">La page que vous cherchez n'a pas été trouvée.</p>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    )
  }
}

export default Page404
