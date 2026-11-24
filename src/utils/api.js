import axios from 'axios'
import { origin, clientId } from '../config/setting'

/** 呼叫後端 API，自動帶上 userId；失敗時丟出可直接顯示給使用者的錯誤訊息 */
export const post = async (path, body = {}) => {
  try {
    const res = await axios.post(`${origin}${path}`, { userId: clientId, ...body })
    return res.data
  } catch (error) {
    throw new Error(error.response?.data?.message || '無法連線到伺服器，請稍後再試')
  }
}
