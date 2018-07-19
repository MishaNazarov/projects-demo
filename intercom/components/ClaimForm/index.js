import React, { Component } from 'react'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { dispatch } from '@rematch/core'
import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment'

import { Theme, FormControlS, UserClaimsS } from '../../style'
import organizationIcon from 'assets/img/organization.svg'
import calendarIcon from 'assets/img/calendar.svg'
import userIcon from 'assets/img/user-icon.svg'
import emailIcon from 'assets/img/email.svg'
import telephone from 'assets/img/telephone.svg'
import reject from 'assets/img/reject.svg'
import agree from 'assets/img/agree.svg'

import { renderDefaultFormField,
  renderDateTimePicker,
  renderCombobox,
  renderMaskedFormField } from '../utils/FormFields'
import { renderDropzoneInput } from '../utils/ImageUploader'
import validate from './form-validation'

momentLocalizer(Moment)

const selector = formValueSelector('claimForm')

const mapState = state => ({
  user: state.user,
  claims: state.claims,
  currentClaim: state.currentClaim,
  organizations: state.organizations,
  modal: state.modal,
  form: state.form,
  photo: selector(state, 'photo[0].preview'),
  passport: selector(state, 'passport_photo[0].preview')
})

const changeClaimStatus = (e, state) => {
  dispatch.claims.postStatus({
    visitDate: e.visit_date,
    state: state,
    id: e.id,
    callback: ()=>{
      dispatch.claims.getClaims()
    }
  })
}

const claimStatus = (claim, modal, user) => {
  if (modal) {
    switch (claim.grant_state) {
      case 'J':
        return (
          <div className={ FormControlS.status }>
            <label>Статус заявки</label>
            <span>Отказано</span>
          </div>)
      case 'G':
        return (
          <div className={ FormControlS.status }>
            <label>Статус заявки</label>
            <span>Одобрено</span>
          </div> )
      case 'P':
        return (
          <div className={ FormControlS.status }>
            <label>Статус заявки</label>
            <div className={ Theme.groupSpace }>
              <div className={ UserClaimsS.pending }>Ожидание</div>
              { user !== 'V' ? <div>
                <img alt='' className={ Theme.claimControlBtn } src={ agree }
                  onClick={ () => changeClaimStatus(claim, 'G') } />
                <img alt='' className={ Theme.claimControlBtn } src={ reject }
                  onClick={ () => changeClaimStatus(claim, 'J') } />
              </div> : null }
            </div>
          </div>)
      default:
        return (
          <div className={ FormControlS.status }>
            <label>Статус заявки</label>
            <span>Новая заявка</span>
          </div> )
    }
  }
  else {
    return (
      <div className={ FormControlS.status }>
        <label>Статус заявки</label>
        <div className={ FormControlS.span }>Новая заявка</div>
      </div>)
  }
}

class ClaimForm extends Component {
  onSubmit(formData) {
    dispatch.modal.hideUserClaimModal()
    dispatch.modal.hideNewUserClaimModal()
    dispatch.modal.hideNewClaimModal()
    if (this.props.type === 'Patch') {
      dispatch.claims.patchClaim({
        formData: formData,
        userId: this.props.user.id,
        currentClaim: this.props.currentClaim.claim,
        callback: ()=>{
          this.refreshClaims()
        }
      })
    }
    else {
      dispatch.claims.postClaim({
        formData: formData,
        id: this.props.user.id,
        orgId: this.props.organization ? this.props.modal.id : null,
        callback: ()=>{
          this.refreshClaims()
        }
      })
    }
  }

  refreshClaims = () => {
    const filter = this.props.claims.filter
    if (filter === 'All') {
      dispatch.claims.getClaims()
    }
    else {
      dispatch.claims.getFilteredClaims(filter)
    }
  }

  Remove = (e) => {
    e.preventDefault()
    dispatch.claims.deleteClaim({
      currentClaim: this.props.currentClaim.claim,
      callback: ()=>{
        dispatch.modal.hideUserClaimModal()
        this.refreshClaims()
      }
    })
  }

