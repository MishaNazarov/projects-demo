import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Redirect, Route, Switch, withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { UPDATE_AUTH_TOKEN, GetUserInfo, SyncWithNodeBackend } from 'redux/actions'

import Navigation from 'components/Navigation'
import Authentication from 'components/Authentication'
import Registration from 'components/Registration'
import ResetPassword from 'components/ResetPassword'
import Help from 'components/Help'
import Houses from 'components/Houses'
import Spinner from 'components/shared/Spinner'

import { uniStorage } from 'utils/common'

import 'normalize.css'
import 'styles/bootstrap.css'
import 'styles/react-select.override.scss'
import 'styles/common.scss'
import 'styles/icons.scss'

import LongPoolUpdate from 'redux/actions/long-pool'

import { LIVE_RELOAD_INTERVAL } from 'constants/common'

import styles from './styles.scss'

import classnames from 'classnames/bind'
const cx = classnames.bind(styles)

const protectedRoute = ({ component: Component, authorization, location, ...rest }) => {
  const { isAuthenticated = false } = authorization

  return (
    <Route
      { ...rest }
      render={ props => {
        return isAuthenticated ? <Component { ...props }/> : <Redirect to={{ pathname: '/login', previous: location }}/>
      }
      }
    />
  )
}

protectedRoute.propTypes = {
  component: PropTypes.func,
  location: PropTypes.object,
  authorization: PropTypes.object,
}

protectedRoute.defaultProps = {
  authorization: {},
}

const ProtectedRoute = connect(state => ({
  authorization: state.authorization,
}))(protectedRoute)

const ALONE_CONTENT_ROUTES = ['/login', '/registration', '/reset-password', '/new-house']

class Applications extends Component {

  static propTypes = {
    authorization: PropTypes.object,
    user: PropTypes.object,
    router: PropTypes.object,
    longPoolUpdate: PropTypes.func,
    dispatch: PropTypes.func,
    spinner: PropTypes.object,
  }

  state = {
    liveReloading: false,
  }

  componentDidMount() {
    const { authorization, user, dispatch } = this.props
    const { isAuthenticated } = authorization

    if (!isAuthenticated) {
      const token = uniStorage.getItem('authToken')

      if (token) {
        dispatch({ type: UPDATE_AUTH_TOKEN, token })
        dispatch(SyncWithNodeBackend({ token }))
        dispatch(GetUserInfo({ token }))
        this._liveReload = setTimeout(this.liveReload, LIVE_RELOAD_INTERVAL)
      }
    }
    else if (!user) {
      dispatch(GetUserInfo({ token: authorization.token }))
    }
  }

  componentWillReceiveProps({ authorization }) {
    const { isAuthenticated = false } = authorization

    if (isAuthenticated && this._liveReload === undefined) {
      this._liveReload = setTimeout(this.liveReload, LIVE_RELOAD_INTERVAL)
    }
  }

  componentWillUnmount() {
    if (this._liveReload) {
      clearTimeout(this._liveReload)
    }
  }

  liveReload = (force = false) => {
    const { longPoolUpdate } = this.props

    if (force && this._liveReload !== undefined) {
      clearTimeout(this._liveReload)
    }

    this.setState({ liveReloading: true })
    longPoolUpdate().then(() => {
      this.setState({ liveReloading: false })
      this._liveReload = setTimeout(this.liveReload, LIVE_RELOAD_INTERVAL)
    })
  }

  NotFound = ({ location, history /* , ...rest */}) => {
    return (
      <div className={ cx('container', 'not-found') }>
        <h1>Oops! No match for <code>{ location.pathname }</code></h1>
        <button onClick={ () => history.goBack() }>Click here to return to previous page</button>
      </div>
    )
  }

  render() {
    const {
      authorization,
      router,
      spinner,
    } = this.props

    const { isAuthenticated } = authorization
    const { liveReloading } = this.state

    const aloneContent = !isAuthenticated || ALONE_CONTENT_ROUTES.indexOf(router.location.pathname) !== -1

    return (
      <div className={ cx('application', { 'app-spinner': spinner.shown } ) }>
        { !aloneContent &&
          <Navigation
            liveReloading={ liveReloading }
            forceReload={ () => !liveReloading && this.liveReload(true) }
          />
        }
        <Switch>
          <Route exact path="/" render={ () => <Redirect to="/houses" /> } />
          <Route exact path="/login" component={ Authentication } />
          <Route exact path="/logout" component={ Authentication } />
          <Route exact path="/registration" component={ Registration } />
          <Route exact path="/reset-password" component={ ResetPassword } />
          <Route exact path="/help" component={ Help } />
          <ProtectedRoute exact path="/new-house" component={ () => <Registration initialStage="createHouse" /> } />
          <ProtectedRoute path="/houses" component={ Houses } />
          <Route component={ this.NotFound } />
        </Switch>
        { spinner.shown ?
          <Spinner /> : null
        }
      </div>
    )
  }

}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  longPoolUpdate: LongPoolUpdate,
}, dispatch)

export default withRouter(connect(state => ({
  router: state.router,
  authorization: state.authorization,
  user: state.auth ? state.auth.getIn(['user']) : null,
  spinner: state.spinner,
}), mapDispatchToProps)(Applications))
