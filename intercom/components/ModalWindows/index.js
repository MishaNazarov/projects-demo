import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { ModalS } from '../../style'
import close from 'assets/img/close.svg'

class Modal extends Component {
  componentWillMount() {
    this.root = document.createElement('div')
    this.root.setAttribute("id", "portal")
    document.body.appendChild(this.root)
  }
  componentWillUnmount() {
    document.body.removeChild(this.root)
  }
  render() {
    return ReactDOM.createPortal(
      <div className={ ModalS.wrapper }>
        <div className={ ` ${ModalS.background} background` } />
        <div className={ ModalS.body }>
          <img className={ ` ${ ModalS.closeIcon } close` } alt='' src={ close } />
          < this.props.component type={ this.props.type } organization = { this.props.organization }/>
        </div>
      </div>,
      this.root
    )
  }
}

export default Modal
