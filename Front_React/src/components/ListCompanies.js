import React from 'react';
import {
    CCol,
    CContainer,
    CDataTable,
    CLink,
    CRow,
    CSpinner,
} from '@coreui/react';
import {getCompanies} from '../services/apiCompanies';
import Error from "./Error";

class ListCompanies extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            companies : [],
            companiesAreLoaded : false,
            erreur : false,
        }
    }

    componentDidMount() {
        const { nbCompanies } = this.props;
        // récupérer les entreprises
        getCompanies(nbCompanies, this.displayCompanies, this.displayError);
    }

    displayCompanies = (companies) => {
        companies = companies.map(c => ({
            'id' : c.id,
            'name' : c.name,
            'nbTickets' : c.nbTicketsEncours,
            'contractFinalDate' : c.contracts.length > 0 ? (new Date(c.contracts[0].finalDate) < Date.now() ? 'contrat expiré' : new Date(c.contracts[0].finalDate).toLocaleDateString()) : 'aucun contrat',
            'contractRemainingTime' : c.contracts.length > 0 ? c.contracts[0].remainingTimeActual.split(':')[0] + 'h' + c.contracts[0].remainingTimeActual.split(':')[1] + 'min' : 'aucun contrat'
        }));

        if(this.props.onlyOpenTickets) {
            companies = companies.filter(c => c.nbTickets > 0);
        }

        this.setState({
            companies: companies,
            companiesAreLoaded : true,
        })
    }

    displayError = () => {
        this.setState({
            companiesAreLoaded : true,
            erreur : true,
        })
    }

    render() {
        const {companies, companiesAreLoaded, erreur} = this.state;
        const { sorter, filter, nbTickets, usersLink, modifyLink, exportPdf, nbLignes } = this.props;

        const fields = [
            {
                key: 'name',
                label: 'Nom',
            },
        ]
        if(nbTickets) {
            fields.push({
                key: 'nbTickets',
                label: 'Nombre de tickets en cours',
            });
        }
        fields.push({
                key: 'contractFinalDate',
                label: 'Fin du contrat',
            },
            {
                key: 'contractRemainingTime',
                label: 'Temps restant',
            })
        if(usersLink) {
            fields.push({
                key: 'see-users',
                label: 'Utilisateurs',
                sorter: false,
                filter: false,
            });
        }
        fields.push({
                key: 'see',
                label: 'Détails',
                sorter: false,
                filter: false,
            })
        if(modifyLink) {
            fields.push({
                key: 'modify',
                label: 'Modifier',
                sorter: false,
                filter: false,
            });
        }
        if(exportPdf) {
            fields.push({
                key: 'exportPdf',
                label: 'Export PDF',
                sorter: false,
                filter: false,
            })
        }

        if(companiesAreLoaded) {
            if(erreur) {

                return (
                    <Error />
                )

            } else {

                return (
                    <CDataTable
                        items={companies}
                        fields={fields}
                        columnFilter={filter}
                        itemsPerPage={nbLignes}
                        hover
                        sorter={sorter}
                        pagination
                        scopedSlots = {{
                            'nbTickets':
                                (item)=>(
                                    <td>
                                        <CLink
                                            color="primary"
                                            variant="outline"
                                            shape="square"
                                            size="sm"
                                            to={'/list-tickets/' + item.id + '/all/all'}
                                        >
                                            {item.nbTickets}
                                        </CLink>
                                    </td>
                                ),
                            'see-users':
                                (item)=>(
                                    <td>
                                        <CLink
                                            color="primary"
                                            variant="outline"
                                            shape="square"
                                            size="sm"
                                            to={'/list-users/' + item.id }
                                        >
                                            Voir les clients
                                        </CLink>
                                    </td>
                                ),
                            'see':
                                (item)=>(
                                    <td>
                                        <CLink
                                            color="primary"
                                            variant="outline"
                                            shape="square"
                                            size="sm"
                                            to={'/company/' + item.id}
                                        >
                                            Voir
                                        </CLink>
                                    </td>
                                ),
                            'modify':
                                (item)=>(
                                    <td>
                                        <CLink
                                            color="primary"
                                            variant="outline"
                                            shape="square"
                                            size="sm"
                                            to={'/modify-company/' + item.id}
                                        >
                                            Modifier
                                        </CLink>
                                    </td>
                                ),
                            'exportPdf':
                                (item)=>(
                                    <td>
                                        <CLink
                                            color="primary"
                                            variant="outline"
                                            shape="square"
                                            size="sm"
                                            to={'/pdf/' + item.id}
                                        >
                                            Bilan PDF
                                        </CLink>
                                    </td>
                                ),
                        }}
                    />
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

export default ListCompanies
