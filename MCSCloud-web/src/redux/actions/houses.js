import { ajaxRequest } from 'utils/api-adapter'

import {
  ERROR,
  USER_HOUSES,
  NEW_HOUSE,
  REMOVE_HOUSE,
} from 'redux/actions'

export const GET_HOUSES_REQUEST = 'GET_HOUSES_REQUEST'
export const NEW_HOUSE_REQUEST = 'NEW_HOUSE_REQUEST'
export const NEW_HOUSE_FINISHED = 'NEW_HOUSE_FINISHED'
export const REMOVE_HOUSE_REQUEST = 'REMOVE_HOUSE_REQUEST'
export const REMOVE_HOUSE_FINISHED = 'REMOVE_HOUSE_FINISHED'

import { PENDING, FINISHED } from 'redux/reducers/request'

export function FetchHousesList({ token }) {
  return ajaxRequest('/houses/', {}, token)
    .then(response => Promise.resolve(response))
    .catch(error => Promise.reject(error))
}

export function GetHouses({ token } = {}) {
  return (dispatch, getState) => {
    dispatch({ type: GET_HOUSES_REQUEST, status: PENDING })

    return FetchHousesList({ token: token || getState().authorization.token })
      .then(response => {
        dispatch({ type: USER_HOUSES, payload: response })
        dispatch({ type: GET_HOUSES_REQUEST, status: FINISHED })
        return Promise.resolve(response)
      })
      .catch(error => {
        dispatch({ type: ERROR, payload: { stage: 'houses-get', ...error }})
        dispatch({ type: GET_HOUSES_REQUEST, status: FINISHED })
        return Promise.reject(error)
      })
  }
}

export function NewHouse({ value }) {
  return (dispatch, getState) => {
    dispatch({ type: NEW_HOUSE_REQUEST })

    return ajaxRequest('/houses/', {
      method: 'POST',
      body: {
        name: value,
        in_home: false,
      },
    }, getState().authorization.token)
      .then(response => {
        dispatch({ type: NEW_HOUSE, payload: response })
        dispatch({ type: NEW_HOUSE_FINISHED })
        return Promise.resolve(response)
      })
      .catch(error => {
        dispatch({ type: ERROR, payload: { stage: 'reg-housename', ...error }})
        dispatch({ type: NEW_HOUSE_FINISHED })
        return Promise.reject(error)
      })
  }
}

export function RemoveHouse(id) {
  return (dispatch, getState) => {
    dispatch({ type: REMOVE_HOUSE_REQUEST })

    return ajaxRequest(`/houses/${id}/`, {
      method: 'DELETE',
      body: { id },
    }, getState().authorization.token)
      .then(response => {
        dispatch({ type: REMOVE_HOUSE, id })
        dispatch({ type: REMOVE_HOUSE_FINISHED })
        return Promise.resolve(response)
      })
      .catch(error => {
        dispatch({ type: ERROR, payload: { stage: 'house-remove', ...error }})
        dispatch({ type: REMOVE_HOUSE_FINISHED })
        return Promise.reject(error)
      })
  }
}
