/* eslint-disable react/prop-types */
import Frame from '../Frame'
import Title from '../Title'
import Button from '../Button'

// 手機 / 平板：放在版面流程中（不蓋住上方要點選的玩家卡片）
// 桌機：維持原本浮在遊戲板中央
const GameBoardFrameA = ({ title, content, onClick, errorMsg }) => {
  return (
    <div className="w-full flex justify-center mt-2 lg:mt-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:w-auto z-40">
      <Frame width="w-full lg:w-[900px]">
        <Title mb="mb-2">{title}</Title>
        <div className="flex flex-wrap justify-center gap-3 min-h-14 md:min-h-20">
          {content.map((src, index) => (
            <img key={index} src={src} alt="" className="w-14 h-14 md:w-20 md:h-20" />
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
