import Frame from '../component/Frame'
import AvalonLogo from '../assets/avalon_logo.svg'
import Title from '../component/Title'
import Button from '../component/Button'
import { useForm, FormProvider } from 'react-hook-form'
import { InputText } from '../component/Input'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { origin } from '../config/setting'
import Background from '../component/Background'

const LoginFront = () => {
  const methods = useForm()
  const socketId = useSelector((state) => state.socket.socketId)
  const navigate = useNavigate()

  const onSubmit = (data, action) => {
    console.log(data)
    const username = data.PlayerName
    if (action === 'createRoom') {
      axios
        .post(`${origin}/setNickName`, {
          userID: socketId,
          userId: socketId,
          userName: username
        })
        .then(() => {
          navigate('/createRoom', { state: { username } })
        })
        .catch((error) => {
          alert(error.response.data)
          console.error('Error sending message:', error)
        })
    } else if (action === 'enterRoom') {
      axios
        .post(`${origin}/setNickName`, {
          userID: socketId,
          userId: socketId,
          userName: username
        })
        .then(() => {
          navigate('/joinRoom', { state: { username } })
        })
        .catch((error) => {
          alert(error.response.data)
          console.error('Error sending message:', error)
        })
    }
  }

  const handleCreateRoom = methods.handleSubmit((data) => onSubmit(data, 'createRoom'))
  const handleEnterRoom = methods.handleSubmit((data) => onSubmit(data, 'enterRoom'))

  return (
    <Background>
      <img src={AvalonLogo} alt="AvalonLogo" className="w-80" />
      <Frame className="text-White">
        <Title>輸入姓名</Title>
        <FormProvider {...methods}>
          <form>
            <InputText label="姓名" name="PlayerName" validation={{ required: { value: true, message: '此欄必填' } }} />
            <div className="flex flex-row gap-3 mt-4">
              <Button onClick={handleCreateRoom}>創建房間</Button>
              <Button onClick={handleEnterRoom}>進入房間</Button>
            </div>
          </form>
        </FormProvider>
      </Frame>
    </Background>
  )
}

export default LoginFront
