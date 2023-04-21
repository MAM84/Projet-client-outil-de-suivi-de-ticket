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
  CRow,
  CImg,
  CContainer
} from '@coreui/react'

class ResetPassword extends Component {

  render() {
    return (
      <>
        <CContainer>
          <CRow>
            <CCol xs="12" md="12" className="text-center d-flex flex-column align-items-center">
              <CImg
              src="images/xxx.png"
              className="mb-2 w-25"
              />
            </CCol>
            <CCol xs="12" md="12" className="text-center d-flex flex-column align-items-center">
              <CCard className="col-sm-6">
                <CCardHeader className="bg-white">
                  <h2 className="text-center text-dark">Réinitialisation du mot de passe</h2>
                </CCardHeader>
                <CCardBody>
                  <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal d-flex flex-column align-items-center">
                    <CFormGroup row className="col-sm-10">
                      <CCol xs="12">
                        <CInput type="password" id="mail" name="mail" placeholder="Nouveau mot de passe"/>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row className="col-sm-10">
                      <CCol xs="12">
                        <CInput type="password" id="mail" name="mail" placeholder="Réécrire votre mot de passe "/>
                      </CCol>
                    </CFormGroup>
                    <CRow className="w-100 text-center d-flex flex-column align-items-center">
                      <CCol md="9" className="text-center d-flex flex-column align-items-center">
                        <CButton
                        className="m-2 bg-info btn-outline-info text-white">
                          Réinitialiser le mot de passe
                        </CButton>
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

export default ResetPassword