import React from 'react'
import './style.css';

function Input({ label,state,setstate ,placeholder,type}) {
    return (
        <div className='input-wrapper'>
            <p className='label-input'>{label}</p>
            <input 
            type={type}
            value={state} 
            placeholder={placeholder}
            onChange={(e)=>setstate(e.target.value)} className='custom-input' 
            />
        </div>
    )
}

export default Input