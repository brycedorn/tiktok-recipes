<script>
	export let videos;
	export let tags;
	export let filtersExpanded = false;
	export let filteredTags = [];

	// Keep immutable version of videos in memory
	export let videosImm = [...videos];

	function filterVideos() {
		let videosMut = [...videosImm];

		if (filteredTags.length > 0) {
			videosMut = videosMut.filter(video => video.tags.some(tag => filteredTags.includes(tag)));
		}

		videos = videosMut;
	}

	function handleTagClick(tag) {
		let newFilteredTags = [...filteredTags];
		
		if (filteredTags.includes(tag)) {
			newFilteredTags = filteredTags.filter(tag => tag !== tag);
		} else {
			newFilteredTags = [...filteredTags, tag];
		}
		
		filteredTags = newFilteredTags;

		filterVideos();
	}
	
	function toggleFilters() {
		filtersExpanded = !filtersExpanded;
	}

	// TODO: this doesn't reset checkbox state ??
	function resetFilters() {
		filteredTags = [];
		videos = [...videosImm];
	}
</script>

<style>
	h1 {
		margin-top: 20px;
	}
	footer {
		text-align: center;
	}
	.tag:hover, .tag:active {
		text-decoration: none;
	}
	
	.tag.selected {
		color: #fff;
		background: #5755d9;
		border: #4b48d6 solid 1px;
	}
	.hashtag {
		margin-right: 1px;
	}
	.tags {
		max-height: 60px;
		transition: max-height 250ms ease;
		word-wrap: break-word;
		overflow: hidden;
	}
	.tags.expanded {
		max-height: 1000px;
	}
	.title {
		background: rgba(0,0,0,0.5);
		border-radius: 8px;
		word-wrap: break-word;
		max-width: 230px;
	}
	ul {
		flex-wrap: wrap;
		list-style-type: none;
		margin-top: 30px;
	}
	li {
		margin: 2px 6px;
	}
	li img, li div { 
		border-radius: 8px; 
	}
	img {
		max-width: 250px;
	}
	footer {
		margin-top: 80px;
	}
</style>

<div class="container">
	<div class="columns">
		<div class="column col-1" />
		<div class="column col-10">
			<div class="hero hero-sm">
				<h1>TikTok Recipes 🍱</h1>
				<p>Organizing recipes I've come across so I can make them!</p>
			</div>
			<div class="tags mx-1 {filtersExpanded ? 'expanded' : ''}">
				Tags:
				{#each filteredTags as tag}
					<a href={null} class="tag chip c-hand m-1 {filteredTags.includes(tag) ? 'selected' : ''}" on:click={() => handleTagClick(tag)}>
						<span class="hashtag">#</span>
						{tag}
						<span href={null} class="btn btn-clear" aria-label="Close" role="button" on:click={() => handleTagClick(tag)} />
					</a>
				{/each}
				{#each tags as tag}
					{#if !filteredTags.includes(tag)}
						<a href={null} class="tag chip c-hand m-1" on:click={() => handleTagClick(tag)}>
							<span class="hashtag">#</span>
							{tag}
						</a>
					{/if}
				{/each}
			</div>
			<div class="col-2 btn-group btn-group-block my-2 py-2">
				<a class="btn btn-primary" href={null} on:click={toggleFilters}>{filtersExpanded ? 'Hide' : 'Show'} More {filtersExpanded ? '🔼' : '🔽'}</a>
				<a class="btn btn-default {filteredTags === [] ? '' : 'badge'}" data-badge={filteredTags.length || null} href={null} on:click={resetFilters}>Clear</a>
			</div>
		</div>
		<div class="column col-1" />
		<div class="column col-2 col-md-1" />
		<div class="column col-8 col-md-10 col-sm-12">
		<ul class="d-flex">
			{#each videos as video}
				<a href={`https://tiktok.com/${video.url}`} target="_blank">
					<li class="parallax c-hand py-2 px-1">
						<div class="parallax-top-left" tabindex="-1"></div>
						<div class="parallax-top-right" tabindex="-2"></div>
						<div class="parallax-bottom-left" tabindex="-3"></div>
						<div class="parallax-bottom-right" tabindex="-4"></div>
						<div class="parallax-content">
							<div class="parallax-front d-flex title-wrap">
								<div class="title">
									<h4 class="p-2">{video.title}</h4>
									<h6 class="video-tags">{video.tags.map(tag => `#${tag}`).join(' ')}</h6>
								</div>
							</div>
							<a class="parallax-back" href={video.meta.cite}>
								<img class="img-responsive rounded" src={video.meta.thumbnail_url} alt={video.meta.title} />
							</a>
						</div>
					</li>
				</a>
			{/each}
		</ul>
		</div>
		<div class="column col-2 col-md-1" />
	</div>
	<footer>
		<p>
			Created with ❤️ by <a href="https://bryce.io">bryce</a> in <a href="https://svelte.dev/">Svelte</a>. View <a href="https://github.com/brycedorn/tiktok-recipes">source</a>.
		</p>
	</footer>
</div>