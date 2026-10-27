export default function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = '',
  style = {},
}) {
  return (
    <span
      className={`shiny-text ${className}`}
      style={{
        display: 'inline-block',
        backgroundImage: disabled
          ? 'none'
          : 'linear-gradient(120deg, rgba(197, 160, 89,0.7) 0%, #fffbf0 45%, #ffffff 50%, #fffbf0 55%, rgba(197, 160, 89,0.7) 100%)',
        backgroundSize: '250% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: disabled ? 'inherit' : 'transparent',
        animation: disabled ? 'none' : `shine-sweep ${speed}s linear infinite`,
        ...style,
      }}
    >
      {text}
    </span>
  )
}
