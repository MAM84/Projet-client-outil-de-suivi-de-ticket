import {CContainer, CRow, CCol} from "@coreui/react";
import React, {Component} from "react";

class Error extends Component {
    render() {
        const {errorMessage} = this.props;

        return (
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md="6">
                        <div className="clearfix">
                            <h1 className="float-left display-3 mr-4">Erreur</h1>
                            {errorMessage === "" ?
                                <>
                                    <h4 className="pt-3">Oh oh, une erreur est survenue...</h4>
                                    <p className="text-muted float-left">Tentez de rafraîchir la page ou contactez nous si l'erreur persiste</p>
                                </>
                                : <h4 className="pt-3">{errorMessage}</h4>
                            }
                        </div>
                    </CCol>
                </CRow>
            </CContainer>
        )
    }
}

export default Error