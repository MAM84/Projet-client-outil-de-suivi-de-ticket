import React, {Component} from 'react'
import {
  CCol,
  CContainer,
  CRow
} from '@coreui/react'

class Page500 extends Component {

  render() {
    return(
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <div className="clearfix">
              <h1 className="float-left display-3 mr-4">500</h1>
              <h4 className="pt-3">Houston, nous avons un problème!</h4>
              <p className="text-muted float-left">La page que vous cherchez est actuellement indisponible.</p>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    )
  }
}

export default Page500
