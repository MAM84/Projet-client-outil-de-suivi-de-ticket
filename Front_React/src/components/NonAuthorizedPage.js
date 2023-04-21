import React, {Component} from 'react'
import {
    CCol,
    CContainer,
    CRow
} from '@coreui/react'

class NonAuthorizedPage extends Component {

    render() {
        return(
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md="6">
                        <div className="clearfix">
                            <h1 className="float-left display-3 mr-4">!</h1>
                            <h4 className="pt-3">Hâlte là !</h4>
                            <p className="text-muted float-left">Vous n'êtes pas autorisés à visualiser ce contenu.</p>
                        </div>
                    </CCol>
                </CRow>
            </CContainer>
        )
    }
}

export default NonAuthorizedPage
