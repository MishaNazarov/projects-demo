import React, { Component } from 'react'
import { dispatch } from '@rematch/core'
import ClaimForm from '../ClaimForm'
import { connect } from 'react-redux'
import Claim from './Claim'
import Modal from '../ModalWindows'
import { UserPageS } from '../../style'

const mapState = state => ({
  claims: state.claims,
  modal: state.modal
})

let timeout = null

class ClaimsUser extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const getClaims = () => {
      dispatch.claims.getClaims()
      timeout = setTimeout(getClaims, 30000)
    }
    getClaims()
  }

  componentWillUnmount() {
    clearTimeout(timeout)
  }

  componentWillReceiveProps(newProps) {
    if (this.props.modal !== newProps.modal) {
      dispatch.claims.getClaims()
      document.addEventListener('click', this.hideModal)
      document.addEventListener('keyup', this.hideModal, false)
    }
  }

  hideModal = (event) => {
    if (event.target.classList.contains('close') ||
      event.target.classList.contains('background') ||
      event.keyCode === 27
    ) {
      dispatch.modal.hideUserClaimModal()
      document.removeEventListener('click', this.hideMenu)
      document.removeEventListener('keyup', this.hideModal, false)
    }
  }

  callback = (id) => {
    dispatch.modal.showUserClaimModal(id)
  }

  render() {
    const { claims } = this.props.claims

    if (!claims.length) {
      return (
        <div>Список заявок пуст</div>
      )
    }
    return (
      <div className={ UserPageS.ClaimsList }>
        { claims.map(claim =>
          <Claim
            { ...claim }
            key={ claim.id }
            openModalWindow={ this.callback }
          />) }
        { this.props.modal.userClaimModal === true && <Modal type="Patch" component={ ClaimForm }/> }
      </div>
    )
  }
}

export default connect(mapState)(ClaimsUser)
