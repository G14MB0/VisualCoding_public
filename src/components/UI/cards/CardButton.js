import React from 'react'
import ButtonMain from '../buttons/ButtonMain'

export default function CardButton({ buttonOnClick, buttonText, title, message}) {
  return (
    <div className='grid grid-cols-3 h-24'>
      <div className='col-span-1'>
          <ButtonMain children={buttonText} onClick={buttonOnClick}/>
      </div>
        <div>
            <div className='font-bold'>
                {title}
            </div>
            <div>
                {message}
            </div>
        </div>
    </div>
  )
}
