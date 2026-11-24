import VoteRecordOff from '../../assets/gameboard/VoteRecordOff.webp'
import VoteRecordOn from '../../assets/gameboard/VoteRecordOn.webp'

const VoteRecordArea = ({ records }) => {
  return (
    <div className="flex gap-2 lg:gap-4">
      {records.map((record, index) => (
        <img
          key={index}
          src={record ? VoteRecordOn : VoteRecordOff}
          alt={record ? 'VoteRecordOn' : 'VoteRecordOff'}
          className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
        />
      ))}
    </div>
  )
}

export default VoteRecordArea
