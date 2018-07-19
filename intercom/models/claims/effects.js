import client from '../axios-config-module'
import Alert from 'react-s-alert'
import { dispatch } from '@rematch/core'

export default {
  async getClaims() {
    try {
      const response = await client()
        .get(`/claims/`)
      dispatch.claims.setClaims(response.data)
    }
    catch (error) {
      Alert.error(error)
    }
  },

  async getClaim({ id, callback }) {
    try {
      const response = await client()
        .get(`/claims/${id}/`)
      dispatch.currentClaim.setCurrentClaim(response.data)
      callback()
    }
    catch (error) {
      Alert.error(error)
    }
  },

  async postClaim({ formData, id, orgId, callback }) {
    const data = new FormData()
    data.append('user_id', id)
    data.append('firstname', formData.firstname)
    formData.secondname ? data.append('secondname', formData.secondname) :
      data.append('secondname', '')
    data.append('lastname', formData.lastname)
    orgId ? data.append('organization', orgId) : data.append('organization', formData.organization.id)
    data.append('visit_date', formData.visit_date.toISOString(formData.visit_date))
    data.append('notification_email', formData.notification_email)
    data.append('phone', formData.phone)
    data.append('photo', formData.photo[0])
    data.append('passport_photo', formData.passport_photo[0])

    try {
      await client()
        .post(`/claims/`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      Alert.success('<p>Заявка отправлена</p>', { html: true })
      callback()
    }
    catch (error) {
      Alert.error(error)
    }
  },

  async patchClaim({ formData, userId, currentClaim, callback }) {
    const data = new FormData()
    data.append('user_id', userId)
    formData.firstname !== currentClaim.firstname ?
      data.append('firstname', formData.firstname) : null
    formData.secondname !== currentClaim.secondname ?
      data.append('secondname', formData.secondname) : null
    formData.lastname !== currentClaim.lastname ?
      data.append('lastname', formData.lastname) : null
    formData.visit_date !== currentClaim.visit_date ?
      data.append('visit_date', formData.visit_date.toISOString(formData.visit_date)) : null
    formData.notification_email !== currentClaim.notification_email ?
      data.append('notification_email', formData.notification_email) : null
    formData.phone !== currentClaim.phone ?
      data.append('phone', formData.phone) : null
    formData.photo ? data.append('photo', formData.photo[0]) : null
    formData.passport_photo ? data.append('passport_photo', formData.passport_photo[0]) : null

    try {
      await client()
        .patch(`/claims/${currentClaim.id}/`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      Alert.success('<p>Заявка обновлена</p>', { html: true })
      callback()
    }
    catch (error) {
      Alert.error(error)
    }
  },

  async deleteClaim({ currentClaim, callback }) {
    try {
      await client()
        .delete(`/claims/${currentClaim.id}/`)
      Alert.success('<p>Заявка удалена</p>', { html: true })
      callback()
    }
    catch (error) {
      Alert.error(error)
    }
  },

  async postStatus( { visitDate, state, id, callback } ) {
    if ( visitDate < (new Date()).toISOString() ) {
      Alert.error('<p>Дата заявки устарела</p>', { html: true })
    }
    else {
      const data = new FormData()
      data.append('grant_state', state)
      try {
        await client()
          .post(`/claims/${id}/state/`, data, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        Alert.success('<p>Статус успешно изменён</p>', { html: true })

        dispatch.modal.hideUserClaimModal()
        dispatch.modal.hideNewUserClaimModal()
        dispatch.modal.hideNewClaimModal()
        callback()
      }
      catch (error) {
        Alert.error(error)
      }
    }
  },

  async getFilteredClaims(e) {
    try {
      const response = await client()
        .get(`/claims/?grant_state=${ e }`)
      dispatch.claims.setClaims(response.data)
    }
    catch (error) {
      Alert.error(error)
    }
  },
}
