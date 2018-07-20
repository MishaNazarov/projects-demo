import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { find, isEmpty, compact } from 'lodash'
import moment from 'moment'

import { bindActionCreators } from 'redux'
import { Redirect, Route } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import {
  PanelsContainer,
  ContentPanel,
} from 'components/shared/ContentContainer'
import DevicesNavPanel from './DevicesNavPanel'
import HousesList from 'components/Houses/list'
import Thermo from './Thermo'
import Water from './Water'

import { GetHouseUsers } from 'redux/actions/house'
import { GetNetworks } from 'redux/actions/networks'
import { GetDevices } from 'redux/actions/devices'
import { GetGroups } from 'redux/actions/groups'
import { GetHouseOverallStatistic } from 'redux/actions/statistic'

import houseOptions from 'components/House/Settings/options'
import thermoOptions from 'components/House/Thermo/Settings/options'
import thermoGroupOptions from 'components/House/Thermo/Settings/group-options'
import thermoGroupDeviceOptions from 'components/House/Thermo/Settings/grouped-device-options'
import waterOptions from 'components/House/Water/Settings/options'

import WaterStatistic from 'components/House/Water/Settings/Statistics'

import { DEVICE_TYPES } from 'constants/devices'
import { GROUP_OPTIONS } from 'constants/groups'
import { isAllowManage } from 'utils/common'

import { atoi } from 'utils/common'

import './styles.scss'

const sections = {
  settings: {
    renderer: HousesList,
    default: 'statistics',
    options: houseOptions,
  },
  thermo: {
    renderer: Thermo,
    default: 'statistics',
    options: thermoOptions,
    groupOptions: thermoGroupOptions,
    groupDeviceOptions: thermoGroupDeviceOptions,
  },
  water: {
    renderer: Water,
    default: WaterStatistic,
    options: waterOptions,
  },
}

class House extends Component {

  static propTypes = {
    houses: PropTypes.array,
    defaultSidePanel: PropTypes.func.isRequired,
    match: PropTypes.object,
    loggedInUser: PropTypes.string,
    getHouseUsers: PropTypes.func.isRequired,
    getNetworks: PropTypes.func.isRequired,
    getDevices: PropTypes.func.isRequired,
    getGroups: PropTypes.func.isRequired,
    getHouseOverallStatistic: PropTypes.func.isRequired,
    pushRoute: PropTypes.func.isRequired,
  }

  state = {
    fetchingData: false,
    fetchingStatistic: false,
  }

  componentWillMount() {
    this.fetchData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (process.env.BROWSER) {
      this.fetchData(nextProps)
    }
  }

  fetchData = props => {
    const {
      getHouseUsers,
      getDevices,
      getGroups,
      getNetworks,
      getHouseOverallStatistic,
    } = this.props
    const { match, houses } = props
    const id = atoi(match.params.house_id)

    if (
      !isEmpty(houses) &&
      id !== undefined &&
      !this.state.fetchingData &&
      process.env.BROWSER
    ) {
      const house = find(houses, { id }) || {}
      const fetching = []

      if (!isEmpty(house)) {
        if (!house.hasOwnProperty('groups')) {
          fetching.push(getGroups({ id }))
        }

        if (!house.hasOwnProperty('devices')) {
          fetching.push(getDevices({ id }))
        }

        if (!house.hasOwnProperty('networks')) {
          fetching.push(getNetworks({ id }))
        }

        if (!house.hasOwnProperty('users')) {
          fetching.push(getHouseUsers({ id }))
        }

        if (!house.hasOwnProperty('statistics')) {
          fetching.push(
            getHouseOverallStatistic({
              houseID: id,
              from: moment().subtract(7, 'days'),
              to: moment().add(1, 'days'),
            })
          )
        }
      }
    }
  }
  onSelectOption = option => {
    const { pushRoute, match, houses } = this.props
    const { house_id: houseID, section, group_id: groupID } = match.params
    let { device_id: deviceID } = match.params

    const grouping = groupID !== undefined && `groups/${groupID}` || ''

    if (deviceID === undefined && !groupID && section !== 'settings') {
      const house = find(houses, { id: atoi(houseID) }) || {}

      deviceID = (
        find(house.devices, device => {
          return section === 'water'
            ? device.type === DEVICE_TYPES.Neptun ||
                device.type === DEVICE_TYPES.EquationProWiFi
            : device.type === DEVICE_TYPES.MCS300 ||
                device.type === DEVICE_TYPES.MCS350 ||
                device.type === DEVICE_TYPES.OKElectro
        }) || {}
      ).id
    }

    const optionPath =
      grouping || deviceID || section === 'settings' ? option.key : null
    const params = compact([
      houseID,
      section,
      grouping,
      deviceID,
      optionPath,
    ]).join('/')
    const route = `/houses/${params}`

    pushRoute(route)
  }

