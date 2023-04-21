import {CToast, CToastBody, CToaster, CToastHeader} from "@coreui/react";
import React, {Component} from "react";

class Toast extends Component {
    render() {
        const {toastTitle, toastMsg} = this.props;

        return (
            <CToaster position="top-right">
                <CToast
                    show={true}
                    autohide={2000}
                    fade={true}
                >
                    <CToastHeader closeButton={true}>
                        {toastTitle}
                    </CToastHeader>
                    <CToastBody>
                        {toastMsg}
                    </CToastBody>
                </CToast>
            </CToaster>
        )
    }
}

export default Toast