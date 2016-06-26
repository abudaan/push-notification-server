import React, {PropTypes} from 'react'

const ButtonSubscribe = ({onClick, label}) => {

  return (
    <button onClick={onClick}>
      {label}
    </button>
  )
}

ButtonSubscribe.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default ButtonSubscribe

