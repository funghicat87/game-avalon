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
  // 只捲動聊天框本身（scrollIntoView 會讓手機整個頁面跟著跳）
  useEffect(() => {
    const box = messagesEndRef.current?.parentElement
    if (box) box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' })
  }, [messages, selectedTab])

  return (
    <div className="bg-Black/[0.7] text-White flex flex-col w-full lg:w-auto">
      <div className="flex border-[1.8px] borderGradientFrame">
        <div className="flex flex-col m-2 flex-grow h-28 lg:h-32 w-auto min-w-0 lg:w-[600px] overflow-auto break-words scrollbar scrollbar-thumb-Gray  ">
          {messages
            .filter((ele) =>
              selectedTab === 'All'
                ? true
                : selectedTab === 'System'
                  ? ele.userName === 'system'
                  : ele.userName !== 'system'
            )
            .map((ele, index) => (
              <div key={index} className={ele.userName === 'system' ? 'text-LightGray' : ''}>
                {ele.userName === 'system' ? `【系統】${ele.message}` : `${ele.userName}: ${ele.message}`}
              </div>
            ))}
          <div ref={messagesEndRef} /> {/* 新增此行 */}
        </div>
        <div className="flex flex-col w-20 lg:w-28 shrink-0 -mr-[1.8px] justify-center">
          <button
            className={`w-full borderGradientFrame border-[1.8px] relative py-2 lg:py-3 text-sm lg:text-base active:drop-shadow-[0_0px_5px_White] ${
              selectedTab === 'All' ? 'opacity-100' : 'opacity-35'
            }`}
            onClick={() => handleTabClick('All')}
          >
            All
          </button>
          <button
            className={`w-full borderGradientFrame border-[1.8px] relative py-2 lg:py-3 text-sm lg:text-base active:drop-shadow-[0_0px_5px_White] -mt-[1.8px] ${
              selectedTab === 'System' ? 'opacity-100' : 'opacity-35'
            }`}
            onClick={() => handleTabClick('System')}
          >
            System
          </button>
          <button
            className={`w-full borderGradientFrame border-[1.8px] relative py-2 lg:py-3 text-sm lg:text-base active:drop-shadow-[0_0px_5px_White] -mt-[1.8px] ${
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
          className="flex-grow min-w-0 borderGradientFrame border-[1.8px] p-2 bg-clip-content focus:outline-0 bg-Gray -mr-[1.8px]"
          value={message}
          maxLength={300}
          enterKeyHint="send"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="borderGradientFrame w-20 lg:w-28 shrink-0 border-[1.8px] py-2 lg:py-3 active:drop-shadow-[0_0px_5px_White]"
          onClick={handleSendMessage}
        >
          送出
        </button>
      </div>
    </div>
  )
}

export default Chat
