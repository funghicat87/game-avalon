import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import Button from '../../component/Button'
import { InputNumberRadio, InputCheckbox, InputRadio, Label } from '../../component/Input'
import cardMinionOfMordredA from '../../assets/role/card-MinionOfMordredA.png'
import cardMinionOfMordredB from '../../assets/role/card-MinionOfMordredB.png'
import cardMinionOfMordredC from '../../assets/role/card-MinionOfMordredC.png'
import cardLoyalServantOfArthurA from '../../assets/role/card-LoyalServantOfArthurA.png'
import cardLoyalServantOfArthurB from '../../assets/role/card-LoyalServantOfArthurB.png'
import cardLoyalServantOfArthurC from '../../assets/role/card-LoyalServantOfArthurC.png'
import cardLoyalServantOfArthurD from '../../assets/role/card-LoyalServantOfArthurD.png'
import cardLoyalServantOfArthurE from '../../assets/role/card-LoyalServantOfArthurE.png'
import cardMerlin from '../../assets/role/card-Merlin.png'
import cardMorderd from '../../assets/role/card-Morderd.png'
import cardMorgana from '../../assets/role/card-Morgana.png'
import cardOberon from '../../assets/role/card-Oberon.png'
import cardPercival from '../../assets/role/card-Percival.png'
import axios from 'axios'
import { origin } from '../../config/setting'
import { useDispatch } from 'react-redux'

const SettingArea = ({ roomId, players, state }) => {
  const methods = useForm()

  const dispatch = useDispatch()
  const [changeSetting, setChangeSetting] = useState(false)
  const handleChangeSetting = () => {
    setChangeSetting(!changeSetting)
  }

  const handleGameStart = () => {
    // 檢查人數是否足夠
    if (players.length < state.people) {
      alert('人數不夠')
      return
    }
    dispatch({
      type: 'sendGameStatus',
      payload: {
        gameType: 'GAMESTART',
        roomId: roomId
      }
    })
  }

  const handleAddComputer = () => {
    axios
      .post(`${origin}/addComputer`, {
        roomId: roomId
      })
      .then((res) => {
        console.debug(res)
        // console.log(res)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleRemoveComputer = () => {
    axios
      .post(`${origin}/removeComputer`, {
        roomId: roomId
      })
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <FormProvider {...methods}>
      <div className="text-White flex gap-36">
        {/* <div className="flex flex-col gap-10">
          <InputNumberRadio label="玩家人數" name="PlayerNumber" />
          <InputCheckbox label="湖中女神" name="LadyLake" />
          <div>
            <Label name="CharacterPool">角色池</Label>
            <div className="flex flex-row ">
              <div className="flex flex-col gap-1">
                <InputRadio
                  label="預設"
                  id="Default"
                  name="CharacterPool"
                  validation={{ required: { value: true, message: '此欄必填' } }}
                />
                <InputRadio
                  label="自選"
                  id="Choose"
                  name="CharacterPool"
                  validation={{ required: { value: true, message: '此欄必填' } }}
                />
              </div>
              <div className="flex flex-row gap-1 ml-3">
                <img src={cardMinionOfMordredA} alt="card" className="w-10" />
                <img src={cardMinionOfMordredA} alt="card" className="w-10" />
                <img src={cardMinionOfMordredA} alt="card" className="w-10" />
                <img src={cardMinionOfMordredA} alt="card" className="w-10" />
                <img src={cardMinionOfMordredA} alt="card" className="w-10" />
                <img src={cardMinionOfMordredA} alt="card" className="w-10" />
                <img src={cardMinionOfMordredA} alt="card" className="w-10" />
                <img src={cardMinionOfMordredA} alt="card" className="w-10" />
                <img src={cardMinionOfMordredA} alt="card" className="w-10" />
                <img src={cardMinionOfMordredA} alt="card" className="w-10" />
              </div>
            </div>
          </div>
        </div> */}
        <div className="flex flex-row w-96 justify-end items-end w-28 gap-2 ">
          {changeSetting || (
            <>
              {/* <Button mt="mt-0" onClick={handleChangeSetting}>
                變更
              </Button> */}
              <Button mt="mt-0" onClick={handleGameStart}>
                開始
              </Button>
              <Button mt="mt-0" onClick={handleAddComputer}>
                加入電腦
              </Button>
              <Button mt="mt-0" onClick={handleRemoveComputer}>
                刪除電腦
              </Button>
            </>
          )}
          {changeSetting && (
            <>
              <Button mt="mt-0" onClick={handleChangeSetting}>
                儲存
              </Button>
              <Button mt="mt-0" onClick={handleChangeSetting}>
                取消
              </Button>
            </>
          )}
        </div>
      </div>
    </FormProvider>
  )
}

export default SettingArea
