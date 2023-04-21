import React, { Component } from 'react';
import {
  CContainer,
  CCol,
  CButton,
  CForm,
  CTextarea,
  CInput,
  CLabel,
  CFormGroup,
  CSelect,
  CCard,
  CCardHeader,
  CCardBody,
  CInputCheckbox, CRow, CSpinner,
}
  from "@coreui/react";
import {getUserById, modifyUser} from "../services/apiUsers";
import {getCompanies} from "../services/apiCompanies";
import Toast from "./Toast";
import {withRouter} from "react-router";

class ModifyUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userIsLoaded : false,
      user: [],
      companies: [],
      nameUser: "",
      firstnameUser: "",
      fonctionUser: "",
      phoneUser: "",
      emailUser: "",
      adminUser: "",
      passwordUser: "",
      confirmPasswordUser: "",
      defaultChecked: {},
      company: "",
      comment: "",
      erreur: false,
      toast : false,
      toastTitle : "",
      toastMsg : "",
      errorName: "",
      errorEmail: "",
      errorPassword: "",
    }
  };

  componentDidMount() {
    // requête pour récupérer le user connecté
    getUserById(this.props.userId, this.displayUser, this.displayError)

    if(this.props.authUser.admin == 1) {
      // requête pour récupérer les entreprises de l'API
      getCompanies('all', this.displayCompany, this.displayError)
    }
  }

  displayUser = (res) => {
    this.setState({
      userIsLoaded : true,
      user: res,
      nameUser: res.name,
      firstnameUser: res.firstname,
      fonctionUser: res.function,
      phoneUser: res.phone,
      emailUser: res.mail,
      adminUser: res.admin,
      defaultChecked: res.admin == 0 ? {} : {defaultChecked: true},
      companyUser: res.companyName,
      companyId: res.companyId,
      commentUser: res.comment,
    })
  };

  displayCompany = (res) => {
    this.setState({
      companies: res,
    })
  };

  displayError = () => {
    this.setState({
      erreur: true,
    })
  };

  modifiyUserName = (ev) => {
    this.setState(
        {nameUser: ev.target.value}
    );
  };

  modifiyUserFirstname = (ev) => {
    this.setState(
        {firstnameUser: ev.target.value}
    );
  };

  modifiyUserFonction = (ev) => {
    this.setState(
        {fonctionUser: ev.target.value}
    );
  };

  modifiyUserPhone = (ev) => {
    this.setState(
        {phoneUser: ev.target.value}
    );
  };

  modifiyUserEmail = (ev) => {
    this.setState(
        {emailUser: ev.target.value}
    );
  };

  modifiyUserAdmin = (ev) => {
    if(ev.target.checked === false){
      this.setState({adminUser: 0})
    }else{
      this.setState({adminUser: 1});
    }
  };

  modifiyUserCompany = (ev) => {
    this.setState(
        {companyUser: ev.target.value}
    );
  };

  modifiyUserPassword = (ev) => {
    this.setState(
        {passwordUser: ev.target.value}
    );
  };

  modifiyUserConfirmPassword = (ev) => {
    this.setState(
        {confirmPasswordUser: ev.target.value}
    );
  };

  modifiyUserComment = (ev) => {
    this.setState(
        {commentUser: ev.target.value}
    );
  };

  letsToast = (titre, message) => {
    this.setState({
      toast : true,
      toastTitle : titre,
      toastMsg : message,
    })

    setTimeout(() => {
      this.setState({
        toast : false,
      })
    }, 3000)
  }

  errors = (key, value) => {
    switch (key) {
        case 'name': this.setState({
            errorName : value,
        })
        break
        case 'email': this.setState({
            errorEmail : value,
        })
        break
        case 'password': this.setState({
          errorPassword : value,
        })
        break
        case 'error': this.setState({
          errorEmail : value,
        })
        break
        default:
    }
  };

  valid = () => {
      this.setState({
          errorName: "",
          errorEmail: "",
          errorPassword: "",
      })
      this.props.history.push('/profil/' + this.props.userId);
  };

  modifyUser = (ev) => {
    ev.preventDefault();
    const {name, firstname, fonction, phone, email, admin, company, password, comment} = ev.target;
    const {adminUser, passwordUser, confirmPasswordUser, companyId} = this.state;

    const data = {
      'name' : name.value,
    };

    if(firstname.value){
      data['firstname'] = firstname.value;
    }
    if(fonction.value){
      data['function'] = fonction.value;
    }
    if(phone.value){
      data['phone'] = phone.value;
    }
    if(email.value){
      data['email'] = email.value;
    }
    if(this.props.authUser.admin == 1 && admin.value){
        data['admin'] = adminUser;
      }else{
        data['admin'] = 0;
    }

    if(this.props.authUser.admin == 1 && company.value){
      data['company_id'] = company.value;
    }else{
      data['company_id'] = companyId;
    }
    if(password.value){
      data['password'] = password.value;
    }
    if(this.props.authUser.admin == 1 && comment.value){
      data['comment'] = comment.value;
    }

    this.setState({
      errorName: "",
      errorEmail: "",
    })

    if(passwordUser === confirmPasswordUser){
      modifyUser(this.props.userId, data, this.letsToast, this.valid, this.errors)
    } else {
      this.setState({
        errorPassword: "Les mots de passe saisis ne sont pas identiques",
      })
    } 
};

  render() {

    const {erreur, userIsLoaded, nameUser, firstnameUser, fonctionUser, phoneUser, emailUser, companyUser, commentUser, defaultChecked, companies, toast, toastTitle, toastMsg, errorName, errorEmail, errorPassword} = this.state;

    if(erreur) {
      return (
          <p>Une erreur est survenue</p>
      )
    } else {
      if(userIsLoaded) {
        return (
            <>
              {toast ? <Toast toastTitle={toastTitle} toastMsg={toastMsg}/> : <></>}
              <CContainer>
                <CCol xs="12" sm="10" md='6'>
                  <CCard>
                    <CCardHeader>
                      Modifier les données de votre profil
                    </CCardHeader>
                    <CCardBody>
                      <CForm action='' method='post' onSubmit={this.modifyUser}>
                        <CFormGroup>
                          <CLabel htmlFor="name">Nom</CLabel>
                          <CInput name="name" id="name" onChange={this.modifiyUserName} value={nameUser}/>
                          <p className="text-danger"><small>{errorName}</small></p>
                        </CFormGroup>
                        <CFormGroup>
                          <CLabel htmlFor="firstname">Prénom</CLabel>
                          <CInput name="firstname" id="firstname" onChange={this.modifiyUserFirstname}
                                  value={firstnameUser}/>
                        </CFormGroup>
                        <CFormGroup>
                          <CLabel htmlFor="fonction">Fonction</CLabel>
                          <CInput name="fonction" id="fonction" onChange={this.modifiyUserFonction}
                                  value={fonctionUser}/>
                        </CFormGroup>
                        <CFormGroup>
                          <CLabel htmlFor="phone">Téléphone</CLabel>
                          <CInput name="phone" id="phone" onChange={this.modifiyUserPhone} value={phoneUser}/>
                        </CFormGroup>
                        <CFormGroup>
                          <CLabel htmlFor="email">Email</CLabel>
                          <CInput name="email" id="email" onChange={this.modifiyUserEmail} value={emailUser}/>
                          <p className="text-danger"><small>{errorEmail}</small></p>
                        </CFormGroup>
                        {this.props.authUser.admin == 1 ?
                        <CFormGroup variant="custom-checkbox">
                          <CCol>
                            <CInputCheckbox custom id="admin" name="admin" {...defaultChecked}
                                            onClick={this.modifiyUserAdmin}/>
                            <CLabel variant="custom-checkbox" htmlFor="admin">Admin</CLabel>
                          </CCol>
                        </CFormGroup>
                        :
                        <></>
                      }
                        {this.props.authUser.admin == 1 ?
                          <CFormGroup>
                            <CCol md="3">
                              <CLabel htmlFor="company">Entreprise</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                              <CSelect custom name="company" id="company" onChange={this.selectCompany}>
                                {/*
                                          fonction map pour afficher toute les entreprise de l'API
                                          Rendre la recherche possible
                                      */}
                                <option value="0">{companyUser}</option>
                                {companies.map(company => (
                                    <option value={company.id} key={company.id}>{company.name}</option>
                                ) )}
                              </CSelect>
                            </CCol>
                          </CFormGroup>
                          :
                          <></>
                        }
                        <CFormGroup>
                          <CLabel htmlFor="password">Mot de passe</CLabel>
                          <CInput type="password" name="password" id="password" placeholder="Mot de passe" onChange={this.modifiyUserPassword}/>
                        </CFormGroup>
                        <CFormGroup>
                          <CLabel htmlFor="confirmPassword">Confirmation mot de passe</CLabel>
                          <CInput type="password" name="confirmPassword" id="confirmPassword" onChange={this.modifiyUserConfirmPassword} placeholder="Confirmer votre mot de passe"/>
                          <p className="text-danger"><small>{errorPassword}</small></p>
                        </CFormGroup>
                        {this.props.authUser.admin == 1 ?
                            <CFormGroup row>
                              <CCol md="3">
                                <CLabel htmlFor="comment">Commentaire (facultatif)</CLabel>
                              </CCol>
                              <CCol xs="12" md="9">
                                <CTextarea
                                    name="comment"
                                    id="comment"
                                    rows="3"
                                    onChange={this.modifiyUserComment}
                                    value={commentUser}
                                />
                              </CCol>
                            </CFormGroup>
                            :
                            <></>
                        }
                        <CCol className='text-right'>
                          <CButton type="submit" size="sm" color="primary">Modifier</CButton>
                        </CCol>
                      </CForm>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CContainer>
            </>
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

export default withRouter(ModifyUser);
