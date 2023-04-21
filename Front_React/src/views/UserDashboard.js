import React from 'react';
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CWidgetProgress,
    CWidgetIcon,
    CSpinner,
} from '@coreui/react';
import ListTickets from "../components/ListTickets";
import {getUserById} from "../services/apiUsers";
import User from "../components/User";
import Error from "../components/Error";
import {getCompanyById} from "../services/apiCompanies";
import {CIcon} from '@coreui/icons-react';
import {freeSet} from '@coreui/icons';

class UserDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userIsLoaded : false,
            erreur : false,
            companyId : 0,
            companyIsLoaded : false,
            companyLastContractRemainingTime : 0,
            contratTimeColor : '',
            contratTimeValue : 0,
            contratTime : '',
        }
    }

    componentDidMount() {
        getUserById(this.props.authUser.id, this.updateCompanyId, this.displayError);
    }

    updateCompanyId = (user) => {
        this.setState({
            userIsLoaded : true,
            companyId : user.companyId,
        })
        getCompanyById(user.companyId, this.displayLastContract, this.displayError)
    }

    displayLastContract = (c) => {
        this.companyLastContractFinalDate = c.contracts.length > 0 ? (new Date(c.contracts[0].finalDate) < Date.now() ? 'contrat expiré' : new Date(c.contracts[0].finalDate).toLocaleDateString()) : 'aucun contrat';
        this.setState({
            companyIsLoaded : true,
            companyLastContractRemainingTime : c.contracts.length > 0 ? c.contracts[0].remainingTimeActual.split(':')[0] + 'h' + c.contracts[0].remainingTimeActual.split(':')[1] + 'min' : 'aucun contrat',
        });
        // TODO :   - Rendre contratTimeValue dynamique
        //          - Switch pour gérer contratTimeColor
        if (this.companyLastContractFinalDate === 'contrat expiré') {
            this.setState({
                contratTime : "Votre contrat a expiré",
                contratTimeValue : 100,
                contratTimeColor : 'danger',
            })
        } else if (this.companyLastContractFinalDate === 'aucun contrat') {
            this.setState({
                contratTime : "Vous n'avez aucun contrat connu",
                contratTimeValue : 0,
                contratTimeColor : 'warning',
            })
        } else {
            this.setState({
                contratTime : 'Votre contrat expire le ' + this.companyLastContractFinalDate,
                contratTimeValue : 45,
                contratTimeColor : 'success',
            })
        }
    }

    displayError = () => {
        this.setState({
            userIsLoaded : true,
            erreur : true,
        })
    }

    render() {
        const {erreur, userIsLoaded, companyId, companyIsLoaded, companyLastContractRemainingTime, contratTime, contratTimeColor, contratTimeValue} = this.state;
        const {authUser} = this.props;

        if(erreur) {
            return (
                <Error />
            )
        } else {
            if(userIsLoaded) {
                if(companyIsLoaded) {
                    return (
                        <CCardBody>
                            <CRow>
                                <CCol  sm='3' md='4'>
                                    <CWidgetIcon
                                        text="temps restant au contrat"
                                        header={companyLastContractRemainingTime}
                                        color="info"
                                    > {/*TODO : rouge si négatif*/}
                                        <CIcon content={freeSet.cilClock} size={'2xl'}/>
                                    </CWidgetIcon>
                                </CCol>
                                {/* TODO : uniformiser la hauteur des widgets */}
                                <CCol sm='3' md='4' >
                                    <CWidgetProgress
                                        color={contratTimeColor}
                                        text= {contratTime}
                                        value={contratTimeValue}
                                    />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol sm="12" xl="4">
                                    <User userId={this.props.authUser.id} authUser={authUser}/>
                                </CCol>
                                <CCol sm="12" xl="8">
                                    <CCard>
                                        <CCardBody>
                                            {
                                                companyId > 0 &&
                                                <ListTickets sorter={false} filter={false} entreprise={companyId} user={'all'} step={'all'} nbTickets={'all'} company={false} requester={true} dateEmission={true} dateResolution={true} />
                                            }
                                        </CCardBody>
                                    </CCard>


                                </CCol>
                            </CRow>
                        </CCardBody>
                    )
                } else {
                    return (
                        <CRow className='d-flex justify-content-center'>
                            <CSpinner
                                color="primary"
                                style={{width:'4rem', height:'4rem'}}
                            />
                        </CRow>
                    )
                }
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

export default UserDashboard;
