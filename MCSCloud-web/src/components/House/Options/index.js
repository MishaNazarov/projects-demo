import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { I18n } from 'react-redux-i18n'

import { noop } from 'lodash'

import { Collapse } from 'reactstrap'

import Modal from 'components/shared/Modal'
import LightModePrompt from 'components/House/LightModePrompt'

import Option from './option'
import { DEVICE_TYPES } from 'constants/devices'

import styles from './styles.scss'
import classnames from 'classnames/bind'
const cx = classnames.bind(styles)

export class OptionsList extends Component {

  static propTypes = {
    options: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
          renderer: PropTypes.func,
        })
      ),
    ]),
    deviceType: PropTypes.number,
    expanded: PropTypes.bool,
    onSelect: PropTypes.func,
    // onToggleExpand: PropTypes.func,
    onChangeExpanded: PropTypes.func,
    children: PropTypes.node,
    active: PropTypes.string,
    disabled: PropTypes.bool,
  }

  state = {
    modal: false,
  }

  handleSelectSetting = (setting, index) => {
    this.props.onSelect(index !== null && setting)
  }

  render() {
    const {
      options,
      deviceType,
      expanded,
      onChangeExpanded,
      children,
      active,
      disabled,
    } = this.props

    return (
      <Collapse
        isOpen={ expanded }
        className={ cx('options-list') }
        onOpened={ onChangeExpanded }
        onClosed={ onChangeExpanded }
      >
        { options.map((option, index) => {
          if (option && option.key === 'light-mode') {
            if (deviceType === DEVICE_TYPES.OKElectro) {
              return (
                <div key={ `option-${option.title}` }>
                  <Option
                    index={ index }
                    option={ option }
                    onSelect={ this.handleSelectSetting }
                    isActive={ option.key === active }
                    disabled={ disabled }
                    onPrompt={ () => this.setState({ modal: true }) }
                  />
                  { this.state.modal && (
                    <Modal
                      title={ I18n.t('group.modal.lightMode') }
                      onCancel={ () => this.setState({ modal: false }) }
                      footerExist={ false }
                    >
                      <LightModePrompt />
                    </Modal>
                  ) }
                </div>
              )
            }
          }
          else {
            return option ? (
              <Option
                key={ `option-${option.title}` }
                index={ index }
                option={ option }
                onSelect={ this.handleSelectSetting }
                isActive={ option.key === active }
                disabled={ disabled }
              />
            ) : (
              <div
                key={ `separator-${index}` }
                className={ cx('options-list__separator') }
              />
            )
          }
        }) }
        { children }
      </Collapse>
    )
  }

}

export class OptionsPanelHeader extends Component {

  static propTypes = {
    onClick: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.node,
  }

  static defaultProps = {
    onClick: noop,
  }

  render() {
    const { onClick, className, children } = this.props

    return (
      <div className={ cx('options-panel__header', className) } onClick={ onClick }>
        { children }
      </div>
    )
  }

}

export default class OptionsPanel extends Component {

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
  }

  render() {
    const { className, children } = this.props

    return <div className={ cx('options-panel', className) }>{ children }</div>
  }

}
