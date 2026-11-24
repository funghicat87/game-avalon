import { useEffect, useState } from 'react'
import Frame from '../component/Frame'
import BackButton from '../component/BackButton'
import Title from '../component/Title'
import Button from '../component/Button'
import { useForm, FormProvider } from 'react-hook-form'
import { InputText } from '../component/Input'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Background from '../component/Background'
import { post } from '../utils/api'

const JoinRoomFront = () => {
  const methods = useForm()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const username = location.state?.username
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch({ type: 'leaveRoom' })
  }, [dispatch])

  if (!username) return <Navigate to="/Login" replace />

  const handleJoinRoom = async (data) => {
    if (loading) return
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await post('/joinRoom', { roomId: data.RoomNumber.trim() })
      navigate(`/Room/${res.roomId}`, {
        state: { username, roomId: res.roomId, people: res.people, enableLady: res.enableLady }
      })
    } catch (error) {
      setErrorMsg(error.message)
    } finally {
      setLoading(false)
    }
  }

  const joinRoom = methods.handleSubmit(handleJoinRoom)

  return (
    <Background>
      <BackButton to="/Login" />
      <Frame className="text-White">
        <Title>加入房間</Title>
        <FormProvider {...methods}>
          <form onSubmit={joinRoom}>
            <InputText
              label="房間號碼"
              name="RoomNumber"
              inputMode="numeric"
              validation={{ required: { value: true, message: '此欄必填' } }}
            />
            {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}
            <div className="flex flex-row gap-3 mt-4">
              <Button type="submit" disabled={loading}>
                確認
              </Button>
            </div>
          </form>
        </FormProvider>
      </Frame>
    </Background>
  )
}

export default JoinRoomFront
