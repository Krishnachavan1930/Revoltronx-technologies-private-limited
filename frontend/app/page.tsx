'use client'

import { useState } from 'react'
import axios from 'axios'

interface SearchResult {
  type: 'youtube' | 'web'
  title: string
  link: string
  views?: number
  likes?: number
  snippet?: string
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:3001/search', { query })
      setResults(response.data)
    } catch (error) {
      console.error('Error searching:', error)
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Function</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-orange-500 text-white p-2 rounded">
          Search
        </button>
      </form>
      {loading && <p>Loading...</p>}
      <ul>
        {results.map((result, index) => (
          <li key={index} className="mb-2">
            <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {result.title}
            </a>
            {result.type === 'youtube' && <span className="ml-2 text-sm text-gray-500">(YouTube)</span>}
            {result.type === 'web' && result.snippet && <p className="text-sm text-gray-700">{result.snippet}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}