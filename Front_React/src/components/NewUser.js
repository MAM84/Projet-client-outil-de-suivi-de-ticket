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
  CInputCheckbox,
  CLabel,
  CRow,
  CSelect,
  CTextarea,
} from '@coreui/react';
import {createUser} from "../services/apiUsers";
import {getCompanies} from "../services/apiCompanies";
import Toast from "../components/Toast";

class NewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companies : [],
      toast : false,
      toastTitle : "",
      toastMsg : "",
      errorName: "",
      errorEmail: "",
      errorCompanyId: "",
      errorPassword: "",
      passwordUser: "",
      confirmPasswordUser: "",
    }
  }

  componentDidMount() {
    getCompanies('all', this.displayCompanies, this.displayError);
  }

  displayCompanies = (companies) => {
    companies = companies.map(c => ({id : c.id, name : c.name}));
    this.setState({
      companies : companies,
    })
  }

  displayError = () => {
    this.setState({
      companies : [{id : null, name : "les entreprises n'ont pas pu être chargées"}],
    })
  }

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

  userPassword = (ev) => {
    this.setState(
        {passwordUser: ev.target.value}
    );
  };

  userConfirmPassword = (ev) => {
    this.setState(
        {confirmPasswordUser: ev.target.value}
    );
  };

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
        case 'company_id': this.setState({
          errorCompanyId : "Veuillez sélectionner une entreprise",
        })
        break
        case 'password': this.setState({
          errorPassword : value,
        })
        break
        default: 
    }
  };

  valid = () => {
      this.setState({
          errorName: "",
          errorEmail: "",
          errorCompanyId: "",
          errorPassword: "",
      })
      this.props.history.push('/list-users/all');
  };

  formSubmission = (ev) => {
    ev.preventDefault();
    const form = ev.target;
    const {passwordUser, confirmPasswordUser} = this.state;

    const data = {
      'name' : form.lastname.value,
      'firstname' : form.firstname.value,
      'function' : form.function.value,
      'phone' : form.phone.value,
      'email' : form.mail.value,
      'password' : form.password.value,
      'admin' : form.admin.checked,
      'company_id' : form.company.value,
      'comment' : form.comment.value,
    };

    this.setState({
      errorName: "",
      errorEmail: "",
      errorCompanyId: "",
      errorPassword: "",
    })

    if(passwordUser === confirmPasswordUser){
      createUser(data, this.letsToast, this.valid, this.errors);
    }else{
      this.setState({
        errorPassword: "Les mots de passe saisis ne sont pas identiques",
      })
    } 
  }

  render() {
    const {companies, toast, toastTitle, toastMsg, errorName, errorEmail, errorCompanyId, errorPassword} = this.state;
   
    return (
        <>
          {toast ? <Toast toastTitle={toastTitle} toastMsg={toastMsg} /> : <></>}
          <CRow>
            <CCol xs="12" className="d-flex flex-column align-items-center">
              <CCard>
                <CCardHeader>
                  <h2 className="text-center">Créer un utilisateur</h2>
                </CCardHeader>
                <CCardBody>
                  <CForm name="create-user" action="" method="post" className="form-horizontal" onSubmit={this.formSubmission}>
                    <CFormGroup row>
                      <CCol >
                        <CLabel htmlFor="firstname">Prénom</CLabel>
                      </CCol>
                      <CCol xs="12" >
                        <CInput type="texte" id="firstname" name="firstname" placeholder="Prénom" />
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol >
                        <CLabel htmlFor="lastname">Nom</CLabel>
                      </CCol>
                      <CCol xs="12" >
                        <CInput type="texte" id="lastname" name="lastname" placeholder="Nom" />
                      </CCol>
                      <p class="text-danger"><small>{errorName}</small></p>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol >
                        <CLabel htmlFor="fonction">Fonction</CLabel>
                      </CCol>
                      <CCol xs="12" >
                        <CInput type="texte" id="fonction" name="function" placeholder="Fonction" />
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol >
                        <CLabel htmlFor="company">Entreprise</CLabel>
                      </CCol>
                      <CCol xs="12" >
                        <CSelect custom name="company" id="company" onChange={this.selectCompany}>
                          <option value={null}>Selectionner l'entreprise</option>
                          {companies.map(c => (
                              <option value={c.id} key={c.id} >{c.name}</option>
                          ))}
                        </CSelect>
                      </CCol>
                      <p class="text-danger"><small>{errorCompanyId}</small></p>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol >
                        <CLabel htmlFor="phone">Téléphone</CLabel>
                      </CCol>
                      <CCol xs="12" >
                        <CInput id="phone" name="phone" placeholder="00 00 00 00 00" />
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol >
                        <CLabel htmlFor="mail">E-mail</CLabel>
                      </CCol>
                      <CCol xs="12" >
                        <CInput type="email" id="mail" name="mail" placeholder="E-mail" autoComplete="email"/>
                      </CCol>
                      <p class="text-danger"><small>{errorEmail}</small></p>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol >
                        <CLabel htmlFor="password">Mot de passe</CLabel>
                      </CCol>
                      <CCol xs="12" >
                        <CInput type="password" id="password" name="password" placeholder="Mot de passe" onChange={this.userPassword}/>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol >
                        <CLabel htmlFor="confirmPassword">Confirmation mot de passe</CLabel>
                      </CCol>
                      <CCol xs="12" >
                        <CInput type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirmer votre mot de passe" onChange={this.userConfirmPassword}/>
                      </CCol>
                      <p class="text-danger"><small>{errorPassword}</small></p>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol ><CLabel>Admin</CLabel></CCol>
                      <CCol >
                        <CFormGroup variant="checkbox" className="checkbox d-flex flex-colum align-items-start">
                          <CInputCheckbox
                              id="admin"
                              name="admin"
                          />
                        </CFormGroup>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol >
                        <CLabel htmlFor="comment">Commentaire</CLabel>
                      </CCol>
                      <CCol xs="12" >
                        <CTextarea id="comment" name="comment" placeholder="Commentaire" />
                      </CCol>
                    </CFormGroup>
                    <CCol className='text-right'>
                      <CButton type="submit" size="sm" color="primary">
                        Envoyer
                      </CButton>
                    </CCol>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
    )
  }
}

export default NewUser