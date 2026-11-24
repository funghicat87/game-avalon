/* eslint-disable react/prop-types */
import Frame from '../Frame'
import Title from '../Title'
import Button from '../Button'

const GameBoardFrameA = ({ title, content, onClick, errorMsg }) => {
  return (
    <div className="fixed inset-x-0 top-1/2 -translate-y-1/2 z-50 flex justify-center px-4 lg:absolute lg:inset-x-auto lg:px-0">
      <Frame width="w-full lg:w-[900px]">
        <Title mb="mb-2">{title}</Title>
        <div className="flex flex-wrap justify-center gap-3">
          {content.map((content, index) => (
            <img key={index} src={content} alt={`Image ${index + 1}`} className="w-14 h-14 md:w-20 md:h-20" />
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
