/*eslint max-len: ["error", { "ignoreStrings": true }]*/
/* global _, wp, algolia, instantsearch, algoliasearch */

/**
* Algolia InstantSearch results.
*
* @param {Element} aisWrapper - The Algolia Instantsearch results wrapper.
*/
export default function algoliaInstantSearch ( aisWrapper ) {
  if ( !aisWrapper || !aisWrapper.querySelector( '#algolia-input-search' ) ) {
    return
  }
  
  if ( 'undefined' === algolia.indices.searchable_posts && document.querySelector( '.admin-bar' ) ) {
    // eslint-disable-next-line no-alert
    alert( 'It looks like you haven\'t indexed the searchable posts index. Please head to the Indexing page of the Algolia Search plugin and index it.' )
  }
  
  /* Instantiate instantsearch.js */
  const search = instantsearch({
    indexName: algolia.indices.searchable_posts.name,
    searchClient: algoliasearch(
      algolia.application_id,
      algolia.search_api_key
    ),
    urlSync: {
      mapping: {'q': 's'},
      trackedParameters: ['query']
    },
    searchParameters: {
      facetingAfterDistinct: true,
      
    }
  })
  
  /* Search box widget */
  search.addWidget(
    instantsearch.widgets.searchBox({
      container: '#algolia-input-search',
      placeholder: 'Search',
      showReset: false,
      showSubmit: false,

      // wrapInput: false,
      poweredBy: algolia.powered_by_disabled,
      cssClasses: {
        input: 'input-text'
      },
    })
  )
  
  /* Stats widget */
  search.addWidget(
    instantsearch.widgets.stats({
      container: '#algolia-stats'
    })
  )
    
  /* Hits widget */
  search.addWidget(
    instantsearch.widgets.hits({
      container: '#algolia-hits',
      hitsPerPage: 10,
      templates: {
        empty: 'No results were found for "<strong>{{query}}</strong>".',
        item: wp.template( 'instantsearch-hit' )
      },
      transformData: {
        item: hit => {
          
          /**
          * Replace highlights recursive.
          *
          * @param {Object} item - The item with strings to replace.
          *
          * @returns {Object} The filtered item.
          */
          function replaceHighlightsRecursive ( item ) {
            if ( item instanceof Object && item.hasOwnProperty( 'value' ) ) {
              item.value = _.escape( item.value )
              item.value = item.value.replace( /__ais-highlight__/g, '<em>' ).replace( /__\/ais-highlight__/g, '</em>' )
            } else {
              for ( var key in item ) {
                item[key] = replaceHighlightsRecursive( item[key])
              }
            }
            return item
          }
          
          // eslint-disable-next-line max-len
          hit._highlightResult = replaceHighlightsRecursive( hit._highlightResult )
          hit._snippetResult = replaceHighlightsRecursive( hit._snippetResult )
          
          return hit
        }
      }
    })
  )
      
  /* Pagination widget */
  search.addWidget(
    instantsearch.widgets.pagination({
      container: '#algolia-pagination',
      cssClasses: {
        item: 'p-0 -ml-px',
        link: 'block border border-solid border-gray-300 py-2 px-4 font-semibold',
        selectedItem: 'text-primary-800',
      },
    })
  )
        
  /* Post types refinement widget */
  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#facet-post-types',
      attribute: 'post_type_label',
      operator: 'or',
      sortBy: ['isRefined:desc', 'count:desc', 'name:asc'],
      limit: 15,
      cssClasses : {
        item: 'mb-3',
        checkbox: 'text-base',
        label: 'text-sm tracking-wide font-semibold',
        count: 'bg-primary-100 rounded py-px px-6px',
      },
    })
  )
          
  /* Start */
  search.start()
  
  const algoliaInputSearch = aisWrapper.querySelector( '#algolia-input-search input' )
  algoliaInputSearch.setAttribute( 'type', 'search' )
  algoliaInputSearch.select()
}