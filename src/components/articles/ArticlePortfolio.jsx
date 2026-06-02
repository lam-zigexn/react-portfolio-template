import "./ArticlePortfolio.scss"
import React, {useEffect, useState} from 'react'
import Article from "/src/components/articles/base/Article.jsx"
import Transitionable from "/src/components/capabilities/Transitionable.jsx"
import {useViewport} from "/src/providers/ViewportProvider.jsx"
import {useConstants} from "/src/hooks/constants.js"
import AvatarView from "/src/components/generic/AvatarView.jsx"
import {Tag, Tags} from "/src/components/generic/Tags.jsx"
import ArticleItemPreviewMenu from "/src/components/articles/partials/ArticleItemPreviewMenu.jsx"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import PortfolioSearchBar from "/src/components/generic/PortfolioSearchBar.jsx"
import {filterPortfolioItems} from "/src/utils/portfolioSearch.js"

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {Number} id
 * @return {JSX.Element}
 * @constructor
 */
function ArticlePortfolio({ dataWrapper, id }) {
    const [selectedItemCategoryId, setSelectedItemCategoryId] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <Article id={dataWrapper.uniqueId}
                 type={Article.Types.SPACING_DEFAULT}
                 dataWrapper={dataWrapper}
                 className={`article-portfolio`}
                 selectedItemCategoryId={selectedItemCategoryId}
                 setSelectedItemCategoryId={setSelectedItemCategoryId}>
            <ArticlePortfolioItems dataWrapper={dataWrapper}
                                   selectedItemCategoryId={selectedItemCategoryId}
                                   searchQuery={searchQuery}
                                   setSearchQuery={setSearchQuery}/>
        </Article>
    )
}

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {String} selectedItemCategoryId
 * @param {String} searchQuery
 * @param {Function} setSearchQuery
 * @return {JSX.Element}
 * @constructor
 */
function ArticlePortfolioItems({ dataWrapper, selectedItemCategoryId, searchQuery, setSearchQuery }) {
    const constants = useConstants()
    const language = useLanguage()
    const viewport = useViewport()

    const [debouncedQuery, setDebouncedQuery] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    const filteredItems = dataWrapper.getOrderedItemsFilteredBy(selectedItemCategoryId)
    const customBreakpoint = viewport.getCustomBreakpoint(constants.SWIPER_BREAKPOINTS_FOR_THREE_SLIDES)

    const itemsPerRow = customBreakpoint?.slidesPerView || 1
    const itemsPerRowClass = `article-portfolio-items-${itemsPerRow}-per-row`

    const refreshFlag = dataWrapper.categories?.length ?
        selectedItemCategoryId + "-" + debouncedQuery + "-" + language.getSelectedLanguage()?.id :
        debouncedQuery + "-" + language.getSelectedLanguage()?.id

    const displayItems = filterPortfolioItems(filteredItems, debouncedQuery)

    const handleClear = () => {
        setSearchQuery('')
        setDebouncedQuery('')
    }

    const searchBar = (
        <>
            <PortfolioSearchBar value={searchQuery}
                                onChange={setSearchQuery}
                                onClear={handleClear}/>
            <div aria-live="polite"
                 aria-atomic="true"
                 className="visually-hidden">
                {debouncedQuery ? displayItems.length + (displayItems.length !== 1 ? ' projects' : ' project') + ' found' : ''}
            </div>
        </>
    )

    if (debouncedQuery && displayItems.length === 0) {
        return (
            <>
                {searchBar}
                <div className="portfolio-empty-state text-2"
                     role="status"
                     id="portfolio-items-region">
                    <p>No projects match "<strong>{debouncedQuery}</strong>".</p>
                    <button type="button"
                            className="btn portfolio-empty-state-reset"
                            onClick={handleClear}>
                        Clear search
                    </button>
                </div>
            </>
        )
    }

    if(dataWrapper.categories?.length) {
        return (
            <>
                {searchBar}
                <div id="portfolio-items-region">
                    <Transitionable id={dataWrapper.uniqueId}
                                    refreshFlag={refreshFlag}
                                    delayBetweenItems={100}
                                    animation={Transitionable.Animations.POP}
                                    className={`article-portfolio-items ${itemsPerRowClass}`}>
                        {displayItems.map((itemWrapper, key) => (
                            <ArticlePortfolioItem itemWrapper={itemWrapper}
                                                  key={key}/>
                        ))}
                    </Transitionable>
                </div>
            </>
        )
    }
    else {
        return (
            <>
                {searchBar}
                <div id="portfolio-items-region"
                     className={`article-portfolio-items ${itemsPerRowClass} mb-3 mb-lg-2`}>
                    {displayItems.map((itemWrapper, key) => (
                        <ArticlePortfolioItem itemWrapper={itemWrapper}
                                              key={key}/>
                    ))}
                </div>
            </>
        )
    }
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @return {JSX.Element}
 * @constructor
 */
function ArticlePortfolioItem({ itemWrapper }) {
    return (
        <div className={`article-portfolio-item`}>
            <AvatarView src={itemWrapper.img}
                        faIcon={itemWrapper.faIcon}
                        style={itemWrapper.faIconStyle}
                        alt={itemWrapper.imageAlt}
                        className={`article-portfolio-item-avatar`}/>

            <ArticlePortfolioItemTitle itemWrapper={itemWrapper}/>
            <ArticlePortfolioItemBody itemWrapper={itemWrapper}/>
            <ArticlePortfolioItemFooter itemWrapper={itemWrapper}/>
        </div>
    )
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @return {JSX.Element}
 * @constructor
 */
function ArticlePortfolioItemTitle({ itemWrapper }) {
    return (
        <div className={`article-portfolio-item-title`}>
            <h5 className={`article-portfolio-item-title-main`}
                dangerouslySetInnerHTML={{__html: itemWrapper.locales.title || itemWrapper.placeholder}}/>

            <div className={`article-portfolio-item-title-category text-2`}
                 dangerouslySetInnerHTML={{__html: itemWrapper.category?.label }}/>
        </div>
    )
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @return {JSX.Element}
 * @constructor
 */
function ArticlePortfolioItemBody({ itemWrapper }) {
    return (
        <div className={`article-portfolio-item-body`}>
            <Tags className={`article-portfolio-item-body-tags`}>
                {itemWrapper.locales.tags && Boolean(itemWrapper.locales.tags.length) && itemWrapper.locales.tags.map((tag, key) => (
                    <Tag key={key}
                         text={tag}
                         variant={Tag.Variants.DARK}
                         className={`article-portfolio-item-body-tag text-1`}/>
                ))}
            </Tags>

            <div className={`article-portfolio-item-body-description text-2`}
                 dangerouslySetInnerHTML={{__html: itemWrapper.locales.text}}/>
        </div>
    )
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @return {JSX.Element}
 * @constructor
 */
function ArticlePortfolioItemFooter({ itemWrapper }) {
    const hasPreview = itemWrapper.preview
    const hasPreviewLinks = itemWrapper.preview?.hasLinks
    const hasScreenshotsOrVideo = itemWrapper.preview?.hasScreenshotsOrYoutubeVideo

    const previewMenuAvailable = hasPreview && (hasPreviewLinks || hasScreenshotsOrVideo)
    if(!previewMenuAvailable)
        return <></>

    return (
        <div className={`article-portfolio-item-footer`}>
            <ArticleItemPreviewMenu itemWrapper={itemWrapper}
                                    spaceBetween={true}
                                    className={`article-portfolio-item-footer-menu`}/>
        </div>
    )
}

export default ArticlePortfolio
