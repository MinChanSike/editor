import React from 'react'
import Color from 'color'
import ChromePicker from 'react-color/lib/components/chrome/Chrome'
import PropTypes from 'prop-types'

function formatColor(color) {
  const rgb = color.rgb
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`
}

/*** Number fields with support for min, max and units and documentation*/
class ColorField extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    doc: PropTypes.string,
    style: PropTypes.object,
    default: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = {
      pickerOpened: false,
    }
  }

  //TODO: I much rather would do this with absolute positioning
  //but I am too stupid to get it to work together with fixed position
  //and scrollbars so I have to fallback to JavaScript
  calcPickerOffset() {
    const elem = this.colorInput
    if(elem) {
      const pos = elem.getBoundingClientRect()
      return {
        top: pos.top,
        left: pos.left + 196,
      }
    } else {
      return {
        top: 160,
        left: 555,
      }
    }
  }

  togglePicker() {
    this.setState({ pickerOpened: !this.state.pickerOpened })
  }

  get color() {
    return Color(this.props.value || '#fff').rgb()
  }

  render() {
    const offset = this.calcPickerOffset()
    var currentColor = this.color.object()
    currentColor = {
      r: currentColor.r,
      g: currentColor.g,
      b: currentColor.b,
      // Rename alpha -> a for ChromePicker
      a: currentColor.alpha
    }

    const picker = <div
      className="maputnik-color-picker-offset"
      style={{
	      position: 'fixed',
	      zIndex: 1,
        left: offset.left,
        top: offset.top,
      }}>
      <ChromePicker
        color={currentColor}
        onChange={c => this.props.onChange(formatColor(c))}
      />
      <div
        className="maputnik-color-picker-offset"
        onClick={this.togglePicker.bind(this)}
        style={{
          zIndex: -1,
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        }}
      />
    </div>

    var swatchStyle = {
      backgroundColor: this.props.value
    };

    return <div className="maputnik-color-wrapper">
      {this.state.pickerOpened && picker}
      <div className="maputnik-color-swatch" style={swatchStyle}></div>
      <input
        className="maputnik-color"
        ref={(input) => this.colorInput = input}
        onClick={this.togglePicker.bind(this)}
        style={this.props.style}
        name={this.props.name}
        placeholder={this.props.default}
        value={this.props.value ? this.props.value : ""}
        onChange={(e) => this.props.onChange(e.target.value)}
      />
    </div>
  }
}

export default ColorField
