import { matchSolution } from '../src/knowledge/solutionMatcher'

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { query } = req.body ?? {}

  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'query is required' })
  }

  const result = matchSolution(query.trim())

  // TODO: log to posthog/analytics { query, matchedId: result.matchedId }

  return res.status(200).json({
    answer: result.body,
    capabilities: result.tags,
    matchedUseCase: result.matchedId,
    source: 'rules',
  })
}
