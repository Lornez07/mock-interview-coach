import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import Spinner from '../components/Spinner'

export default function Interview() {
  const navigate = useNavigate()
  
  const [questions, setQuestions] = useState([])
  const [sessionId, setSessionId] = useState(null)
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState(null) // Holds { score, feedback, improvements }

  useEffect(() => {
    const storedQuestions = localStorage.getItem('currentQuestions')
    const storedSessionId = localStorage.getItem('sessionId')

    if (!storedQuestions || !storedSessionId) {
      // If we don't have session data, send them back to the dashboard
      navigate('/')
      return
    }

    setQuestions(JSON.parse(storedQuestions))
    setSessionId(storedSessionId)
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!answer.trim()) return

    setIsLoading(true)
    setError('')

    try {
      const response = await API.post('/interview/answer', {
        sessionId,
        question: questions[currentIndex],
        answer: answer
      })
      
      setFeedback(response.data)
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit answer. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    setFeedback(null)
    setAnswer('')
    setCurrentIndex((prev) => prev + 1)
  }

  const handleFinish = () => {
    // Clean up current session from localStorage
    localStorage.removeItem('currentQuestions')
    localStorage.removeItem('sessionId')
    navigate('/history')
  }

  if (questions.length === 0) {
    return null // Still loading from localStorage or redirecting
  }

  const isLastQuestion = currentIndex === questions.length - 1
  const currentQuestion = questions[currentIndex]

  // Helper to color the score badge
  const getScoreColor = (score) => {
    if (score >= 8) return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    if (score >= 5) return 'bg-amber-100 text-amber-800 border-amber-200'
    return 'bg-rose-100 text-rose-800 border-rose-200'
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Mock Interview
        </h1>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full font-semibold text-sm border border-indigo-100 shadow-sm">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 mb-8">
        <h2 className="text-xl font-bold text-slate-800 leading-relaxed">
          {currentQuestion}
        </h2>
      </div>

      {!feedback ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-slate-700 mb-2">
              Your Answer
            </label>
            <textarea
              id="answer"
              rows={8}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here as if you were speaking to the interviewer..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 transition-shadow resize-none"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !answer.trim()}
              className="inline-flex justify-center items-center py-3 px-8 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <Spinner inline message="Evaluating..." />
              ) : (
                'Submit Answer'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-inner animate-fade-in-up">
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
            <h3 className="text-2xl font-bold text-slate-900">AI Feedback</h3>
            <div className={`px-4 py-1.5 rounded-full border text-base font-bold shadow-sm ${getScoreColor(feedback.score)}`}>
              Score: {feedback.score} / 10
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Overall Feedback</h4>
              <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                {feedback.feedback}
              </p>
            </div>

            {feedback.improvements && feedback.improvements.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">How to Improve</h4>
                <ul className="list-disc pl-5 space-y-2 text-slate-800">
                  {feedback.improvements.map((improvement, idx) => (
                    <li key={idx} className="leading-relaxed">{improvement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            {!isLastQuestion ? (
              <button
                onClick={handleNext}
                className="inline-flex justify-center items-center py-3 px-8 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="inline-flex justify-center items-center py-3 px-8 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all"
              >
                Finish & View History
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
