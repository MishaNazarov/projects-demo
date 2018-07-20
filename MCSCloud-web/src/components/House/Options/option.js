import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

import { Translate } from 'react-redux-i18n'

import arrowIcon from 'images/arrow.svg'

import styles from './styles.scss'
import classnames from 'classnames/bind'

const cx = classnames.bind(styles)

export default class Option extends Component {

  static propTypes = {
    index: PropTypes.number,
    option: PropTypes.object,
    onSelect: PropTypes.func,
    onPrompt: PropTypes.func,
    isActive: PropTypes.bool,
    disabled: PropTypes.bool,
  }

  render() {
    const { index, option, onSelect, onPrompt, isActive, disabled } = this.props

    if (typeof option.title === 'function') {
      const Title = option.title

      return (
        <div className={ cx('options-list__item modified_option') }>
          <Title disabled={ disabled } />
          { !!onPrompt && (
            <div>
              <ReactTooltip place="top" id="something">
                <Translate value="Подсказка" />
              </ReactTooltip>
              <span
                data-tip
                data-for="something"
                className={ cx('item-prompt') }
                onClick={ onPrompt }
              >
                ?
              </span>
            </div>
          ) }
        </div>
      )
    }

    return (
      <div
        onClick={ () => onSelect(option, index) }
        className={ cx('options-list__item') }
      >
        <Translate value={ `${option.title}.title` } />
        <img
          className={ cx('options-list__arrow', {
            'options-list__arrow-active': isActive,
          }) }
          src={ arrowIcon }
          alt=""
        />
      </div>
    )
  }

}
