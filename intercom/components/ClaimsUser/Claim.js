import React, { Component } from 'react'
import Moment from 'moment'

import { UserClaimsS } from '../../style'
import arrow from 'assets/img/arrow.svg'

let status = ''
let styleStatus = ''
Moment.locale('ru')

class Claim extends Component {
  showModalWindow = (id) => {
    this.props.openModalWindow(id)
  }

  render() {
    const { id, organization, grant_state } = this.props
    let { visit_date } = this.props

    visit_date = Moment(visit_date).format('DD.MM.YY HH:mm ')
    switch (grant_state) {
      case 'P':
        status = 'Ожидание'
        styleStatus = 'pending'
        break
      case 'G':
        status = 'Одобрено'
        styleStatus = 'approved'
        break
      default:
        status = 'Отказано'
        styleStatus = 'denied'
    }
    return (
      <div className={ UserClaimsS.wrapper } onClick={ () => this.showModalWindow(id) }>
        <div className={ UserClaimsS.light }>Заявка { id }</div>
        <div className={ UserClaimsS.info }>
          <div className={ UserClaimsS.bold }>{ organization.name }</div>
          <img alt='' className={ UserClaimsS.arrow } src={ arrow } onClick={ this.showPostForm }/>
        </div>
        <div className={ UserClaimsS.status }>
          <div className={ UserClaimsS.light }>{ visit_date }</div>
          <div className={ UserClaimsS[styleStatus] }>{ status }</div>
        </div>
      </div>
    )
  }
}

export default Claim
