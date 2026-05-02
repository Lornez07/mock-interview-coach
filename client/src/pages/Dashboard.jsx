import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import Spinner from '../components/Spinner'

export default function Dashboard() {
  const navigate = useNavigate()
  const [jobRole, setJobRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!jobRole.trim()) return

    setIsLoading(true)
    setError('')

    try {
      const response = await API.post('/interview/generate', { jobRole })
      
      // Save session info to localStorage so the Interview page can access it
      localStorage.setItem('sessionId', response.data.sessionId)
      localStorage.setItem('currentQuestions', JSON.stringify(response.data.questions))
      
      navigate('/interview')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to generate interview questions. Please try again.'
      )
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Welcome to your <span className="text-indigo-600">AI Coach</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Practice your interviewing skills with our advanced AI. Just tell us the job role you're applying for, and we'll generate customized technical and behavioral questions for you.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Start a New Interview</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="jobRole" className="block text-sm font-medium text-slate-700 mb-2">
              What job role are you interviewing for?
            </label>
            <input
              type="text"
              id="jobRole"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="e.g. Senior Frontend Developer"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 transition-shadow text-lg"
              required
              disabled={isLoading}
            />
            <p className="mt-2 text-sm text-slate-500">
              Be specific! (e.g. "React Native Mobile Developer" instead of just "Developer")
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !jobRole.trim()}
            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-lg shadow-md text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <Spinner inline message="Generating questions... (This takes a few seconds)" />
            ) : (
              'Start Interview'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
