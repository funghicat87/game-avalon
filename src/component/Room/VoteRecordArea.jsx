import React from 'react'
import VoteRecordOff from '../../assets/gameboard/VoteRecordOff.webp'
import VoteRecordOn from '../../assets/gameboard/VoteRecordOn.webp'

const VoteRecordArea = ({ records }) => {
  return (
    <div className="flex gap-4">
      {records.map((record, index) => (
        <img
          key={index}
          src={record ? VoteRecordOn : VoteRecordOff}
          alt={record ? 'VoteRecordOn' : 'VoteRecordOff'}
          className="w-12 h-12"
        />
      ))}
    </div>
  )
}

export default VoteRecordArea
