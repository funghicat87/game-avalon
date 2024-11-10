import React from 'react'

const Background = ({ children }) => {
  return (
    <div className="background flex flex-col justify-center items-center gap-5 font-ZenOldMincho -z-50 ">{children}</div>
  )
}

export default Background
