import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PortfolioSearchBar from '../components/generic/PortfolioSearchBar.jsx'

// jsdom does not load the SCSS import; vitest handles it via the css transform.
describe('PortfolioSearchBar', () => {
    it('renders an accessible search input', () => {
        render(<PortfolioSearchBar value="" onChange={() => {}} onClear={() => {}} />)
        const input = screen.getByRole('textbox', {
            name: /search projects by title, tag, or description/i,
        })
        expect(input).toBeInTheDocument()
    })

    it('calls onChange with the typed character', async () => {
        const onChange = vi.fn()
        render(<PortfolioSearchBar value="" onChange={onChange} onClear={() => {}} />)
        await userEvent.type(screen.getByRole('textbox'), 'r')
        expect(onChange).toHaveBeenCalledWith('r')
    })

    it('hides the clear button when value is empty', () => {
        render(<PortfolioSearchBar value="" onChange={() => {}} onClear={() => {}} />)
        expect(screen.queryByRole('button', { name: /clear search/i })).toBeNull()
    })

    it('shows the clear button and fires onClear when there is a value', async () => {
        const onClear = vi.fn()
        render(<PortfolioSearchBar value="react" onChange={() => {}} onClear={onClear} />)
        const clearBtn = screen.getByRole('button', { name: /clear search/i })
        expect(clearBtn).toBeInTheDocument()
        await userEvent.click(clearBtn)
        expect(onClear).toHaveBeenCalledTimes(1)
    })

    it('reflects the controlled value prop', () => {
        render(<PortfolioSearchBar value="docker" onChange={() => {}} onClear={() => {}} />)
        expect(screen.getByRole('textbox')).toHaveValue('docker')
    })
})
