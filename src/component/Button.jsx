const Button = ({ children, onClick, className, mt }) => {
  const classes = `${
    className || ''
  } w-full borderGradient border-[1.8px] relative py-3 active:drop-shadow-[0_0px_5px_White] `
  return (
    <div className={`overflow-hidden w-full py-[1.8px] text-White bg-black ${mt || 'mt-12'} `}>
      <button onClick={onClick} className={classes}>
        {children}
      </button>
    </div>
  )
}

export default Button
