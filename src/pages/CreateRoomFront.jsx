import Frame from '../component/Frame'
import { SelectCharacter } from '../component/SelectCharacter'
import { useState, useEffect } from 'react'
import { InputCheckbox, InputNumberRadio, InputRadio, Label } from '../component/Input'
import { getDefaultRoleImg, RoleImageMappingTable, isBlueSide } from '../utils/MappingImage'
import axios from 'axios'
import { FormProvider, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../component/Button'
import Title from '../component/Title'
import { origin } from '../config/setting'
import { getRoleImgPair } from '../utils/game'
import { SmallCard } from '../component/Room/Card'
import { RoleIntroduction } from '../utils/RoleIntroduction'

const CreateRoomInput = ({ onCardClick, characterBlue, characterRed, formData, onFormChange }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const methods = useForm({
    defaultValues: formData
  })
  useEffect(() => {
    const subscription = methods.watch((value) => {
      onFormChange(value) // 更新父組件中的狀態
    })

    return () => subscription.unsubscribe()
  }, [methods, onFormChange])
  const socketId = useSelector((state) => state.socket.socketId)

  //控制角色圖渲染
  const [roleBlue, setRoleBlue] = useState([])
  const [roleRed, setRoleRed] = useState([])
  const initialCharacterPool = methods.getValues().CharacterPool
  useEffect(() => {
    const newRoleBlue = []
    const newRoleRed = []
    getDefaultRoleImg(Number(methods.getValues().PlayerNumber)).forEach((card) => {
      if (isBlueSide(card)) {
        newRoleBlue.push(card)
      } else {
        newRoleRed.push(card)
      }
    })
    setRoleBlue(newRoleBlue)
    setRoleRed(newRoleRed)
  }, [methods.getValues().PlayerNumber, initialCharacterPool])

  useEffect(() => {
    if (characterBlue) {
      setRoleBlue(characterBlue)
      setRoleRed(characterRed)
    }
  }, [characterBlue, characterRed])

  // 檢查用戶名是否為空,如果為空則導航到登錄頁面
  useEffect(() => {
    // 檢查username是否為空s
    if (location.state.username === '' || location.state.username === null) {
      navigate('/Login')
    }
  }, [location.state?.username, navigate])

  //傳遞資料到CreateRoom.SelectCharacter
  useEffect(() => {
    const subscription = methods.watch(() => {
      navigate('/CreateRoom', {
        state: { formData: methods.getValues() }
      })
    })

    // 清理效果，取消訂閱 watch
    return () => subscription.unsubscribe()
  }, [methods, navigate])

  // 處理創建房間的邏輯
  const handleCreateRoom = (data) => {
    const people = data.PlayerNumber
    const enableLady = data.LadyLake
    const characterPool = data.CharacterPool
    axios
      .post(`${origin}/createRoom`, {
        userID: socketId,
        userId: socketId,
        userName: location.state.username,
        password: 'username',
        people: people,
        enableLady: enableLady,
        roleImgPair: getRoleImgPair(people)
      })
      .then((res) => {
        if (res.data.success) {
          navigate(`/Room/${socketId}`, {
            state: {
              username: location.state.username,
              roomId: socketId,
              people: people,
              enableLady: enableLady,
              characterPool: characterPool
            }
          })
          localStorage.clear()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const createRoom = methods.handleSubmit((data) => handleCreateRoom(data))

  //控制自選按鈕
  const [isCustomPool, setIsCustomPool] = useState(false) // 控制是否使用自選角色池

  useEffect(() => {
    const currentCharacterPool = methods.getValues().CharacterPool
    setIsCustomPool(currentCharacterPool === 'Choose')
  }, [methods, location.state?.selectedCharacters])

  const handleCharacterPoolChange = (event) => {
    setIsCustomPool(event.target.value === 'Choose')
  }
  const handleCardClick = () => {
    if (isCustomPool) {
      onCardClick()
    }
  }

  const [isCardEnlarged, setIsCardEnlarged] = useState(false)
  const handleEnlargedChange = (enlarged) => {
    setIsCardEnlarged(enlarged)
  }

  return (
    <>
      <Title>創建房間</Title>
      <FormProvider {...methods}>
        <form>
          <div className="flex flex-col gap-10">
            <InputNumberRadio
              label="玩家人數"
              name="PlayerNumber"
              validation={{ required: { value: true, message: '此欄必填' } }}
            />
            <InputCheckbox label="湖中女神" name="LadyLake" />
            <div>
              <Label name="CharacterPool">角色池</Label>
              <div className="flex flex-col gap-1">
                <InputRadio
                  label="預設"
                  id="Default"
                  name="CharacterPool"
                  value="Default"
                  onChange={handleCharacterPoolChange}
                />
                <InputRadio
                  label="自選"
                  id="Choose"
                  name="CharacterPool"
                  value="Choose"
                  onChange={handleCharacterPoolChange}
                />
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex gap-1 ">
                  {roleBlue.map((role, index) => (
                    <SmallCard
                      key={index}
                      cardImg={RoleImageMappingTable[role]}
                      alt="card"
                      className={`w-14 cursor-pointer ${isCustomPool ? 'hover:opacity-80' : ''} `}
                      onClick={handleCardClick}
                      userName={RoleIntroduction[role].showName}
                      Introduction={RoleIntroduction[role].Introduction}
                      onEnlargeChange={handleEnlargedChange}
                    />
                  ))}
                </div>
                <div className="flex gap-1">
                  {roleRed.map((role, index) => (
                    <SmallCard
                      key={index}
                      cardImg={RoleImageMappingTable[role]}
                      alt="card"
                      className={`w-14 cursor-pointer ${isCustomPool ? 'hover:opacity-80' : ''} `}
                      onClick={handleCardClick}
                      userName={RoleIntroduction[role].showName}
                      Introduction={RoleIntroduction[role].Introduction}
                      onEnlargeChange={handleEnlargedChange}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-3 mt-4">
            <Button onClick={createRoom}>創建房間</Button>
          </div>
        </form>
      </FormProvider>
    </>
  )
}

const CreateRoomFront = () => {
  const [goSelectCharacter, setGoSelectCharacter] = useState(false)
  const [characterBlue, setCharacterBlue] = useState()
  const [characterRed, setCharacterRed] = useState()
  const handleGoSelectCharacter = (characterBlue, characterRed) => {
    setGoSelectCharacter(!goSelectCharacter)
    setCharacterBlue(characterBlue)
    setCharacterRed(characterRed)
  }
  const [formData, setFormData] = useState({
    PlayerNumber: '5',
    CharacterPool: 'Default',
    LadyLake: false
  })
  const handleFormChange = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData
    }))
  }

  return (
    <div className="background flex flex-col justify-center items-center gap-10">
      <Frame className="text-White">
        {goSelectCharacter ? (
          <SelectCharacter onClickButton={handleGoSelectCharacter} />
        ) : (
          <CreateRoomInput
            onCardClick={handleGoSelectCharacter}
            characterBlue={characterBlue}
            characterRed={characterRed}
            formData={formData} // 傳遞表單資料
            onFormChange={handleFormChange} // 傳遞更新函式
          />
        )}
      </Frame>
    </div>
  )
}

export default CreateRoomFront
