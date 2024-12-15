interface GarticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  customClasses?: string
  variant:
    | 'main'
    | 'mainOutlined'
    | 'danger'
    | 'dangerOutlined'
    | 'secondary'
    | 'secondaryOutlined'
  fontThickness?: 'regular' | 'medium' | 'bold'
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  customWidth?: boolean
}

const GarticButton = ({
  label,
  variant,
  customClasses,
  fontThickness = 'regular',
  startIcon,
  endIcon,
  customWidth = false,
  ...props
}: GarticButtonProps) => {
  const baseStyles = {
    main: 'border-black bg-main text-white',
    mainOutlined: 'border-main text-main',
    danger: 'border-black bg-red',
    dangerOutlined: 'border-red text-red',
    secondary: 'border-black bg-secondary text-white',
    secondaryOutlined: 'border-secondary text-secondary',
  }

  const fontThicknessStyles = {
    regular: '',
    medium: 'font-medium',
    bold: 'font-bold',
  }

  const buttonClass = `${baseStyles[variant]} ${
    fontThicknessStyles[fontThickness]
  } border-2 ${customWidth ? '' : 'w-[200px]'} ${
    endIcon || startIcon ? 'flex items-center gap-2 justify-center' : ''
  } px-3 py-2 ${customClasses}`

  return (
    <button className={buttonClass} {...props}>
      {startIcon}

      {label}

      {endIcon}
    </button>
  )
}

export default GarticButton
