/**
 * Filters portfolio items by search query.
 * Matches against title, tags, and description (case-insensitive).
 */
export function filterPortfolioItems(items, query) {
    if (!query || !query.trim()) return items
    const q = query.toLowerCase().trim()
    return items.filter(item => {
        const title = (item.locales?.title || item.placeholder || '').toLowerCase()
        const text = (item.locales?.text || '').toLowerCase()
        const tags = (item.locales?.tags || []).map(t => t.toLowerCase()).join(' ')
        return title.includes(q) || text.includes(q) || tags.includes(q)
    })
}
