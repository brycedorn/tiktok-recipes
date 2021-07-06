const fs = require('fs');
const fetch = require('node-fetch');

const oembedURL = 'https://www.tiktok.com/oembed?url=https://www.tiktok.com/';
const outputFilename = 'metadata.json';
const inputFilename = 'tiktoks.txt';

async function fetchData(video) {
	return fetch(`${oembedURL}/${video}`)
		.then(res => res.json())
		.then(json => ({
			meta: json,
			tags: getTags(json.title),
			title: getTitle(json.title),
			url: video
		}))
		.catch(err => console.log(err));
}

function getTags(title) {
	return title ? title.split(' ').filter(word => word[0] === '#').map(word => word.slice(1)) : [];
}

function getTitle(title) {
	return title ? title.split(' ').filter(word => word[0] !== '#').join(' ') : '';
}

async function fetchAndSaveMetadata(videos) {
	console.log(`Fetching metadata for ${videos.length} videos...`);
	const promises = videos.map(video => fetchData(video));
	const metadata = await Promise.all(promises);

	// aggregate tags
	const allTags = metadata.reduce((acc, curr) => {
		acc = new Set([...acc, ...curr.tags]);
		return acc;
	}, []);

	fs.writeFile(outputFilename, JSON.stringify({ videos: metadata, tags: [...allTags].sort() }), function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log(`Fetch complete & saved in ${outputFilename}`);
		}
	});
}

fs.readFile(inputFilename, 'utf8' , (err, data) => {
	if (err) {
		console.error(err);
		return;
	} else {
		fetchAndSaveMetadata(data.split('\n'));
	}
});