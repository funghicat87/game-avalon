import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomeFront from './pages/HomeFront.jsx'
import LoginFront from './pages/LoginFront.jsx'
import { ReduxProvider } from './context/ReduxContext.jsx'
import JoinRoomFront from './pages/JoinRoomFront.jsx'
import CreateRoomFront from './pages/CreateRoomFront.jsx'
import RoomFront from './pages/RoomFront.jsx'
import { SelectCharacter } from './component/SelectCharacter.jsx'

function App() {
  return (
    <>
      <ReduxProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<HomeFront />} />
            <Route exact path="/Login" element={<LoginFront />} />
            <Route exact path="/CreateRoom" element={<CreateRoomFront />} />
            <Route exact path="/JoinRoom" element={<JoinRoomFront />} />
            <Route exact path="/Room/:id" element={<RoomFront />} />
            <Route exact path="/SelectCharacter" element={<SelectCharacter />} />
          </Routes>
        </BrowserRouter>
      </ReduxProvider>
    </>
  )
}

export default App
