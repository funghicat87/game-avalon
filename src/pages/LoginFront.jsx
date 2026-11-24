import { useEffect, useState } from 'react'
import Frame from '../component/Frame'
import BackButton from '../component/BackButton'
import AvalonLogo from '../assets/avalon_logo.svg'
import Title from '../component/Title'
import Button from '../component/Button'
import { useForm, FormProvider } from 'react-hook-form'
import { InputText } from '../component/Input'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Background from '../component/Background'
import { post } from '../utils/api'

const LoginFront = () => {
  const methods = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  // 回到登入頁代表離開原本的房間
  useEffect(() => {
    dispatch({ type: 'leaveRoom' })
  }, [dispatch])

  const onSubmit = async (data, path) => {
    if (loading) return
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await post('/setNickName', { userName: data.PlayerName })
      navigate(path, { state: { username: res.userName } })
    } catch (error) {
      setErrorMsg(error.message)
    } finally {
      setLoading(false)
    }
  }

  const validation = {
    required: { value: true, message: '此欄必填' },
    maxLength: { value: 12, message: '最多 12 個字' },
    validate: (v) => v.trim() !== '' || '此欄必填'
  }

  return (
    <Background>
      <BackButton to="/">首頁</BackButton>
      <img src={AvalonLogo} alt="AvalonLogo" className="w-60 md:w-80" />
      <Frame className="text-White">
        <Title>輸入姓名</Title>
        <FormProvider {...methods}>
          <form onSubmit={(e) => e.preventDefault()}>
            <InputText label="姓名" name="PlayerName" validation={validation} />
            {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}
            <div className="flex flex-row gap-3 mt-4">
              <Button onClick={methods.handleSubmit((data) => onSubmit(data, '/CreateRoom'))} disabled={loading}>
                創建房間
              </Button>
              <Button onClick={methods.handleSubmit((data) => onSubmit(data, '/JoinRoom'))} disabled={loading}>
                進入房間
              </Button>
            </div>
          </form>
        </FormProvider>
      </Frame>
    </Background>
  )
}

export default LoginFront
