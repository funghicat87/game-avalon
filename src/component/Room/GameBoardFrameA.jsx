/* eslint-disable react/prop-types */
import Frame from '../Frame'
import Title from '../Title'
import Button from '../Button'

const GameBoardFrameA = ({ title, content, onClick, errorMsg }) => {
  return (
    <div className="absolute z-50 top-1/2 -translate-y-1/2">
      <Frame width="w-[900px]">
        <Title mb="mb-2">{title}</Title>
        <div className="flex justify-center gap-3">
          {content.map((content, index) => (
            <img key={index} src={content} alt={`Image ${index + 1}`} className="w-20 h-20" />
          ))}
        </div>
        {errorMsg && <p className="text-red-500 text-center mt-2">{errorMsg}</p>}
        <Button mt="mt-3" onClick={onClick}>
          確認
        </Button>
      </Frame>
    </div>
  )
}

export default GameBoardFrameA
