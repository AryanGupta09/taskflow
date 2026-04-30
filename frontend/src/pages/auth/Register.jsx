import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiZap, FiEye, FiEyeOff } from 'react-icons/fi'
import useAuth from '../../hooks/useAuth'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import toast from 'react-hot-toast'

const strength = pw => {
  if (!pw) return null
  let s = 0
  if (pw.length >= 6) s++
  if (pw.length >= 10) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  if (s <= 1) return { label: 'Weak',   color: 'bg-red-500',     w: 'w-1/4', tc: 'text-red-500'     }
  if (s <= 3) return { label: 'Medium', color: 'bg-amber-400',   w: 'w-2/4', tc: 'text-amber-600'   }
  return              { label: 'Strong', color: 'bg-emerald-500', w: 'w-full',tc: 'text-emerald-600' }
}

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'', role:'member' })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [showCf, setShowCf] = useState(false)
  const [loading, setLoading] = useState(false)
  const pw = strength(form.password)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.role)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Registration failed.')
    } finally { setLoading(false) }
  }

  const set = f => e => {
    setForm(p => ({ ...p, [f]: e.target.value }))
    if (errors[f]) setErrors(p => ({ ...p, [f]: '' }))
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <FiZap size={18} className="text-white" />
          </div>
          <span className="text-xl font-extrabold text-gray-900">TaskFlow</span>
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Create account</h2>
        <p className="text-gray-400 text-sm mb-7">Join your team workspace</p>

        <div className="card p-7 shadow-lg shadow-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={set('name')} error={errors.name} placeholder="John Doe" required />
            <Input label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" required />

            {/* Password */}
            <div>
              <label className="label">Password <span className="text-red-400">*</span></label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')}
                  placeholder="Min. 6 characters"
                  className={`input-field pr-10 ${errors.password ? '!border-red-400 !bg-red-50' : ''}`} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-500">⚠ {errors.password}</p>}
              {form.password && pw && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${pw.color} ${pw.w}`} />
                  </div>
                  <p className={`text-xs mt-1 font-semibold ${pw.tc}`}>{pw.label} password</p>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="label">Confirm Password <span className="text-red-400">*</span></label>
              <div className="relative">
                <input type={showCf ? 'text' : 'password'} value={form.confirm} onChange={set('confirm')}
                  placeholder="Repeat password"
                  className={`input-field pr-10 ${errors.confirm ? '!border-red-400 !bg-red-50' : ''}`} />
                <button type="button" onClick={() => setShowCf(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showCf ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {errors.confirm && <p className="mt-1.5 text-xs text-red-500">⚠ {errors.confirm}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="label">Role</label>
              <select value={form.role} onChange={set('role')} className="input-field">
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-600 font-semibold hover:text-violet-700">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
