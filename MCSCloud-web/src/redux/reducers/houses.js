import update from 'immutability-helper'
import { cloneDeep, findIndex, merge, set } from 'lodash'

import {
  USER_HOUSES,
  NEW_HOUSE,
  REMOVE_HOUSE,
  CLEAR_HOUSES_LIST,
  UPDATE_HOUSES,
  CHANGE_HOUSE_SETTING,
  UPDATE_HOUSE_USERS_LIST,
  UPDATE_HOUSE_USER,
  UPDATE_DEVICES_LIST,
  UPDATE_DEVICE,
  UPDATE_DEVICE_SELF_TRAINING,
  UPDATE_DEVICE_SENSOR_TYPE,
  UPDATE_DEVICE_LIGHT_MODE,
  UPDATE_DEVICE_SETTING,
  UPDATE_DEVICE_CONFIGURATION,
  UPDATE_NETWORKS_LIST,
  UPDATE_NETWORK,
  ADD_NETWORK,
  REMOVE_NETWORK,
  REMOVE_USER_FROM_HOUSE,
  UPDATE_WORKDAYS,
  REMOVE_DEVICE,
  UPDATE_HOUSE_OVERALL_STATISTIC,
  UPDATE_DEVICE_STATISTIC,
  UPDATE_GROUP_STATISTIC,
  UPDATE_GROUPS,
  UPDATE_GROUP,
  ADD_GROUP,
  REMOVE_GROUP,
} from 'redux/actions'

import { transformDevicesConfig } from 'utils/common'
import { DEVICE_TYPES } from 'constants/devices'

const initialStates = {
  houses: [],
}

