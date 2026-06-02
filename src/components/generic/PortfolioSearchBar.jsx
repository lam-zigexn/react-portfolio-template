import "./PortfolioSearchBar.scss"
import React, {useRef} from 'react'

function PortfolioSearchBar({ value, onChange, onClear }) {
    const inputRef = useRef(null)

    const handleClear = () => {
        onClear()
        inputRef.current?.focus()
    }

    return (
        <div className="portfolio-search-bar" role="search">
            <label htmlFor="portfolio-search-input" className="visually-hidden">
                Search projects by title, tag, or description
            </label>
            <div className="portfolio-search-bar-inner">
                <i className="fa-solid fa-magnifying-glass portfolio-search-bar-icon" aria-hidden="true"/>
                <input
                    ref={inputRef}
                    id="portfolio-search-input"
                    type="text"
                    className="portfolio-search-bar-input"
                    placeholder="Search by title, tag, or description..."
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    aria-label="Search projects by title, tag, or description"
                    aria-controls="portfolio-items-region"
                />
                {value && (
                    <button
                        type="button"
                        className="portfolio-search-bar-clear"
                        onClick={handleClear}
                        aria-label="Clear search"
                    >
                        <i className="fa-solid fa-xmark" aria-hidden="true"/>
                    </button>
                )}
            </div>
        </div>
    )
}

export default PortfolioSearchBar