  getInitionalClaimValues() {
    dispatch.claims.getClaim({
      id: this.props.modal.id,
      callback: ()=>{
        const claim = this.props.currentClaim.claim
        const initData = {
          organization: claim.organization.id,
          secondname: claim.secondname,
          lastname: claim.lastname,
          firstname: claim.firstname,
          visit_date: claim.visit_date,
          notification_email: claim.notification_email,
          phone: claim.phone
        }
        this.props.initialize(initData)
      }
    })
  }

  componentDidMount() {
    if (this.props.modal.userClaimModal) {
      this.getInitionalClaimValues()
    }
    if (this.props.modal.newClaimModal) {
      const initData = {
        organization: this.props.modal.id,
      }
      this.props.initialize(initData)
    }
  }

  render() {
    const currentClaim = this.props.currentClaim.claim
    const maodal = this.props.modal.userClaimModal
    const user = this.props.user.visitor_role
    const { organizations } = this.props.organizations
    const test = this.props.organization
    const {
      handleSubmit,
      pristine,
      submitting,
      invalid
    } = this.props

    return (
      <div>
        { claimStatus(currentClaim, maodal, user) }
        <form onSubmit={ handleSubmit(this.onSubmit.bind(this)) }>
          <div className={ FormControlS.form }>
            <h1>{ test }</h1>
            <label>Организация <span>*</span></label>
            <img src={ organizationIcon } className={ FormControlS.icon } alt=""/>
            <Field
              data={ organizations }
              valueField='id'
              textField='name'
              name="organization"
              status= { this.props.type === 'Patch' || this.props.organization }
              component={ renderCombobox }
            />
          </div>
          <div className={ FormControlS.form }>
            <label>Дата посещения <span>*</span></label>
            <img src={ calendarIcon } className={ FormControlS.icon } alt=""/>
            <Field
              name="visit_date"
              component={ renderDateTimePicker }
            />
          </div>
          <div className={ FormControlS.group }>
            <div className={ FormControlS.form }>
              <label>Фамилия <span>*</span></label>
              <img src={ userIcon } className={ FormControlS.icon } alt=""/>
              <Field
                name="lastname"
                component={ renderDefaultFormField }
              />
            </div>
            <div className={ FormControlS.form }>
              <label>Имя <span>*</span></label>
              <img src={ userIcon } className={ FormControlS.icon } alt=""/>
              <Field
                name="firstname"
                component={ renderDefaultFormField }
              />
            </div>
            <div className={ FormControlS.form }>
              <label>Отчество</label>
              <img src={ userIcon } className={ FormControlS.icon } alt=""/>
              <Field
                name="secondname"
                component={ renderDefaultFormField }
              />
            </div>
          </div>
          <div className={ FormControlS.form }>
            <label>Телефон <span>*</span></label>
            <img src={ telephone } className={ FormControlS.icon } alt=""/>
            <Field
              name="phone"
              component={ renderMaskedFormField }
            />
          </div>
          <div className={ FormControlS.form }>
            <label>E-mail <span>*</span></label>
            <img src={ emailIcon } className={ FormControlS.icon } alt=""/>
            <Field
              name="notification_email"
              component={ renderDefaultFormField }
            />
          </div>
          <Field
            label="Фото посетителя"
            name="photo"
            required='true'
            photoUrl = { this.props.type === 'Patch' ? this.props.currentClaim.claim.photo : null }
            component={ renderDropzoneInput }
          />
          <Field
            label='Фото паспорта'
            name='passport_photo'
            required='true'
            photoUrl = { this.props.type === 'Patch' ? this.props.currentClaim.claim.passport_photo : null }
            component={ renderDropzoneInput }
          />
          <div className={ Theme.group }>
            { this.props.type === 'Patch' ?
              <div>
                <button
                  className={ Theme.defBtnBlue }
                  onClick={ this.Remove }>Отозвать</button>
                { currentClaim.grant_state === 'P' ?
                  <button
                    className={ Theme.defBtnBlue }
                    disabled={ pristine || submitting || invalid }
                  >Обновить</button> : null
                }
              </div> :
              <button
                className={ Theme.defBtnBlue }
                disabled={ submitting }
              >Сохранить</button> }
          </div>
        </form>
      </div>
    )
  }
}

export default reduxForm({
  touchOnChange: true,
  validate,
  form: 'claimForm'
})(connect(mapState)(ClaimForm))
