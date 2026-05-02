import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import Spinner from '../components/Spinner'

export default function History() {
  const [sessions, setSessions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await API.get('/interview/history')
        setSessions(response.data)
      } catch (err) {
        setError('Failed to load interview history.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // Helper to color the score badge
  const getScoreColor = (score) => {
    if (score >= 8) return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    if (score >= 5) return 'bg-amber-100 text-amber-800 border-amber-200'
    return 'bg-rose-100 text-rose-800 border-rose-200'
  }

  if (isLoading) {
    return <Spinner message="Loading your interview history..." />
  }

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <div className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Interview History
        </h1>
        <p className="mt-2 text-slate-500">
          Review your past mock interviews and track your progress.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100 mb-6">
          {error}
        </div>
      )}

      {sessions.length === 0 && !error ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-slate-900">No interviews yet</h3>
          <p className="mt-2 text-sm text-slate-500">Get started by practicing your first mock interview.</p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start an Interview
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {sessions.map((session) => (
            <div key={session._id} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-lg">
              
              {/* Card Header (Clickable) */}
              <div 
                className="p-6 cursor-pointer flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                onClick={() => toggleExpand(session._id)}
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{session.jobRole}</h3>
                  <div className="mt-1 flex items-center gap-4 text-sm text-slate-500">
                    <span>{new Date(session.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span>•</span>
                    <span className="font-medium text-indigo-600">{session.answers.length} / {session.questions.length} questions answered</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <svg className={`h-6 w-6 text-slate-400 transform transition-transform duration-200 ${expandedId === session._id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expandable Content */}
              {expandedId === session._id && (
                <div className="border-t border-slate-200 bg-slate-50 p-6 space-y-8 animate-fade-in-up">
                  {session.answers.length === 0 ? (
                    <p className="text-slate-500 italic">No questions were answered in this session.</p>
                  ) : (
                    session.answers.map((item, idx) => {
                      // Parse the stringified feedback object safely
                      let parsedFeedback = null;
                      try {
                        parsedFeedback = JSON.parse(item.feedback)
                      } catch (e) {
                        parsedFeedback = { score: '?', feedback: 'Could not parse feedback.', improvements: [] }
                      }

                      return (
                        <div key={item._id || idx} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                          {/* Question */}
                          <div className="mb-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question {idx + 1}</span>
                            <h4 className="text-lg font-semibold text-slate-900 mt-1">{item.question}</h4>
                          </div>

                          {/* Answer */}
                          <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Your Answer</span>
                            <p className="text-slate-700 whitespace-pre-wrap">{item.answer}</p>
                          </div>

                          {/* Feedback */}
                          {parsedFeedback && (
                            <div className="border-t border-slate-100 pt-6">
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Evaluation</span>
                                <div className={`px-3 py-1 rounded-full border text-sm font-bold ${getScoreColor(parsedFeedback.score)}`}>
                                  Score: {parsedFeedback.score} / 10
                                </div>
                              </div>
                              
                              <p className="text-slate-800 leading-relaxed mb-4">
                                {parsedFeedback.feedback}
                              </p>

                              {parsedFeedback.improvements && parsedFeedback.improvements.length > 0 && (
                                <div>
                                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Areas for Improvement</span>
                                  <ul className="list-disc pl-5 space-y-1 text-slate-700 text-sm">
                                    {parsedFeedback.improvements.map((imp, i) => (
                                      <li key={i}>{imp}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
