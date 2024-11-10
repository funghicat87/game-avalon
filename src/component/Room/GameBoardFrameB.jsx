import Frame from '../Frame'
import Button from '../Button'
import VoteingAgree from '../../assets/gameboard/VoteingAgree.png'
import VoteingDisagree from '../../assets/gameboard/VoteingDisagree.png'
import TaskSuccessful from '../../assets/gameboard/TaskSuccessful.png'
import TaskFailed from '../../assets/gameboard/TaskFailed.png'
import { useDispatch } from 'react-redux'
import { gameActions } from '../../features/gameSlice'
import { useForm, FormProvider } from 'react-hook-form'

// eslint-disable-next-line react/prop-types
const GameBoardFrameB = ({ content, roomId, name, status, validation, isBlueSide = false }) => {
  const dispatch = useDispatch()
  const images = {
    Voteing: [VoteingAgree, VoteingDisagree],
    Task: [TaskSuccessful, TaskFailed]
  }

  const [image1, image2] = images[content] || [null, null]

  const handOnClicked = (result) => {
    if (status === 'VOTE') {
      handleAgreeForMission(result)
    }
    if (status === 'VOTEFORMISSION') {
      handleMissionResult(result)
    }
    dispatch(
      gameActions.setIsShow({
        isShow: false
      })
    )
  }

  const handleAgreeForMission = (result) => {
    console.log({ [name]: result })
    dispatch({
      type: 'sendGameStatus',
      payload: {
        gameType: 'VOTE',
        roomId: roomId,
        data: { [name]: result }
      }
    })
  }

  const handleMissionResult = (result) => {
    dispatch({
      type: 'sendGameStatus',
      payload: {
        gameType: 'VOTEFORMISSION',
        roomId: roomId,
        data: { [name]: result }
      }
    })
  }
  const methods = useForm()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = methods

  const onSubmit = (data) => {
    handOnClicked(Number(data.action))
  }

  return (
    <div className="absolute z-50 top-1/2 -translate-y-1/2">
      <Frame width="w-[600px]">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-center gap-3">
              {image1 && (
                <label htmlFor="image1">
                  <input
                    name="action"
                    type="radio"
                    className="peer appearance-none relative"
                    id="image1"
                    value={1}
                    {...register('action', validation)}
                    defaultChecked={isBlueSide}
                  />
                  <div
                    className={`w-30 h-30 borderGradientFrame border-[1.8px] bg-black peer-checked:drop-shadow-[0_0px_5px_White]`}
                  >
                    <img src={image1} alt="Option 1" className="w-full h-full" />
                  </div>
                </label>
              )}
              {image2 && (
                <label htmlFor="image2">
                  <input
                    name="action"
                    type="radio"
                    className="peer appearance-none relative"
                    id="image2"
                    value={0}
                    {...register('action', validation)}
                    disabled={isBlueSide}
                  />
                  <div
                    className={`w-30 h-30 borderGradientFrame border-[1.8px] bg-black peer-checked:drop-shadow-[0_0px_5px_White]`}
                  >
                    <img src={image2} alt="Option 2" className="w-full h-full" />
                  </div>
                </label>
              )}
            </div>
            {errors.action && <p className="text-red-600 text-sm mt-4 text-center">{errors.action.message}</p>}
            <Button mt="mt-3" type="submit">
              確認
            </Button>
          </form>
        </FormProvider>
      </Frame>
    </div>
  )
}

export default GameBoardFrameB
