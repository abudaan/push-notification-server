import React, {PropTypes} from 'react'

const labelStyle = {
  width: '140px',
  height: '1.9em',
  display: 'inline-block',
  color: 'red'
}

const rangeStyle = {
  verticalAlign: 'middle',
  marginBottom: '5px',
  width: '200px'
}

/* React wrapper for input type Range */

const Slider = ({id, value, min, max, step = 1, label, classLabel, classRange, onMouseUp, onMouseDown, onChange}) => {

  function createLabel(){
    if(typeof label !== 'undefined'){
      label = label + '<em>' + value + '</em>'
    }else {
      label = value
    }
    return {__html: label}
  }

  let _labelStyle = labelStyle
  let _rangeStyle = rangeStyle

  if(typeof classLabel !== 'undefined'){
    // if a css class name is provide, don't use the default styling
    _labelStyle = {}
  }
  if(typeof classRange !== 'undefined'){
    _rangeStyle = {}
  }

  return (
    <div>
      <label className={classLabel} htmlFor={id} style={_labelStyle} dangerouslySetInnerHTML={createLabel()} />
      <input
        className={classRange}
        style={_rangeStyle}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        id={id}
        onChange={onChange}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
      />
    </div>
  )
}

Slider.propTypes = {
  classLabel: PropTypes.string,
  classRange: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  step: PropTypes.number,
  value: PropTypes.number.isRequired,
}

export default Slider
