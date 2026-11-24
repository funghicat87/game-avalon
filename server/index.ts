import express, { json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { createServer } from 'http'
import { Server as HttpServer } from 'http'
import SocketIOManager from './managers/websocket.js'
import router from './routes/room.js'

/**********************************************************
 * Constants
 */
dotenv.config()
const NODE_ENV = process.env.NODE_ENV || 'production'
const IS_DEV = NODE_ENV !== 'production'
const PORT = process.env.PORT || 3030
const CLIENT_URL = process.env.CLIENT_URL || 'http://127.0.0.1:5173'
const corsOptions = {
  credentials: true,
  origin: CLIENT_URL
}
const ioConfig = IS_DEV ? { cors: corsOptions } : {}

/**********************************************************
 * Instance Express App
 */
const app = express()
app.use(cors(corsOptions))
app.use(json())
app.use(express.static('dist/client'))
const server: HttpServer = createServer(app)


/**********************************************************
 * 註冊物件
 */
new SocketIOManager(server, ioConfig);

/**********************************************************
 * 註冊路由
 */
app.use('/', router);

// SPA fallback：直接開啟或重新整理 /Room/xxx 等前端路由時回傳 index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist/client/index.html'));
});

/**********************************************************
 * 啟動伺服器
 */
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