  matchRenderer = ({ section, group_id: groupID, option }) => {
    if (!section || !sections[section]) {
      return undefined
    }

    // const optionKey = groupID === undefined ? 'options' : 'groupOptions'
    let optionKey

    if (groupID === undefined) {
      optionKey = 'options'
    }
    else {
      if (GROUP_OPTIONS.indexOf(option) !== -1) {
        optionKey = 'groupOptions'
      }
      else {
        optionKey = 'groupDeviceOptions'
      }
    }

    let result = find(sections[section][optionKey], { key: option })

    if (!result && sections[section].default) {
      result =
        typeof sections[section].default === 'function'
          ? { renderer: sections[section].default }
          : find(sections[section].options, { key: sections[section].default })
    }

    return (result || {}).renderer
  }

  compilePath = params => {
    const { section, group_id: groupID } = params
    const grouping =
      groupID !== undefined && '/groups/:group_id([0-9]+)' || ''
    const devices = section !== 'settings' && '/:device_id([0-9]+)?' || ''

    return `/houses/:house_id([0-9]+)/:section(settings|thermo|water)${grouping}${devices}/:option?`
  }

  render() {
    const { houses, match, defaultSidePanel, loggedInUser } = this.props

    const {
      house_id: houseId,
      section,
      device_id: deviceId,
      group_id: groupId,
    } = match.params

    if (isEmpty(houses)) {
      // TODO: remove this crutch
      return null
    }

    const houseID = atoi(houseId)
    const house = find(houses, { id: houseID }) || {}

    if (isEmpty(house)) {
      // TODO: remove this crutch
      return <Redirect to="/houses" />
    }

    const groupID = atoi(groupId)
    const group =
      house && groupID && find(house.groups, { id: groupID }) || {}
    const deviceID = atoi(deviceId)
    const device =
      house && deviceID && find(house.devices, { id: deviceID }) || {}

    const { option = sections[section].default } = match.params
    const LeftPanel = (sections[section] || sections.settings).renderer
    const RightPanel = this.matchRenderer(match.params) || defaultSidePanel
    const showDevicesNavPanel = section !== 'settings'
    const path = this.compilePath(match.params)

    const allowManage = isAllowManage(house, loggedInUser)

    return (
      <PanelsContainer>
        { showDevicesNavPanel && <DevicesNavPanel houseID={ houseID } /> }
        <Route
          exact
          path={ path }
          render={ ({ match }) => (
            <ContentPanel
              mezzanine={ showDevicesNavPanel && 50 || 0 }
              classNameInner="house-content-panel"
            >
              <LeftPanel
                selectedHouseID={ houseID }
                house={ house }
                device={ device }
                match={ match }
                onSelectOption={ this.onSelectOption }
                selectedOption={ option }
                disabled={ !allowManage }
              />
            </ContentPanel>
          ) }
        />
        <ContentPanel
          mezzanine={ showDevicesNavPanel && 50 || 0 }
          classNameInner="house-content-panel"
        >
          <RightPanel
            house={ house }
            group={ group }
            device={ device }
            disabled={ !allowManage }
          />
        </ContentPanel>
      </PanelsContainer>
    )
  }

}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getHouseUsers: GetHouseUsers,
      getNetworks: GetNetworks,
      getDevices: GetDevices,
      getGroups: GetGroups,
      // getDeviceStatistic: GetDeviceStatistic,
      getHouseOverallStatistic: GetHouseOverallStatistic,
      pushRoute: push,
    },
    dispatch
  )

export default connect(
  state => ({
    houses: state.houses,
    loggedInUser: state.auth
      ? state.auth.getIn(['user', 'attributes', 'email'])
      : undefined,
  }),
  mapDispatchToProps
)(House)
