import React, {Component} from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CRow,
  CContainer,
  CLink
} from '@coreui/react'

class PasswordForgotten extends Component {
  render() {

    return (
      <>
        <CContainer>
          <CRow>
            <CCol xs="12" md="12" className="text-center d-flex flex-column align-items-center">
              <CCard>
                <CCardHeader>
                  <h2>Mot de passe oublié ?</h2>
                </CCardHeader>
                <CCardBody>
                  <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal d-flex flex-column align-items-center">
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel htmlFor="mail">E-mail</CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <CInput type="email" id="mail" name="mail" placeholder="E-mail" autoComplete="email"/>
                      </CCol>
                      </CFormGroup>
                      <CRow className="text-center d-flex flex-column align-items-center">
                        <CCol md="9" className="text-center d-flex flex-column align-items-center">
                          <CButton
                          className="bg-info btn-outline-info text-white">
                            Demander la réinitialisation du mot de passe
                          </CButton>
                          <CLink
                          to="" style={{ textDecoration: 'none', color:"black" }}>
                            <CButton
                            className="m-2 bg-white btn-outline-info text-info">
                              Annuler
                            </CButton>
                          </CLink>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </>
    )
  }
}

export default PasswordForgotten