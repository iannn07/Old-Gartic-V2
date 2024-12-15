import Image from 'next/image'
import Link from 'next/link'
import LoginComponent from './LoginComponent'
import RegisterComponent from './RegisterComponent'

interface AuthComponentProps {
  type?: 'login' | 'register'
}

const renderFormFooter = (type: 'login' | 'register') => {
  const linkText = type === 'login' ? 'Register' : 'Login'
  const linkHref = type === 'login' ? '/auth/register' : '/auth/login'
  const message =
    type === 'login' ? "Don't have an account?" : 'Already have an account?'

  return (
    <p>
      {message}{' '}
      <span
        className={`text-${
          type === 'login' ? 'secondary' : 'main'
        } cursor-pointer`}
      >
        <Link href={linkHref}>{linkText}</Link>
      </span>
    </p>
  )
}

function AuthComponent({ type = 'login' }: AuthComponentProps) {
  return (
    <>
      {/* BODY */}
      <div className='w-full p-20 mt-20'>
        <div className='flex justify-center gap-5 w-full'>
          {/* Left Column */}
          <div className='flex flex-col w-full justify-between items-center gap-5'>
            <div className='flex gap-2 items-center justify-center w-full'>
              <h1 className='text-5xl'>{type.toUpperCase()}</h1>
              <Image src='/images/dog.gif' width={75} height={75} alt='Logo' />
            </div>
            {renderFormFooter(type)}

            {type === 'login' ? <LoginComponent /> : <RegisterComponent />}
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthComponent
