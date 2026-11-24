const Button = ({ children, onClick, className, mt, type = 'button', disabled = false }) => {
  const classes = `${
    className || ''
  } w-full borderGradient border-[1.8px] relative py-3 active:drop-shadow-[0_0px_5px_White] disabled:opacity-50 disabled:cursor-not-allowed`
  return (
    <div className={`overflow-hidden w-full py-[1.8px] text-White bg-black ${mt || 'mt-12'} `}>
      <button type={type} onClick={onClick} className={classes} disabled={disabled}>
        {children}
      </button>
    </div>
  )
}

export default Button
