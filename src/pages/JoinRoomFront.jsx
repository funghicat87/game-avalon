import Frame from '../component/Frame'
import Title from '../component/Title'
import Button from '../component/Button'
import { useForm, FormProvider } from 'react-hook-form'
import { InputText } from '../component/Input'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { origin } from '../config/setting'
import Background from '../component/Background'

const JoinRoomFront = () => {
  const methods = useForm()
  const socketId = useSelector((state) => state.socket.socketId)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // 檢查username是否為空
    if (location.state.username === '') {
      navigate('/Login')
    }
  }, [location.state.username, navigate])

  const handleJoinRoom = (data) => {
    const username = data.RoomNumber
    const password = 'username'
    axios
      .post(`${origin}/joinRoom`, {
        userID: socketId,
        userId: socketId,
        userName: location.state.username,
        roomId: username,
        password: password
      })
      .then((res) => {
        if (res.data.success) {
          navigate(`/Room/${username}`, {
            state: {
              username: location.state.username,
              roomId: username
            }
          })
        }
      })
      .catch((error) => {
        alert(error.response.data)
        console.log(error)
      })
  }

  const joinRoom = methods.handleSubmit((data) => handleJoinRoom(data))

  return (
    <Background>
      <Frame className="text-White">
        <Title>加入房間</Title>
        <FormProvider {...methods}>
          <form>
            <div className="flex flex-col gap-10">
              <InputText
                label="房間號碼"
                name="RoomNumber"
                validation={{ required: { value: true, message: '此欄必填' } }}
              />
              <InputText
                label="房間密碼"
                name="RoomPassword"
                validation={{ required: { value: true, message: '此欄必填' } }}
              />
            </div>
            <div className="flex flex-row gap-3 mt-4">
              <Button onClick={joinRoom}>確認</Button>
            </div>
          </form>
        </FormProvider>
      </Frame>
    </Background>
  )
}

export default JoinRoomFront
