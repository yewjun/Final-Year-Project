import React, { Component } from 'react';
import './Modal.css'


class Modal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeClass: "is-visible",
            inactiveClass: "display-none"
        }
    }

    render(){
        return(
        <section className={["modal-wrapper", this.props.class, this.props.isOpen === true ? this.state.activeClass : this.state.inactiveClass ].join(" ")}>
            <div className="modal">
                {this.props.children}
            </div>
        </section>
        )
    }
}

export default Modal;
