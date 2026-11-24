import { Link } from 'react-router-dom'
import AvalonLogo from '../assets/avalon_logo.svg'

const HomeFront = () => {
  return (
    <Link to="/Login">
      <div className="background flex flex-col items-center justify-center ">
        <img src={AvalonLogo} alt="AvalonLogo" className="w-72 sm:w-96 md:w-auto" />
        <span className="dropShadowWhite text-3xl md:text-4xl text-White font-Neuton tracking-wider">Press Start</span>
      </div>
    </Link>
  )
}

export default HomeFront
