import React, { Component } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCardTitle,
    CCol,
    CLabel,
    CRow,
    CLink,
    CButton,
    CBadge,
    CSpinner,
    CContainer,
} from '@coreui/react';
import {getUserById} from "../services/apiUsers";
import Error from "./Error";


class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user : {},
            userIsLoaded : false,
            erreur : false,
            errorMessage : "",
        }
    }

    componentDidMount() {
        const { userId } = this.props;
        // récupérer l'utilisateur
        getUserById(userId, this.displayUser, this.displayError);
    }

    displayUser = (user) => {
        if(user === 202) {
            this.setState({
                userIsLoaded : true,
                erreur : true,
                errorMessage : "L'utilisateur demandé n'existe pas"
            })
        } else {
            this.setState({
                user: user,
                userIsLoaded : true,
            })
        }
    }

    displayError = () => {
        this.setState({
            userIsLoaded : true,
            erreur : true,
        })
    }

    render(){

        const { user, erreur, errorMessage, userIsLoaded } = this.state;

        const getBadge = (admin)=>{
            switch (admin) {
                case "1": return 'success'
                case "0": return 'primary'
                case 1: return 'success'
                case 0: return 'primary'
                default: return 'secondary'
            }
        }

        if(erreur) {
            return (
                <Error errorMessage={errorMessage}/>
            )
        } else {
            if(userIsLoaded) {
                return (
                    <CRow className='d-flex flex-column align-items-center'>
                        <CCol >
                            <CCard>
                                <CCardHeader>
                                    <CCol>
                                    <CCardTitle>
                                        {user.hasOwnProperty('name') && user.name.toUpperCase()} {user.firstname}

                                    </CCardTitle>
                                    </CCol>
                                    <CCol>
                                        <CBadge color={getBadge(user.admin)}>{user.admin == 1 ? "admin" : "client"}</CBadge>
                                    </CCol>
                                </CCardHeader>
                                <CCardBody>
                                    <CRow>
                                        <CCol >
                                            <CLabel> <strong>Fonction : </strong> </CLabel>

                                            <p className="text-left">{user.hasOwnProperty('function') && user.function}</p>
                                        </CCol>
                                    </CRow>

                                    <CRow>
                                        <CCol >
                                            <CLabel className='pr-1'> <strong> Entreprise : </strong>  </CLabel>
                                            <CLink className="text-left" to={'/company/' + user.companyId}>{user.hasOwnProperty('companyName') && user.companyName}</CLink>
                                        </CCol>
                                    </CRow>

                                    <CRow>
                                        <CCol >
                                            <CLabel> <strong> Adresse e-mail : </strong>  </CLabel>

                                            <p className="text-left">{user.hasOwnProperty('mail') && user.mail}</p>
                                        </CCol>
                                    </CRow>

                                    <CRow>
                                        <CCol >
                                            <CLabel> <strong> Numéro de téléphone : </strong>  </CLabel>

                                            <p className="text-left">{user.hasOwnProperty('phone') && user.phone}</p>
                                        </CCol>
                                    </CRow>

                                    {this.props.authUser.admin == 1 ?
                                        <CRow>
                                            <CCol >
                                                <CLabel> <strong> Commentaire : </strong>  </CLabel>

                                                <p className="text-left">{user.hasOwnProperty('comment') && user.comment}</p>
                                            </CCol>
                                        </CRow>
                                        :
                                        <></>
                                    }

                                    <CRow>
                                        <CCol>
                                            <CLink
                                                to={"/modify-user/" + user.id}
                                                style={{ textDecoration: 'none', color:"black" }}
                                                className="w-100 d-flex justify-content-end">
                                                <CButton className="m-2 bg-white btn-outline-info text-info">
                                                    Modifier
                                                </CButton>
                                            </CLink>
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
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

export default User