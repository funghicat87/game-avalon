import { useState, useEffect, useRef } from 'react' // 新增 useRef 和 useEffect
import { useSelector, useDispatch } from 'react-redux'

// eslint-disable-next-line react/prop-types
const Chat = ({ roomId, userName }) => {
  const messages = useSelector((state) => state.chat.messages)
  const [message, setMessage] = useState('')
  const dispatch = useDispatch()
  const [selectedTab, setSelectedTab] = useState('All')
  const messagesEndRef = useRef(null) // 新增 ref

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim() !== '') {
      dispatch({
        type: 'submitMessage',
        payload: {
          roomId: roomId,
          message: { userName, message }
        }
      })
      setMessage('')
    }
  }

  // 新增處理鍵盤事件的函數
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      // 修正處理中文輸入的問題
      handleSendMessage(e)
    }
  }

  // 處理按鈕點擊事件
  const handleTabClick = (tab) => {
    setSelectedTab(tab)
  }

  // 新增 useEffect 來滾動到最新訊息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="bg-Black/[0.7] text-White flex flex-col">
      <div className="flex border-[1.8px] borderGradientFrame">
        <div className="flex flex-col m-2 flex-grow h-32 w-[600px] overflow-auto scrollbar scrollbar-thumb-Gray  ">
          {messages.map((ele, index) => (
            <div key={index}>
              {ele.userName}: {ele.message}
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* 新增此行 */}
        </div>
        <div className="flex flex-col w-28 -mr-[1.8px] justify-center">
          <button
            className={`w-full borderGradientFrame border-[1.8px] relative py-3 active:drop-shadow-[0_0px_5px_White] ${
              selectedTab === 'All' ? 'opacity-100' : 'opacity-35'
            }`}
            onClick={() => handleTabClick('All')}
          >
            All
          </button>
          <button
            className={`w-full borderGradientFrame border-[1.8px] relative py-3 active:drop-shadow-[0_0px_5px_White] -mt-[1.8px] ${
              selectedTab === 'System' ? 'opacity-100' : 'opacity-35'
            }`}
            onClick={() => handleTabClick('System')}
          >
            System
          </button>
          <button
            className={`w-full borderGradientFrame border-[1.8px] relative py-3 active:drop-shadow-[0_0px_5px_White] -mt-[1.8px] ${
              selectedTab === 'Chat' ? 'opacity-100' : 'opacity-35'
            }`}
            onClick={() => handleTabClick('Chat')}
          >
            Chat
          </button>
        </div>
      </div>
      <div className="flex -mt-[1.8px]">
        <input
          type="text"
          className="flex-grow  borderGradientFrame border-[1.8px] p-2 bg-clip-content focus:outline-0 bg-Gray -mr-[1.8px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="borderGradientFrame w-28 border-[1.8px] py-3 active:drop-shadow-[0_0px_5px_White]"
          onClick={handleSendMessage}
        >
          送出
        </button>
      </div>
    </div>
  )
}

export default Chat
