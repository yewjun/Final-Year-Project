import React, { Component } from 'react';


class c extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className={["steps-indicator mb20", "step-"+this.props.stepsStage].join(" ")}>
                <span><span className="text">Withdrawal Details</span></span>
                <span><span className="text">Trading Pin</span></span>
                <span><span className="text">OTP/2FA</span></span>
                <span><span className="text">Confirmation</span></span>
            </div>
        )
    }
}

export default StepsIndicator;
