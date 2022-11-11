import React from 'react'

const Options = ({value, value_id, name, setSelectedAnswer}) => {
  return (
    <div>
        <input onClick={setSelectedAnswer(value_id)} type="submit" name={name} value={value} className='p-2 m-4 border-2 border-black hover:bg-yellow-100 focus:bg-yellow-200 font-semibold w-60 min-w-min cursor-pointer rounded-3xl'/>
    </div>
  )
}

export default Options