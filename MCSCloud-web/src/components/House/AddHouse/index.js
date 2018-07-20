import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { push } from 'react-router-redux'

import styles from './styles.scss'
import classnames from 'classnames/bind'
const cx = classnames.bind(styles)

class AddHouse extends Component {

  static propTypes = {
    Push: PropTypes.func,
  }

  render() {
    return (
      <div
        className={ cx('new-house') }
      >
        <div className={ cx('add-house') } onClick={ () => this.props.Push('/new-house') }>
          <Translate
            className={ cx('link') }
            value='house.addNew'
          />
        </div>
      </div>
    )
  }

}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  Push: push,
}, dispatch)

export default connect(null, mapDispatchToProps)(AddHouse)
