import Button from '../Button'
import Frame from '../Frame'

const GameOver = ({ result, winner, onClick }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-Black/60 lg:absolute lg:inset-auto lg:bg-transparent lg:px-0">
      <Frame>
        <div className="flex flex-col h-72 md:h-96 items-center justify-center">
          {result ? (
            <div className="font-Bokor text-White text-7xl md:text-9xl dropShadowWhite tracking-widest">Win</div>
          ) : (
            <div className="font-Bokor text-LightGray text-7xl md:text-9xl tracking-widest">Lose</div>
          )}
          <p className="text-LightGray tracking-widest mt-2">{winner === 'GOOD' ? '正義方獲勝' : '邪惡方獲勝'}</p>
          <div className="w-48">
            <Button onClick={onClick}>回到房間</Button>
          </div>
        </div>
      </Frame>
    </div>
  )
}

export default GameOver
