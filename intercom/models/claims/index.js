import effects from './effects'

export default {
  state: {
    claims: [],
    filter: 'All'
  },
  reducers: {
    setClaims: (state, response) => ({ ...state, claims: response }),
    setFilter: (state, response) => ({ ...state, filter: response }),
  },
  effects
}
