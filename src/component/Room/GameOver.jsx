import Button from '../Button'
import Frame from '../Frame'

const GameOver = ({ result, onClick }) => {
  return (
    <div className="absolute z-50 top-1/2 -translate-y-1/2">
      <Frame>
        <div className="flex flex-col h-96 items-center justify-center">
          {result ? (
            <div className="font-Bokor text-White text-9xl dropShadowWhite tracking-widest">Win</div>
          ) : (
            <div className="font-Bokor text-LightGray text-9xl tracking-widest">Lose</div>
          )}
          <div className="w-48">
            <Button onClick={onClick}>再來一局</Button>
          </div>
        </div>
      </Frame>
    </div>
  )
}

export default GameOver
