import { v4 as uuidv4 } from 'uuid'

// 正式環境前後端同源；開發時可用 VITE_SERVER_URL 覆寫
const origin =
  import.meta.env.VITE_SERVER_URL || (import.meta.env.MODE === 'production' ? location.origin : 'http://localhost:4000')

// 每個分頁一個固定的 clientId（存在 sessionStorage）：
// 斷線重連、重新整理頁面後，伺服器都能認出是同一位玩家並放回原本的房間。
const CLIENT_ID_KEY = 'avalon-client-id'
let clientId = sessionStorage.getItem(CLIENT_ID_KEY)
if (!clientId) {
  clientId = uuidv4()
  sessionStorage.setItem(CLIENT_ID_KEY, clientId)
}

export { origin, clientId }
