import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Orbit, LogIn } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@senlyzer.io')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin')
      return
    }
    setError('')
    navigate('/overview')
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[hsl(var(--background))]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_14%_8%,hsla(141,74%,46%,0.16),transparent_30rem),radial-gradient(circle_at_86%_12%,hsla(72,88%,58%,0.1),transparent_28rem),linear-gradient(135deg,hsla(150,26%,10%,0.98),hsla(230,18%,7%,0.98))]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-8 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl">
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="grid size-14 place-items-center rounded-2xl bg-[linear-gradient(135deg,hsl(var(--brand)),hsl(var(--accent)))] text-zinc-950 shadow-lg shadow-emerald-950/30">
              <Orbit size={24} strokeWidth={2.4} />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold tracking-[0.2em] text-lime-100">SC</p>
              <h1 className="text-xl font-semibold text-white">Senlyzer Campaign</h1>
              <p className="mt-1 text-sm text-zinc-400">Đăng nhập để tiếp tục</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-200">
                Email hoặc tên đăng nhập
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@senlyzer.io"
                className="w-full rounded-xl border border-white/10 bg-zinc-950/55 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-emerald-300/60 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-zinc-200">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-zinc-950/55 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-emerald-300/60 focus:outline-none"
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-rose-400">{error}</p>
            )}

            <button
              type="submit"
              className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--brand))] font-semibold text-zinc-950 shadow-lg shadow-emerald-950/30 transition hover:brightness-110"
            >
              <LogIn className="size-4" />
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
