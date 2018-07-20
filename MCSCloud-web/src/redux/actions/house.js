import { ajaxRequest } from 'utils/api-adapter'

import {
  ERROR,
  // ERROR_CLEAR,
  CHANGE_HOUSE_SETTING,
  UPDATE_HOUSE_USERS_LIST,
  UPDATE_HOUSE_USER,
  REMOVE_USER_FROM_HOUSE,
  REMOVE_HOUSE,
  UPDATE_WORKDAYS,
} from 'redux/actions'

export const GET_HOUSES_USER_REQUEST = 'GET_HOUSES_USER_REQUEST'
export const GET_HOUSES_USER_FINISHED = 'GET_HOUSES_USER_FINISHED'
export const CHANGE_SETTING_REQUEST = 'CHANGE_SETTING_REQUEST'
export const CHANGE_SETTING_FINISHED = 'CHANGE_SETTING_FINISHED'
export const UPDATE_HOUSE_USER_REQUEST = 'UPDATE_HOUSE_USER_REQUEST'
export const UPDATE_HOUSE_USER_FINISHED = 'UPDATE_HOUSE_USER_FINISHED'
export const INVITE_USER_REQUEST = 'INVITE_USER_REQUEST'
export const INVITE_USER_FINISHED = 'INVITE_USER_FINISHED'
export const REMOVE_USER_FROM_HOUSE_REQUEST = 'REMOVE_USER_FROM_HOUSE_REQUEST'
export const REMOVE_USER_FROM_HOUSE_FINISHED = 'REMOVE_USER_FROM_HOUSE_FINISHED'
export const UPDATE_WORKDAYS_REQUEST = 'UPDATE_WORKDAYS_REQUEST'
export const UPDATE_WORKDAYS_FINISHED = 'UPDATE_WORKDAYS_FINISHED'

import { PENDING, FINISHED, isPending } from 'redux/reducers/request'

export function ChangeSetting({ id, key, value }) {
  return (dispatch, getState) => {
    dispatch({ type: CHANGE_SETTING_REQUEST })

    return ajaxRequest(`/houses/${id}/`, {
      method: 'PATCH',
      body: { [key]: value },
    }, getState().authorization.token)
      .then(response => {
        dispatch({ type: CHANGE_HOUSE_SETTING, payload: { id, key, value }})
        dispatch({ type: CHANGE_SETTING_FINISHED })
        return Promise.resolve(response)
        // return Promise.resolve({ id, key, value, houses })
      })
      .catch(error => {
        dispatch({ type: ERROR, payload: { ...error }})
        dispatch({ type: CHANGE_SETTING_FINISHED })
        return Promise.reject(error)
      })
  }
}

export function FetchHouseUsers({ token, id }) {
  return ajaxRequest(`/houses/${id}/users/`, {}, token)
    .then(response => Promise.resolve(response))
    .catch(error => Promise.reject(error))
}

export function GetHouseUsers({ id }) {
  return (dispatch, getState) => {
    if (isPending(getState, `${GET_HOUSES_USER_REQUEST}.${ id }`)) {
      return
    }

    dispatch({ type: GET_HOUSES_USER_REQUEST, status: PENDING, key: id })

    return FetchHouseUsers({ id, token: getState().authorization.token })
      .then(response => {
        dispatch({ type: UPDATE_HOUSE_USERS_LIST, id, users: response })
        dispatch({ type: GET_HOUSES_USER_REQUEST, status: FINISHED, key: id })
        return Promise.resolve(response)
      })
      .catch(error => {
        dispatch({ type: ERROR, payload: { ...error }})
        dispatch({ type: GET_HOUSES_USER_REQUEST, status: FINISHED, key: id })
        return Promise.reject(error)
      })
  }
}

export function UpdateHouseUser({ id, user }) {
  return (dispatch, getState) => {
    dispatch({ type: UPDATE_HOUSE_USER_REQUEST })

    return ajaxRequest(`/houses/${id}/users/${user.id}/`, {
      method: 'PUT',
      body: { ...user },
    }, getState().authorization.token)
      .then(response => {
        dispatch({ type: UPDATE_HOUSE_USER, id, user })
        dispatch({ type: UPDATE_HOUSE_USER_FINISHED })
        return Promise.resolve(response)
      })
      .catch(error => {
        dispatch({ type: ERROR, payload: { ...error }})
        dispatch({ type: UPDATE_HOUSE_USER_FINISHED })
        return Promise.reject(error)
      })
  }
}

export function InviteUser({ houseID, role, email }) {
  return (dispatch, getState) => {
    dispatch({ type: INVITE_USER_REQUEST })

    return ajaxRequest(`/houses/${houseID}/users/`, {
      method: 'POST',
      body: {
        email,
        role,
      },
    }, getState().authorization.token)
      .then(response => {
        dispatch({ type: INVITE_USER_FINISHED })
        return Promise.resolve(response)
      })
      .catch(error => {
        dispatch({ type: ERROR, payload: { ...error }})
        dispatch({ type: INVITE_USER_FINISHED })
        return Promise.reject(error)
      })
  }
}

export function RemoveUserFromHouse({ houseID, userID, removeHouse }) {
  return (dispatch, getState) => {
    dispatch({ type: REMOVE_USER_FROM_HOUSE_REQUEST })

    return ajaxRequest(`/houses/${houseID}/users/${userID}/`, {
      method: 'DELETE',
    }, getState().authorization.token)
      .then(response => {
        dispatch({ type: REMOVE_USER_FROM_HOUSE, houseID, userID })
        if (removeHouse) {
          dispatch({ type: REMOVE_HOUSE, id: houseID })
        }
        dispatch({ type: REMOVE_USER_FROM_HOUSE_FINISHED })

        return Promise.resolve(response)
      })
      .catch(error => {
        dispatch({ type: ERROR, payload: { ...error }})
        dispatch({ type: REMOVE_USER_FROM_HOUSE_FINISHED })
        return Promise.reject(error)
      })
  }
}

export function UpdateWorkdays({ houseID, payload }) {
  return (dispatch, getState) => {
    dispatch({ type: UPDATE_WORKDAYS_REQUEST })

    return ajaxRequest(`/houses/${houseID}/`, {
      method: 'PATCH',
      body: {
        workdays: { ...payload },
      },
    }, getState().authorization.token)
      .then(response => {
        dispatch({ type: UPDATE_WORKDAYS, houseID, payload })
        dispatch({ type: UPDATE_WORKDAYS_FINISHED })

        return Promise.resolve(response)
      })
      .catch(error => {
        dispatch({ type: ERROR, payload: { ...error }})
        dispatch({ type: UPDATE_WORKDAYS_FINISHED })

        return Promise.reject(error)
      })
  }
}
