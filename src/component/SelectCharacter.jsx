import Button from './Button'
import Title from './Title'
import { RoleImageMappingTable } from '@/utils/MappingImage'
import { useForm } from 'react-hook-form'
import { SmallCard } from '../component/Room/Card'
import { RoleIntroduction } from '../utils/RoleIntroduction'

const CHARACTER_BLUE = [
  'Merlin',
  'Percival',
  'LoyalServant',
  'LoyalServantB',
  'LoyalServantC',
  'LoyalServantD',
  'LoyalServantE'
]
const CHARACTER_RED = ['Assassin', 'Mordred', 'Morgana', 'Oberon', 'MinionA', 'MinionB', 'MinionC']
const NUMBER_PEOPLE = {
  5: { blueNumber: 3, redNumber: 2 },
  6: { blueNumber: 4, redNumber: 2 },
  7: { blueNumber: 4, redNumber: 3 },
  8: { blueNumber: 5, redNumber: 3 },
  9: { blueNumber: 6, redNumber: 3 },
  10: { blueNumber: 6, redNumber: 4 }
}

const makeValidator = (required, requiredLabel, count, sideLabel) => (value) => {
  if (!value.includes(required)) return `${sideLabel}必須選擇 ${requiredLabel}`
  if (value.length !== count) return `${sideLabel}必須選擇 ${count} 個角色（目前 ${value.length} 個）`
  return true
}

const SelectCharacter = ({ playerNumber, onClickButton }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      CharacterBlue: ['Merlin'],
      CharacterRed: ['Assassin']
    }
  })
  const { blueNumber, redNumber } = NUMBER_PEOPLE[playerNumber] ?? NUMBER_PEOPLE[5]

  const onSubmit = (data) => {
    onClickButton(data.CharacterBlue, data.CharacterRed)
  }

  const renderRow = (name, characters, validate, count) => (
    <div>
      <p className="text-sm text-LightGray mb-1">
        {name === 'CharacterBlue' ? '藍方' : '紅方'}（{watch(name).length}/{count}）
      </p>
      <div className="flex w-full md:w-96">
        {characters.map((character) => (
          <label htmlFor={character} key={character} className="flex-1 min-w-0">
            <input
              type="checkbox"
              className="peer appearance-none absolute"
              id={character}
              value={character}
              {...register(name, { validate })}
            />
            <div className="opacity-35 peer-checked:opacity-100">
              <SmallCard
                cardImg={RoleImageMappingTable[character]}
                className="w-full h-full cursor-pointer hover:opacity-80"
                userName={RoleIntroduction[character].showName}
                Introduction={RoleIntroduction[character].Introduction}
              />
            </div>
          </label>
        ))}
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Title>選擇角色</Title>
      <div className="flex flex-col gap-3">
        {renderRow('CharacterBlue', CHARACTER_BLUE, makeValidator('Merlin', '梅林', blueNumber, '藍方'), blueNumber)}
        {renderRow('CharacterRed', CHARACTER_RED, makeValidator('Assassin', '刺客', redNumber, '紅方'), redNumber)}
      </div>
      {errors.CharacterBlue && <p className="text-red-500 text-sm mt-3">{errors.CharacterBlue.message}</p>}
      {errors.CharacterRed && <p className="text-red-500 text-sm mt-3">{errors.CharacterRed.message}</p>}
      <div className="flex gap-3">
        <Button onClick={() => onClickButton()}>取消</Button>
        <Button type="submit">確認</Button>
      </div>
    </form>
  )
}

export { SelectCharacter }
