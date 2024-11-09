import React from 'react'
import { useFormContext } from 'react-hook-form'

const Label = ({ name, children, className, mb }) => {
  return (
    <label htmlFor={name} className={`${className} ${mb || 'mb-3'} block `}>
      {children}
    </label>
  )
}

const InputText = ({ label, name, validation }) => {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  return (
    <div className="flex flex-col text-lg">
      <Label name={name}>{label}</Label>
      <input
        type="text"
        id={name}
        name={name}
        className="bg-Gray px-5 py-2 focus:outline-none"
        {...register(name, validation)}
      />
      {errors[name] && <p className="text-red-600 text-sm mt-2">{errors[name].message}</p>}
    </div>
  )
}

const InputNumberRadio = ({ name, label, validation, onChange }) => {
  const { register } = useFormContext()
  return (
    <div>
      <Label name={name}>{label}</Label>
      <div className="flex flex-row justify-between">
        {Array.from({ length: 6 }, (_, i) => (
          <div className="flex gap-2 grow items-end" key={i + 5}>
            <label className="flex flex-col-reverse flex-none w-3 items-center cursor-pointer" htmlFor={i + 5}>
              <input
                type="radio"
                id={i + 5}
                value={i + 5}
                name={name}
                {...register(name, {
                  onChange: onChange
                })}
                className='mt-1 before:content[""] peer appearance-none before:block before:h-3 before:w-3 before:rounded-full before:bg-LightGray checked:before:bg-White checked:before:drop-shadow-[0_0px_5px_White] hover:before:drop-shadow-[0_0px_5px_LightGray]'
              />
              <span className="relative text-sm text-LightGray peer-checked:text-White peer-checked:drop-shadow-[0_0px_5px_White] peer-hover:drop-shadow-[0_0px_5px_LightGray]">
                {i + 5}
              </span>
            </label>
            {i < 5 && <div className="grow border-b h-0 border-LightGray mr-2 mb-1"></div>}
          </div>
        ))}
      </div>
    </div>
  )
}

const InputCheckbox = ({ name, label, validation }) => {
  const {
    register,
    formState: { errors }
  } = useFormContext()
  return (
    <div className="flex gap-5 items-center">
      <Label name={name} mb="mb-0" className="mb-0">
        {label}
      </Label>
      <div className="overflow-hidden w-5 h-5 hover:drop-shadow-[0_0px_5px_White] flex">
        <input
          type="checkbox"
          name={name}
          id={name}
          {...register(name, validation)}
          className="cursor-pointer appearance-none w-full h-full borderGradient border-[1.8px] relative bg-clip-content checked:p-[3px] checked:bg-White"
        />
      </div>
      {errors[name] && <p className="text-red-600 text-sm mt-2">{errors[name].message}</p>}
    </div>
  )
}

const InputRadio = ({ name, id, label, value, onChange }) => {
  const { register } = useFormContext()
  return (
    <div className="flex flex-row gap-4 items-center">
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
      <div className="overflow-hidden w-4 h-4 hover:drop-shadow-[0_0px_5px_White] flex">
        <input
          type="radio"
          name={name}
          value={value}
          id={id}
          {...register(name, {
            onChange: onChange
          })}
          className="cursor-pointer appearance-none w-full h-full borderGradient border-[1.8px] relative bg-clip-content checked:p-[2px] checked:bg-White"
        />
      </div>
    </div>
  )
}

export { Label, InputText, InputNumberRadio, InputCheckbox, InputRadio }
