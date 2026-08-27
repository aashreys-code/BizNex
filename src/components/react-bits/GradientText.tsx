interface GradientTextProps {
  text: string
  className?: string
}

export default function GradientText({ text, className = '' }: GradientTextProps) {
  return (
    <span
      className={className}
      style={{
        background: 'linear-gradient(to right, #5CF5C1, #21F1A8, #1AD692)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {text}
    </span>
  )
}
