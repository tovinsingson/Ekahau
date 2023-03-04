<?php
use Lean\Load;
?>

<div data-molecule="search/algolia-instantsearch" id="ais-wrapper" class="items-start columns">
	<aside id="ais-facets" class="w-4/12 px-3 lg:px-4">
		<div class="ais-facets-wrapper bg-white shadow-lg border border-solid border-gray-200 p-6 pb-3 rounded-lg max-w-256px">
			<h6 class="standard-headings mb-6">Categories</h6>
			<div class="mb-6" id="facet-post-types"></div>
		</div>
	</aside>
	<main id="ais-main" class="lg:w-6/12 px-3 lg:px-4" id="main">
		<div id="algolia-input-search" class="search mb-16">
			<div id="algolia-stats" class="relative"></div>
		</div>
		<div id="algolia-hits" class="mb-12"></div>
		<div id="algolia-pagination" class="mb-12"></div>
	</main>
</div>

<script type="text/html" id="tmpl-instantsearch-hit">
	<article itemtype="http://schema.org/Article" class="mb-4 lg:mb-12">
		<div class="ais-hits--content">
			<# if ( data.post_type_label ) { #>
			<h6 class="text-sm text-gray-600 tracking-wide font-semibold inline-block mb-4">{{{data.post_type_label}}}</h6>
			<# } #>
			<h5 class="standard-headings mb-4" itemprop="name headline"><a href="{{ data.permalink }}" title="{{ data.post_title }}" itemprop="url">{{{ data._highlightResult.post_title.value }}}</a></h5>
			<p class="excerpt font-medium mb-4">
				<# if ( data._snippetResult['content'] ) { #>
				<span class="suggestion-post-content">{{{ data._snippetResult['content'].value }}}</span>
				<# } #>
			</p>
			<a class="text-primary-800 text-sm tracking-wide font-semibold" href="{{ data.permalink }}" title="Learn more about {{ data.post_title }}" itemprop="url">Learn more -></a>
		</div>
		<div class="ais-clearfix"></div>
	</article>
</script>
