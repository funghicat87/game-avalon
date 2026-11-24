import { useNavigate } from 'react-router-dom'

/**
 * 左上角的返回按鈕
 * - to：要回到的路徑
 * - confirmText：有值時會先跳確認視窗
 */
const BackButton = ({ to, children = '上一頁', confirmText }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (confirmText && !confirm(confirmText)) return
    navigate(to)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed top-3 left-3 md:top-6 md:left-6 z-50 flex items-center gap-1 px-3 py-1.5 text-sm md:text-base text-LightGray hover:text-White bg-Black/60 borderGradientFrame border-[1.4px] tracking-widest font-ZenOldMincho transition-colors"
    >
      <span aria-hidden>‹</span>
      {children}
    </button>
  )
}

export default BackButton
