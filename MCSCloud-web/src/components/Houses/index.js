import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { isEmpty } from 'lodash'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router'
import { setLocale } from 'react-redux-i18n'

import ContentContainer, { PanelsContainer, ContentPanel } from 'components/shared/ContentContainer'
import HousesList from './list'
import House from 'components/House'
import NewsFeed from 'components/NewsFeed'

import { GetHouseUsers } from 'redux/actions/house'
import { GetHouses } from 'redux/actions/houses'


class Houses extends Component {

  static propTypes = {
    houses: PropTypes.array,
    getHouses: PropTypes.func,
    getHouseUsers: PropTypes.func,
    SetLocale: PropTypes.func,
    locale: PropTypes.string,
  }

  componentWillMount() {
    const { houses, getHouses, locale, SetLocale, getHouseUsers } = this.props

    SetLocale(locale)

    if (isEmpty(houses)) {
      getHouses()
    }
    else {
      houses.map( house => {
        if (!house.hasOwnProperty('users')) {
          getHouseUsers(house)
        }
      })
    }
  }

  render() {
    return (
      <ContentContainer>
        <Switch>
          <Route
            exact
            path="/houses/:house_id([0-9]+)/:section(thermo|water)/:device_id([0-9]+)?/:option?"
            render={ ({ match }) => <House match={ match } defaultSidePanel={ NewsFeed }/> }
          />
          <Route
            exact
            path="/houses/:house_id([0-9]+)/:section(thermo)/groups/:group_id([0-9]+)/:device_id([0-9]+)?/:option?"
            render={ ({ match }) => <House match={ match } defaultSidePanel={ NewsFeed }/> }
          />
          <Route
            exact
            path="/houses/:house_id([0-9]+)/:section(settings)/:option?"
            render={ ({ match }) => <House match={ match } defaultSidePanel={ NewsFeed }/> }
          />
          <Route
            exact
            path="/houses"
            render={ () =>
              <PanelsContainer>
                <ContentPanel>
                  <HousesList />
                </ContentPanel>
                <ContentPanel>
                  <NewsFeed />
                </ContentPanel>
              </PanelsContainer>
            }
          />
          <Redirect to="/houses" />
        </Switch>
      </ContentContainer>
    )
  }

}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  SetLocale: setLocale,
  getHouses: GetHouses,
  getHouseUsers: GetHouseUsers,
}, dispatch)

export default connect(state => ({
  houses: state.houses,
  locale: state.auth.getIn(['user', 'attributes', 'profile', 'language']),
}), mapDispatchToProps)(Houses)
