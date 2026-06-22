import { describe, it, expect } from 'vitest'
import { filterPortfolioItems } from '../utils/portfolioSearch.js'

const mockItems = [
    {
        locales: {
            title: 'Job Board Platform',
            text: 'Recruitment platform for posting job listings.',
            tags: ['React', 'Node.js', 'PostgreSQL'],
        },
    },
    {
        locales: {
            title: 'API Gateway Service',
            text: 'Microservice for routing and authentication.',
            tags: ['Node.js', 'Docker', 'AWS'],
        },
    },
    {
        locales: {
            title: 'HR Analytics Dashboard',
            text: 'Real-time recruitment metrics dashboard.',
            tags: ['React', 'TypeScript', 'Charts'],
        },
    },
]

describe('filterPortfolioItems', () => {
    it('returns all items when query is empty string', () => {
        expect(filterPortfolioItems(mockItems, '')).toHaveLength(3)
    })

    it('returns all items when query is null', () => {
        expect(filterPortfolioItems(mockItems, null)).toHaveLength(3)
    })

    it('filters by title (case-insensitive)', () => {
        const results = filterPortfolioItems(mockItems, 'job board')
        expect(results).toHaveLength(1)
        expect(results[0].locales.title).toBe('Job Board Platform')
    })

    it('filters by tag', () => {
        const results = filterPortfolioItems(mockItems, 'docker')
        expect(results).toHaveLength(1)
        expect(results[0].locales.title).toBe('API Gateway Service')
    })

    it('filters by description text', () => {
        const results = filterPortfolioItems(mockItems, 'recruitment')
        expect(results).toHaveLength(2)
    })

    it('returns empty array when nothing matches', () => {
        const results = filterPortfolioItems(mockItems, 'xyznotfound123')
        expect(results).toHaveLength(0)
    })

    it('search is case-insensitive for uppercase query', () => {
        const results = filterPortfolioItems(mockItems, 'REACT')
        expect(results).toHaveLength(2)
    })

    it('returns all items for a whitespace-only query', () => {
        expect(filterPortfolioItems(mockItems, '   ')).toHaveLength(3)
    })

    it('trims surrounding whitespace before matching', () => {
        const results = filterPortfolioItems(mockItems, '  docker  ')
        expect(results).toHaveLength(1)
        expect(results[0].locales.title).toBe('API Gateway Service')
    })

    it('matches partial substrings inside a word', () => {
        const results = filterPortfolioItems(mockItems, 'analyt')
        expect(results).toHaveLength(1)
        expect(results[0].locales.title).toBe('HR Analytics Dashboard')
    })

    it('falls back to placeholder when locales.title is absent', () => {
        const items = [{ placeholder: 'Secret Project', locales: {} }]
        const results = filterPortfolioItems(items, 'secret')
        expect(results).toHaveLength(1)
    })

    it('does not throw when an item has no locales at all', () => {
        const items = [{}, { locales: { title: 'Visible' } }]
        expect(() => filterPortfolioItems(items, 'visible')).not.toThrow()
        expect(filterPortfolioItems(items, 'visible')).toHaveLength(1)
    })

    it('does not mutate the original items array', () => {
        const copy = [...mockItems]
        filterPortfolioItems(mockItems, 'react')
        expect(mockItems).toEqual(copy)
    })
})
