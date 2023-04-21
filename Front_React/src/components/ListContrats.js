import React, { Component } from 'react'
import {
  CCol, CContainer,
  CDataTable, CRow, CSpinner,
} from '@coreui/react'
import {getContrats} from "../services/apiContrats";

class ListContrats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contrats : [],
      contratsAreLoaded : false,
      erreur : false,
    }
  }

  componentDidMount() {
    const { entreprise} = this.props;
    // récupérer les contrats
    getContrats(entreprise, this.displayContrats, this.displayError);
  }

  displayContrats = (contrats) => {
    contrats = contrats.map(c => {
      c.startingDate = new Date(c.startingDate).toLocaleDateString();
      c.finalDate = new Date(c.finalDate).toLocaleDateString();
      return c;
    });

    this.setState({
      contrats: contrats,
      contratsAreLoaded : true,
    })
  }

  displayError = () => {
    this.setState({
      contratsAreLoaded : true,
      erreur : true,
    })
  }

  render() {
    const {contrats, contratsAreLoaded, erreur} = this.state;
    const {comment, nbLignes} = this.props;

    const fields = [
      {
        key: 'service',
        label: 'Service',
      },
      {
        key: "numberHours",
        label: "Nombre d'heures",
      },
      {
        key: 'durationMonth',
        label: 'Durée',
      },
      {
        key: 'startingDate',
        label: 'Du',
      },
      {
        key: 'finalDate',
        label: 'Au',
      }
    ]

    if(comment) {
      fields.push({
        key: 'contractComment',
        label: 'Commentaire',
      })
    }

    if(contratsAreLoaded) {
      if(erreur) {

        return (
            <p>Une erreur est survenue</p>
        )

      } else {

        return (
            <CDataTable
                items={contrats}
                fields={fields}
                columnFilter
                itemsPerPage={nbLignes}
                hover
                sorter
                pagination
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

export default ListContrats
