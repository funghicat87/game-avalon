import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Frame from '../component/Frame'
import BackButton from '../component/BackButton'
import { SelectCharacter } from '../component/SelectCharacter'
import { InputCheckbox, InputNumberRadio, InputRadio, Label } from '../component/Input'
import { getDefaultRoleImg, RoleImageMappingTable, isBlueSide } from '../utils/MappingImage'
import Button from '../component/Button'
import Title from '../component/Title'
import { buildRoleImgPair } from '../utils/game'
import { SmallCard } from '../component/Room/Card'
import { RoleIntroduction } from '../utils/RoleIntroduction'
import { post } from '../utils/api'

const CreateRoomInput = ({ username, formData, onFormChange, customRoles, onOpenSelectCharacter }) => {
  const navigate = useNavigate()
  const methods = useForm({ defaultValues: formData })
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  // 表單變動時同步回父元件（切換到選角畫面再回來時才不會遺失）
  useEffect(() => {
    const subscription = methods.watch((value) => onFormChange(value))
    return () => subscription.unsubscribe()
  }, [methods, onFormChange])

  const playerNumber = Number(methods.watch('PlayerNumber'))
  const isCustomPool = methods.watch('CharacterPool') === 'Choose'

  // 自選角色只有在人數相符時才使用，否則用預設角色
  const roles = isCustomPool && customRoles?.length === playerNumber ? customRoles : getDefaultRoleImg(playerNumber)
  const roleBlue = roles.filter(isBlueSide)
  const roleRed = roles.filter((role) => !isBlueSide(role))

  const handleCreateRoom = async (data) => {
    if (loading) return
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await post('/createRoom', {
        password: '',
        people: Number(data.PlayerNumber),
        enableLady: data.LadyLake,
        roleImgPair: buildRoleImgPair(roles)
      })
      navigate(`/Room/${res.roomId}`, {
        state: { username, roomId: res.roomId, people: res.people, enableLady: res.enableLady }
      })
    } catch (error) {
      setErrorMsg(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = () => {
    if (isCustomPool) onOpenSelectCharacter()
  }

  const renderCards = (list) =>
    list.map((role, index) => (
      <SmallCard
        key={`${role}-${index}`}
        cardImg={RoleImageMappingTable[role]}
        className={`w-11 sm:w-14 cursor-pointer ${isCustomPool ? 'hover:opacity-80' : ''} `}
        onClick={handleCardClick}
        userName={RoleIntroduction[role].showName}
        Introduction={RoleIntroduction[role].Introduction}
      />
    ))

  return (
    <>
      <Title>創建房間</Title>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleCreateRoom)}>
          <div className="flex flex-col gap-8 md:gap-10">
            <InputNumberRadio
              label="玩家人數"
              name="PlayerNumber"
              validation={{ required: { value: true, message: '此欄必填' } }}
            />
            <InputCheckbox label="湖中女神" name="LadyLake" />
            <div>
              <Label name="CharacterPool">角色池</Label>
              <div className="flex flex-col gap-1">
                <InputRadio label="預設" id="Default" name="CharacterPool" value="Default" />
                <InputRadio label="自選" id="Choose" name="CharacterPool" value="Choose" />
              </div>
              {isCustomPool && <p className="text-sm text-LightGray mt-2">點擊卡片選擇角色，長按可查看角色介紹</p>}
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex flex-wrap gap-1">{renderCards(roleBlue)}</div>
                <div className="flex flex-wrap gap-1">{renderCards(roleRed)}</div>
              </div>
            </div>
          </div>
          {errorMsg && <p className="text-red-600 text-sm mt-4">{errorMsg}</p>}
          <div className="flex flex-row gap-3 mt-4">
            <Button type="submit" disabled={loading}>
              創建房間
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  )
}

const CreateRoomFront = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const username = location.state?.username
  const [isSelectingCharacter, setIsSelectingCharacter] = useState(false)
  const [customRoles, setCustomRoles] = useState(null)
  const [formData, setFormData] = useState({
    PlayerNumber: '5',
    CharacterPool: 'Default',
    LadyLake: false
  })

  useEffect(() => {
    dispatch({ type: 'leaveRoom' })
  }, [dispatch])

  const [handleFormChange] = useState(() => (newData) => setFormData((prev) => ({ ...prev, ...newData })))

  if (!username) return <Navigate to="/Login" replace />

  const handleSelectDone = (blue, red) => {
    if (blue && red) setCustomRoles([...blue, ...red])
    setIsSelectingCharacter(false)
  }

  return (
    <div className="background flex flex-col justify-center items-center gap-10">
      <BackButton to="/Login" />
      <Frame className="text-White">
        {isSelectingCharacter ? (
          <SelectCharacter playerNumber={Number(formData.PlayerNumber)} onClickButton={handleSelectDone} />
        ) : (
          <CreateRoomInput
            username={username}
            formData={formData}
            onFormChange={handleFormChange}
            customRoles={customRoles}
            onOpenSelectCharacter={() => setIsSelectingCharacter(true)}
          />
        )}
      </Frame>
    </div>
  )
}

export default CreateRoomFront
