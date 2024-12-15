import Image from 'next/image'
import Link from 'next/link'
import LoginComponent from './LoginComponent'
import RegisterComponent from './RegisterComponent'

interface AuthComponentProps {
  type?: 'login' | 'register'
}

const renderFormHeader = (type: 'login' | 'register') => {
  const linkText = type === 'login' ? 'Register' : 'Login'
  const linkHref = type === 'login' ? '/auth/register' : '/auth/login'
  const message =
    type === 'login' ? "Don't have an account?" : 'Already have an account?'

  return (
    <p>
      {message}{' '}
      <span
        className={`cursor-pointer
          bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text
          [text-shadow:0_0_2px_rgba(255,0,255,1),0_0_20px_rgba(255,165,0,0.8),0_0_30px_rgba(255,255,0,0.6)]
          transition duration-300 ease-in-out
          hover:[text-shadow:0_0_2px_rgba(0,255,255,1),0_0_20px_rgba(0,191,255,0.8),0_0_30px_rgba(135,206,250,0.6)]
        `}
      >
        <Link href={linkHref}>{linkText}</Link>
      </span>
    </p>
  )
}

function AuthComponent({ type = 'login' }: AuthComponentProps) {
  return (
    <div className='w-full flex justify-center'>
      {/* BODY */}
      <div className='w-3/4 p-20 mt-20 bg-gradient-to-r text-neonGreen font-extrabold text-3xl shadow-xl'>
        <div className='flex justify-center gap-5 w-full'>
          {/* Left Column */}
          <div className='flex flex-col w-full justify-between items-center gap-5'>
            <div className='flex gap-2 items-center justify-center w-full'>
              <h1 className='text-5xl'>{type.toUpperCase()}</h1>
              <Image
                priority
                src='/images/dog.gif'
                width={75}
                height={75}
                alt='Logo'
              />
            </div>
            {renderFormHeader(type)}

            {type === 'login' ? <LoginComponent /> : <RegisterComponent />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthComponent
