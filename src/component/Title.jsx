import TitleDecoration from '../assets/frame/title_decoration.svg'

const Title = ({ children, mb = 'mb-12' }) => {
  return (
    <div className={`flex flex-row text-2xl tracking-widest ${mb}`}>
      <img src={TitleDecoration} alt="TitleDecoration" />
      <span className="mx-8">{children}</span>
      <img src={TitleDecoration} alt="TitleDecoration" className="scale-x-[-1]" />
    </div>
  )
}

export default Title
