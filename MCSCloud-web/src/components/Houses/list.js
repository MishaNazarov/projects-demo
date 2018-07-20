import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { findIndex } from 'lodash'

import HouseSettings from 'components/House/Settings'
import AddHouse from 'components/House/AddHouse'
import Accordion from 'components/shared/Accordion'

import { RemoveHouse } from 'redux/actions/houses'
import { ChangeSetting } from 'redux/actions/house'

import styles from './styles.scss'

import classnames from 'classnames/bind'
const cx = classnames.bind(styles)

class HousesList extends Component {

  static propTypes = {
    houses: PropTypes.array,
    // match: PropTypes.object,
    selectedHouseID: PropTypes.number,
    onSelectOption: PropTypes.func,
    selectedOption: PropTypes.string,
    dispatch: PropTypes.func,
  }

  onTogglePresence = id => {
    const { houses, dispatch } = this.props

    houses.map(house => {
      if (id === house.id) {
        dispatch(ChangeSetting({ id: house.id, key: 'in_home', value: !house.in_home }))
      }
    })
  }

  removeHouse = (id) => {
    const {
      dispatch,
    } = this.props

    dispatch(RemoveHouse(id)).then(() => {
      // TODO double push
      dispatch(push('/houses'))
      dispatch(push('/houses'))
    })
  }

  render() {
    const {
      houses = [],
      selectedOption,
      selectedHouseID,
      onSelectOption,
      dispatch,
    } = this.props

    const initiallyOpen = findIndex(houses, { id: selectedHouseID })

    return (
      <div className={ cx('houses-list__wrapper') }>
        <Accordion
          className={ cx('houses-list') }
          initiallyOpen={ initiallyOpen }
          onChangeExpanded={ index => dispatch(push(`/houses${ index !== null && index !== false ? `/${houses[index].id}/settings` : ''}`)) }
        >
          {
            houses.map(house => {
              return (
                <HouseSettings
                  key={ house.id }
                  house={ house }
                  active={ selectedOption }
                  removeHouse={ () => this.removeHouse(house.id) }
                  onSelectOption={ onSelectOption }
                  onOpenDevices={ () => dispatch(push(`/houses/${house.id}/thermo`)) }
                  onTogglePresence={ () => this.onTogglePresence(house.id) }
                />
              )
            })
          }
        </Accordion>
        <AddHouse />
      </div>
    )
  }

}

export default connect(state => ({ houses: state.houses }))(HousesList)
