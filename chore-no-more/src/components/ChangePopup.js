import React from 'react'
import './Popup.css'

function ChangePopup(props) {
  return (props.trigger) ? (
    <div className='popup'>
        <div className='popup-inner'>
            <button className='close-btn' onClick={() => props.setTrigger(false)}>Close</button>
            { props.children }
        </div>
    </div>
  ) : '';
}

export default ChangePopup