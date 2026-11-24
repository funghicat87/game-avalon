import TitleDecoration from '../assets/frame/title_decoration.svg'

const Title = ({ children, mb = 'mb-8 md:mb-12' }) => {
  return (
    <div className={`flex flex-row items-center justify-center md:justify-start text-lg sm:text-xl md:text-2xl tracking-widest ${mb}`}>
      <img src={TitleDecoration} alt="TitleDecoration" className="w-10 sm:w-14 md:w-auto shrink min-w-0" />
      <span className="mx-3 sm:mx-4 md:mx-8 text-center">{children}</span>
      <img src={TitleDecoration} alt="TitleDecoration" className="w-10 sm:w-14 md:w-auto shrink min-w-0 scale-x-[-1]" />
    </div>
  )
}

export default Title