const actions = {
  [USER_HOUSES]: (state, action) =>
    action.payload.map(house => update(house, { $unset: ['users']})),
  [NEW_HOUSE]: (state, action) => update(state, { $push: [action.payload]}),
  [REMOVE_HOUSE]: (state, action) => {
    const index = findIndex(state, { id: action.id })

    return update(state, { $splice: [[index, 1]]})
  },
  [CLEAR_HOUSES_LIST]: () => initialStates.houses,
  [UPDATE_HOUSES]: (state, action) => {
    const { houses } = action

    return houses
    // if (!isEqual(state, action.houses)) {
    // const changed = []
    // return compact(state.map(house => {
    //   // const updatedHouse = find(action.houses, { id: house.id })
    //   return find(action.houses, { id: house.id })
    //   // if (!isEqual(house, updatedHouse) {
    //   //   const diffKeys = getObjectDiff(house, action.houses[index])
    //   //
    //   //   console.log('[Reducers/Houses] UPDATE_HOUSES - detect diffirence!!! at house', house.name, diffKeys)
    //   //   diffKeys.map(key => {
    //   //     console.log(key, '-', getObjectDiff(house[key] || [], action.houses[index][key] || []))
    //   //   })
    //   // }
    // }))
  },
  [CHANGE_HOUSE_SETTING]: (state, action) => {
    const { id, key, value } = action.payload
    const index = findIndex(state, { id })

    return update(state, {
      [index]: {
        [key]: { $set: value },
      },
    })
  },
  [UPDATE_HOUSE_USERS_LIST]: (state, action) => {
    const { id, users } = action
    const index = findIndex(state, { id })

    return update(state, {
      [index]: {
        users: { $set: users },
      },
    })
  },
  [UPDATE_HOUSE_USER]: (state, action) => {
    const { id, user } = action
    const index = findIndex(state, { id })
    const userIndex = findIndex(state[index].users, { email: user.email })

    return update(state, {
      [index]: {
        users: {
          [userIndex]: { $set: user },
        },
      },
    })
  },
  [UPDATE_WORKDAYS]: (state, action) => {
    const index = findIndex(state, { id: action.houseID })
    const newWorkdays = {
      ...state[index].workdays,
      ...action.payload,
    }

    return update(state, {
      [index]: {
        workdays: { $set: newWorkdays },
      },
    })
  },
  [REMOVE_USER_FROM_HOUSE]: (state, action) => {
    const index = findIndex(state, { id: action.houseID })
    const userIndex = findIndex(state[index].users, { id: action.userID })

    return update(state, {
      [index]: {
        users: { $splice: [[userIndex, 1]]},
      },
    })
  },
  [UPDATE_DEVICES_LIST]: (state, action) => {
    const { id, devices } = action
    const index = findIndex(state, { id })

    // NOTE: Remake under immutability-helper
    // const newDevices = devices.map(device => {
    //   const parsedConfig = JSON.parse(device.parsed_configuration)
    //
    //   return {
    //     ...device,
    //     parsed_configuration: isEmpty(parsedConfig) ? DEFAULT_CONFIG[device.type] : parsedConfig,
    //   }
    // })
    //
    return update(state, {
      [index]: {
        devices: { $set: transformDevicesConfig(devices) },
      },
    })
  },
  [UPDATE_DEVICE]: (state, action) => {
    const { deviceID, houseID, device } = action
    const index = findIndex(state, { id: houseID })
    const deviceIndex = findIndex(state[index].devices, { id: deviceID })
    // NOTE: Remake under immutability-helper
    const newDevice = {
      ...device,
      parsed_configuration: JSON.parse(device.parsed_configuration),
    }

    return update(state, {
      [index]: {
        devices: {
          [deviceIndex]: { $set: newDevice },
        },
      },
    })
  },
  [UPDATE_DEVICE_SETTING]: (state, action) => {
    const { deviceID, houseID, key, value } = action
    const index = findIndex(state, { id: houseID })
    const deviceIndex = findIndex(state[index].devices, { id: deviceID })

    return update(state, {
      [index]: {
        devices: {
          [deviceIndex]: {
            [key]: { $set: value },
          },
        },
      },
    })
  },
  [UPDATE_DEVICE_CONFIGURATION]: (state, action) => {
    const { deviceID, houseID, key, value } = action
    const index = findIndex(state, { id: houseID })
    const deviceIndex = findIndex(state[index].devices, { id: deviceID })
    const device = cloneDeep(state[index].devices[deviceIndex])

    set(device, key, value)

    return update(state, {
      [index]: {
        devices: {
          [deviceIndex]: { $set: device },
        },
      },
    })
  },
  [UPDATE_DEVICE_SELF_TRAINING]: (state, action) => {
    const { deviceID, houseID, mode, value } = action

    const index = findIndex(state, { id: houseID })
    const deviceIndex = findIndex(state[index].devices, { id: deviceID })

    let payload = null

    switch (state[index].devices[deviceIndex].type) {
      case DEVICE_TYPES.MCS300: {
        payload = {
          $set: value,
        }

        break
      }

      default: {
        payload = {
          [mode]: { $set: value },
        }
      }
    }

    return update(state, {
      [index]: {
        devices: {
          [deviceIndex]: {
            parsed_configuration: {
              settings: {
                self_training: payload,
              },
            },
          },
        },
      },
    })
  },
  [UPDATE_DEVICE_SENSOR_TYPE]: (state, action) => {
    const { deviceID, houseID, detector } = action

    const index = findIndex(state, { id: houseID })
    const deviceIndex = findIndex(state[index].devices, { id: deviceID })

    return update(state, {
      [index]: {
        devices: {
          [deviceIndex]: {
            parsed_configuration: {
              detector: { $set: detector },
            },
          },
        },
      },
    })
  },
  [UPDATE_DEVICE_LIGHT_MODE]: (state, action) => {
    const { deviceID, houseID, value } = action

    const index = findIndex(state, { id: houseID })
    const deviceIndex = findIndex(state[index].devices, { id: deviceID })

    return update(state, {
      [index]: {
        devices: {
          [deviceIndex]: {
            parsed_configuration: {
              settings: { light_mode: { $set: value }},
            },
          },
        },
      },
    })
  },
  [REMOVE_DEVICE]: (state, action) => {
    const index = findIndex(state, { id: action.houseID })
    const deviceIndex = findIndex(state[index].devices, { id: action.deviceID })

    return update(state, {
      [index]: {
        devices: { $splice: [[deviceIndex, 1]]},
      },
    })
  },
  [ADD_NETWORK]: (state, action) => {
    const index = findIndex(state, { id: action.houseID })
    const networks = state[index].networks || []

    return update(state, {
      [index]: {
        networks: { $set: [...networks, action.payload]},
      },
    })
  },
  [REMOVE_NETWORK]: (state, action) => {
    const index = findIndex(state, { id: action.houseID })
    const networkIndex = findIndex(state[index].networks, {
      id: action.networkId,
    })

    return update(state, {
      [index]: {
        networks: { $splice: [[networkIndex, 1]]},
      },
    })
  },
  [UPDATE_NETWORKS_LIST]: (state, action) => {
    const { id, networks } = action
    const index = findIndex(state, { id })

    return update(state, {
      [index]: {
        networks: { $set: networks },
      },
    })
  },
  [UPDATE_NETWORK]: (state, action) => {
    const { networkId, houseID, name, password } = action
    const index = findIndex(state, { id: houseID })
    const networkIndex = findIndex(state[index].networks, { id: networkId })

    const network = state[index].networks[networkIndex]
    const newNetwork = {
      ...network,
      name,
      password,
    }

    return update(state, {
      [index]: {
        networks: {
          [networkIndex]: { $set: newNetwork },
        },
      },
    })
  },
  [UPDATE_HOUSE_OVERALL_STATISTIC]: (state, action) => {
    const { houseID, data } = action

    const index = findIndex(state, { id: houseID })
    const statistics = merge(state[index].statistics || {}, data)

    return update(state, {
      [index]: {
        statistics: { $set: statistics },
      },
    })
  },
  [UPDATE_DEVICE_STATISTIC]: (state, action) => {
    const { houseID, deviceID, data } = action
    const index = findIndex(state, { id: houseID })
    const statistics = cloneDeep(state[index].statistics || {})

    statistics[deviceID] = data

    return update(state, {
      [index]: {
        statistics: { $set: statistics },
      },
    })
  },
  [UPDATE_GROUP_STATISTIC]: (state, action) => {
    const { houseID, groupID, data } = action
    const index = findIndex(state, { id: houseID })
    const groups = { [groupID]: { ...data }}

    const oldGroups = state[index].statistics.groups
      ? { ...state[index].statistics.groups }
      : null

    const newHouse = state[index]

    newHouse.statistics.groups = oldGroups
      ? { ...oldGroups, ...groups }
      : { ...groups }

    return state.map(house => {
      if (house.id === houseID) {
        return { ...newHouse }
      }
      return { ...house }
    })
  },
  [UPDATE_GROUPS]: (state, action) => {
    const { id, groups } = action
    const index = findIndex(state, { id })

    return update(state, {
      [index]: {
        groups: { $set: groups },
      },
    })
  },
  [UPDATE_GROUP]: (state, action) => {
    const { id, groupID, key, value } = action
    const index = findIndex(state, { id })
    const groupIndex = findIndex(state[index].groups, { id: groupID })

    return update(state, {
      [index]: {
        groups: {
          [groupIndex]: {
            [key]: { $set: value },
          },
        },
      },
    })
  },
  [REMOVE_GROUP]: (state, action) => {
    const index = findIndex(state, { id: action.houseID })
    const groupIndex = findIndex(state[index].groups, { id: action.groupID })

    return update(state, {
      [index]: {
        groups: { $splice: [[groupIndex, 1]]},
      },
    })
  },
  [ADD_GROUP]: (state, action) => {
    const { id, group } = action
    const index = findIndex(state, { id })

    return update(state, {
      [index]: {
        groups: { $push: [group]},
      },
    })
  },
  default: state => state,
}

export default function houses(state = initialStates.houses, action) {
  return (actions[action.type] || actions.default)(state, action)
}
