import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiZap, FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi'
import useAuth from '../../hooks/useAuth'
import Button from '../../components/common/Button'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Invalid credentials.')
    } finally { setLoading(false) }
  }

  const set = f => e => {
    setForm(p => ({ ...p, [f]: e.target.value }))
    if (errors[f]) setErrors(p => ({ ...p, [f]: '' }))
  }

  const fillDemo = () => setForm({ email: 'admin@test.com', password: 'admin123' })

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-950 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-violet-900/50">
            <FiZap size={28} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">TaskFlow</h1>
          <p className="text-gray-400 text-lg max-w-xs leading-relaxed">
            Manage your team's work in one beautiful workspace.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 text-left">
            {[
              { n: '3+', l: 'Team Members' },
              { n: '5+', l: 'Sample Tasks' },
              { n: '2',  l: 'Projects' },
              { n: '∞',  l: 'Possibilities' },
            ].map(({ n, l }) => (
              <div key={l} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="text-2xl font-extrabold text-white">{n}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <FiZap size={18} className="text-white" />
            </div>
            <span className="text-xl font-extrabold text-gray-900">TaskFlow</span>
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-400 text-sm mb-8">Sign in to your workspace</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com"
                  className={`input-field pl-10 ${errors.email ? '!border-red-400 !bg-red-50' : ''}`} />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-500">⚠ {errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')}
                  placeholder="••••••••"
                  className={`input-field pl-10 pr-10 ${errors.password ? '!border-red-400 !bg-red-50' : ''}`} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-500">⚠ {errors.password}</p>}
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              Sign In
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-700 mb-1">🔑 Demo Credentials</p>
                <p className="text-xs text-amber-600 font-mono">admin@test.com / admin123</p>
              </div>
              <button onClick={fillDemo}
                className="text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-colors">
                Fill
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-violet-600 font-semibold hover:text-violet-700">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
