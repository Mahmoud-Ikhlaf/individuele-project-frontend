import React from 'react'

const ColorButton = ({ color, onClick, text }) => {
    const buttonStyle = {
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: color,
        color: "white",
        fontSize: '25px'
      };
  return (
    <div className=' h-1/2 md:h-1/2'>
      <button className='w-full h-full' style={buttonStyle} onClick={onClick}>{text}</button>
    </div>
  )
}

export default ColorButton