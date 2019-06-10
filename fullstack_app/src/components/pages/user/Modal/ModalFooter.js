import React, { Components } from 'react';

class ModalFooter extends Components {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="modal-footer">
                <span className="button-gradient purple text-purple large" onClick={this.handleCoinSubmit}><span>NEXT</span></span>
                <span className="button-gradient green text-green large" onClick={this.modalRemove}><span>CLOSE</span></span>
            </div>
        )
    }
}