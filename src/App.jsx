import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ReduxProvider } from './context/ReduxContext.jsx'
import HomeFront from './pages/HomeFront.jsx'

// 依頁面切分程式碼，首頁不用一次下載所有頁面與卡圖
const LoginFront = lazy(() => import('./pages/LoginFront.jsx'))
const JoinRoomFront = lazy(() => import('./pages/JoinRoomFront.jsx'))
const CreateRoomFront = lazy(() => import('./pages/CreateRoomFront.jsx'))
const RoomFront = lazy(() => import('./pages/RoomFront.jsx'))

const Loading = () => <div className="background" />

function App() {
  return (
    <ReduxProvider>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<HomeFront />} />
            <Route path="/Login" element={<LoginFront />} />
            <Route path="/CreateRoom" element={<CreateRoomFront />} />
            <Route path="/JoinRoom" element={<JoinRoomFront />} />
            <Route path="/Room/:id" element={<RoomFront />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ReduxProvider>
  )
}

export default App
