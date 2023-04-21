import React, {Component} from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CLink,
  CCardHeader
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import {login} from "../services/login";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: '',
      password: '',
      error: '',
    }
  }

  updateMail = (ev) => {
    this.setState({
      mail: ev.target.value,
    })
  }

  updatePassword = (ev) => {
    this.setState({
      password: ev.target.value,
    })
  }

  login = (ev) => {
    ev.preventDefault();
    const {mail, password} = this.state;

    login(mail, password, this.props.updateLogin, this.error);
  }

  error = (error) => {
    this.setState({
      error: error,
    })
  }

  render() {
    return (
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCard className="p-4">
              <CCardHeader className="bg-white">
                <h2 className="text-center text-dark">Se connecter</h2>
              </CCardHeader>
              <CCardBody>
                <CForm onSubmit={this.login}>
                  <p className="text-muted">Se connecter à  votre compte </p><p className="text-danger">{this.state.error}</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon content={freeSet.cilUser} />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="email" id="mail" name="mail" placeholder="E-mail" autoComplete="email" onChange={this.updateMail}/>
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon content={freeSet.cilLockLocked} />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" name="password" placeholder="Mot de passe" autoComplete="current-password" onChange={this.updatePassword}/>
                  </CInputGroup>
                  <CRow>
                    <CCol xs="6" className="d-flex flex-colum align-items-start">
                      <CButton type="submit" className="bg-info btn-outline-info text-white">Se connecter</CButton>
                    </CCol>
                    {/* <CCol xs="6" className="text-right">
                      <CLink
                      to="password-forgotten" style={{ textDecoration: 'none', color:"black" }}>
                        <CButton color="link" className="px-0">Mot de passe oublié?</CButton>
                      </CLink>
                    </CCol> */}
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    )
  }
}

export default Login
