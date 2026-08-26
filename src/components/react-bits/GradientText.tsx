interface GradientTextProps {
  text: string
  className?: string
}

export default function GradientText({ text, className = '' }: GradientTextProps) {
  return (
    <span
      className={className}
      style={{
        background: 'linear-gradient(to right, #2BEE34, #4dff75, #1fd427)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {text}
    </span>
  )
}
