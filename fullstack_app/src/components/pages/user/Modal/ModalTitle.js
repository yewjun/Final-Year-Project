import React, { Component } from 'react';

class ModalTitle extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="modal-title">
                {this.state.stepsStage > 1 && !this.state.stepsCompleted ? (
                    <span className="btn-back" onClick={this.previosStep}>
                        <FontAwesomeIcon icon={["fa", "long-arrow-alt-left"]} />
                    </span>
                )
                : (
                    null
                )
                }
                {this.state.stepsCompleted ? (
                    <span>{this.props.currentSymbol}</span>
                ): (
                    <span>{this.props.currentSymbol}</span>
                )}
            </div>
        )
    }
}

export default ModalTitle;