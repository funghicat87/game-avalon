import Button from './Button'
import Title from './Title'
import { RoleImageMappingTable } from '@/utils/MappingImage'
import { useForm, FormProvider } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { SmallCard } from '../component/Room/Card'
import { RoleIntroduction } from '../utils/RoleIntroduction'

const SelectCharacter = ({ onClickButton }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    methods
  } = useForm({
    defaultValues: {
      CharacterBlue: ['Merlin'],
      CharacterRed: ['Assassin']
    }
  })

  
  const location = useLocation()

  const onSubmit = (data) => {
    onClickButton()
    onClickButton(data.CharacterBlue, data.CharacterRed)
  }
  const playerNumber = location.state.formData.PlayerNumber
  const CharacterBlue = [
    'Merlin',
    'Percival',
    'LoyalServant',
    'LoyalServantB',
    'LoyalServantC',
    'LoyalServantD',
    'LoyalServantE'
  ]
  const CharacterRed = ['Assassin', 'Mordred', 'Morgana', 'Oberon', 'MinionA', 'MinionB', 'MinionC']
  const numberPeople = {
    5: { blueNumber: 3, redNumber: 2 },
    6: { blueNumber: 4, redNumber: 2 },
    7: { blueNumber: 4, redNumber: 3 },
    8: { blueNumber: 5, redNumber: 3 },
    9: { blueNumber: 6, redNumber: 3 },
    10: { blueNumber: 6, redNumber: 4 }
  }
  
  //取得isCardEnlarged
  const [isCardEnlarged, setIsCardEnlarged] = useState(false)

  const handleEnlargedChange = (enlarged) => {
    setIsCardEnlarged(enlarged)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Title>選擇角色</Title>
        <div className="flex w-96">
          {CharacterBlue.map((character, index) => (
            <label htmlFor={character} key={index}>
              <input
                name="CharacterBlue"
                type="checkbox"
                className="peer appearance-none relative"
                id={character}
                value={character}
                {...register('CharacterBlue', {
                  validate: (value) => {
                    if (!value.includes('Merlin')) {
                      return '藍方必須選擇 Merlin'
                    } else if (value.length < numberPeople[playerNumber].blueNumber) {
                      return `藍方必須選擇 ${numberPeople[playerNumber].blueNumber} 個角色`
                    } else if (value.length > numberPeople[playerNumber].blueNumber) {
                      return `藍方角色數量不可以超過 ${numberPeople[playerNumber].blueNumber} 個`
                    }
                    return true
                  }
                })}
              />
              <div className={`peer-checked:opacity-100 ${isCardEnlarged ? 'opacity-100' : 'opacity-35'}`}>
                <SmallCard
                  key={index}
                  cardImg={RoleImageMappingTable[character]}
                  alt={character}
                  className={`w-full h-full cursor-pointer hover:opacity-80`}
                  userName={RoleIntroduction[character].showName}
                  Introduction={RoleIntroduction[character].Introduction}
                  onEnlargeChange={handleEnlargedChange}
                />
              </div>
            </label>
          ))}
        </div>
        <div className="flex w-96">
          {CharacterRed.map((character, index) => (
            <label htmlFor={character} key={index}>
              <input
                name="CharacterRed"
                type="checkbox"
                className="peer appearance-none relative"
                id={character}
                value={character}
                {...register('CharacterRed', {
                  validate: (value) => {
                    if (!value.includes('Assassin')) {
                      return '紅方必須選擇 Assassin'
                    } else if (value.length < numberPeople[playerNumber].redNumber) {
                      return `紅方必須選擇 ${numberPeople[playerNumber].redNumber} 個角色`
                    } else if (value.length > numberPeople[playerNumber].redNumber) {
                      return `紅方角色數量不可以超過 ${numberPeople[playerNumber].redNumber} 個`
                    }
                    return true
                  }
                })}
              />
              <div className={`peer-checked:opacity-100 ${isCardEnlarged ? 'opacity-100' : 'opacity-35'}`}>
                <SmallCard
                  key={index}
                  cardImg={RoleImageMappingTable[character]}
                  alt={character}
                  className={`w-full h-full cursor-pointer hover:opacity-80`}
                  userName={RoleIntroduction[character].showName}
                  Introduction={RoleIntroduction[character].Introduction}
                  onEnlargeChange={handleEnlargedChange}
                />
              </div>
            </label>
          ))}
        </div>
        <Button type="submit">確認</Button>
        {errors.CharacterBlue && <p className="text-red-500">{errors.CharacterBlue.message}</p>}
        {errors.CharacterRed && <p className="text-red-500">{errors.CharacterRed.message}</p>}
      </form>
    </FormProvider>
  )
}

export { SelectCharacter }
