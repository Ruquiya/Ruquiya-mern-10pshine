import { useState, useEffect, useRef } from 'react'
import api from '../services/api'

export default function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const formRef = useRef(null)

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail')
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true'
    
    if (savedEmail && savedRememberMe) {
      setFormData(prev => ({ ...prev, email: savedEmail }))
      setRememberMe(true)
    }

    setAnimate(true)
    const handleResize = () => {
      window.scrollTo(0, 0)
      document.body.style.overflow = 'hidden'
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    
    const style = document.createElement('style')
    style.textContent = `
      @keyframes float {
        0%, 100% {
          transform: translateY(0px) rotate(0deg) scale(1);
        }
        33% {
          transform: translateY(-10px) rotate(120deg) scale(1.1);
        }
        66% {
          transform: translateY(5px) rotate(240deg) scale(0.9);
        }
      }

      @keyframes glow {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
      }

      .animation-delay-1000 {
        animation-delay: 1s;
      }
      .animation-delay-2000 {
        animation-delay: 2s;
      }
      .animation-delay-3000 {
        animation-delay: 3s;
      }
      .animation-delay-4000 {
        animation-delay: 4s;
      }

      html, body {
        margin: 0;
        padding: 0;
        height: 100dvh;
        width: 100%;
        overflow: hidden;
      }

      @media (max-width: 640px) {
        .max-w-md {
          max-width: calc(100% - 1rem);
          margin: 0 0.5rem;
        }
        .text-4xl {
          font-size: 1.75rem;
        }
        .text-2xl {
          font-size: 1.25rem;
        }
        .text-sm {
          font-size: 0.75rem;
        }
        .p-6 {
          padding: 1rem;
        }
        .space-y-4 > :not([hidden]) ~ :not([hidden]) {
          margin-top: 0.75rem;
        }
        .my-6 {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.body.style.overflow = 'auto'
      document.head.removeChild(style)
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleRememberMeChange = (e) => {
    const isChecked = e.target.checked
    setRememberMe(isChecked)
    
    if (!isChecked) {
      localStorage.removeItem('savedEmail')
      localStorage.removeItem('rememberMe')
    }
  }

  const validateForm = () => {
    if (!isLogin) {
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long')
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return false
      }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }

    return true
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!forgotPasswordEmail) {
      setError('Please enter your email address')
      return
    }

    setIsLoading(true)
    try {
      await api.post('/auth/forgot-password', {
        email: forgotPasswordEmail
      })
      setError('')
      alert('Password reset link sent to your email!')
      setShowForgotPassword(false)
      setForgotPasswordEmail('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      let response
      if (isLogin) {
        response = await api.login({
          email: formData.email,
          password: formData.password,
          rememberMe: rememberMe
        })
      } else {
        response = await api.register({
          name: formData.name, 
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        })
      }

      if (response.success) {
        if (response.token) {
          localStorage.setItem('token', response.token)
        }
        localStorage.setItem('user', JSON.stringify(response.data))
        if (rememberMe) {
          localStorage.setItem('savedEmail', formData.email)
          localStorage.setItem('rememberMe', 'true')
        }
        onLogin()
      }
    } catch (error) {
      console.error('API Error:', error)
      setError(error.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = (login) => {
    setIsLogin(login)
    setError('')
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    if (formRef.current) {
      formRef.current.style.transform = 'translateX(20px)'
      formRef.current.style.opacity = '0'
      setTimeout(() => {
        formRef.current.style.transform = 'translateX(0)'
        formRef.current.style.opacity = '1'
      }, 300)
    }
  }

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-48 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse sm:w-64 sm:h-64"></div>
        <div className="absolute -bottom-48 -right-48 w-80 h-80 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse animation-delay-2000 sm:w-64 sm:h-64"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-bounce animation-delay-4000 sm:w-80 sm:h-80"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-amber-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-ping animation-delay-3000 sm:w-32 sm:h-32"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-emerald-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-pulse animation-delay-1000 sm:w-24 sm:h-24"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 3}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 3}s`,
              transform: `scale(${0.5 + Math.random() * 1})`
            }}
          ></div>
        ))}
      </div>

      {/* Main Container */}
      <div className={`w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 transition-all duration-1000 transform ${animate ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'} sm:max-w-sm sm:p-4`}>
        {/* Header */}
        <div className="text-center relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative group mr-2">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-all duration-500 shadow-2xl sm:w-10 sm:h-10">
                <span className="text-white font-bold text-2xl sm:text-xl">C</span>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300 -z-10"></div>
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 tracking-tight sm:text-3xl">
              Cognify
            </h1>
          </div>
          
          <h2 className="text-2xl font-extrabold text-white mb-2 sm:text-xl">
            {isLogin ? 'Welcome Back!' : 'Create Your Account'}
          </h2>
          <p className="text-gray-300 text-sm sm:text-xs">
            {isLogin ? 'Sign in to access your notes' : 'Join us to organize your thoughts'}
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-center my-6 sm:my-4">
          <div className="bg-gray-800/60 rounded-xl p-1 flex border border-white/10">
            <button
              onClick={() => handleToggle(true)}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 min-w-[100px] text-sm sm:min-w-[80px] sm:text-xs ${
                isLogin
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              aria-label="Switch to login"
            >
              Login
            </button>
            <button
              onClick={() => handleToggle(false)}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 min-w-[100px] text-sm sm:min-w-[80px] sm:text-xs ${
                !isLogin
                  ? 'bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              aria-label="Switch to sign up"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          ref={formRef}
          className="space-y-4 transition-all duration-300 transform translate-x-0 opacity-100"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="space-y-4 sm:space-y-3">
            {!isLogin && (
              <div className="relative group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="relative block w-full px-4 py-3 bg-gray-800/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-sm sm:text-xs sm:py-2"
                  placeholder="Full Name"
                  aria-label="Full Name"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
              </div>
            )}
            
            <div className="relative group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="relative block w-full px-4 py-3 bg-gray-800/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-sm sm:text-xs sm:py-2"
                placeholder="Email Address"
                aria-label="Email Address"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
            </div>
            
            <div className="relative group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="relative block w-full px-4 py-3 bg-gray-800/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-sm sm:text-xs sm:py-2"
                placeholder="Password"
                aria-label="Password"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
            </div>

            {!isLogin && (
              <div className="relative group">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="relative block w-full px-4 py-3 bg-gray-800/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-sm sm:text-xs sm:py-2"
                  placeholder="Confirm Password"
                  aria-label="Confirm Password"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
              </div>
            )}
          </div>

          {isLogin && (
            <div className="flex items-center justify-between px-1 sm:text-xs my-4 sm:my-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    aria-label="Remember me"
                  />
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-300 hover:border-cyan-500 sm:w-3 sm:h-3 ${
                    rememberMe 
                      ? 'bg-cyan-500 border-cyan-500' 
                      : 'bg-gray-700 border-gray-600'
                  }`}>
                    <svg 
                      className={`w-2 h-2 text-white transition-opacity duration-200 sm:w-1.5 sm:h-1.5 ${
                        rememberMe ? 'opacity-100' : 'opacity-0'
                      }`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-gray-300 text-sm sm:text-xs">Remember me</span>
              </label>
              <button 
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium sm:text-xs"
                aria-label="Forgot password"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transform hover:scale-[1.02] transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden sm:text-xs sm:py-2"
            aria-label={isLogin ? 'Sign in' : 'Create account'}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            {isLoading ? (
              <div className="flex items-center relative z-10">
                <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2 sm:w-4 sm:h-4"></div>
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </div>
            ) : (
              <span className="flex items-center relative z-10">
                {isLogin ? 'Sign In' : 'Create Account'}
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Reset Password</h3>
            <p className="text-gray-300 text-sm mb-4">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-400 text-sm">{error}</div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false)
                    setForgotPasswordEmail('')
                    setError('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}