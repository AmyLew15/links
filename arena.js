// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)

// Okay, Are.na stuff!
let channelSlug = 'liminality-in-life' // The “slug” is just the end of the URL

// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (data) => {
	// Target some elements in your HTML:
	console.log("block", data.contents[11]);
	let channelTitle = document.getElementById('channel-title')
	let channelCount = document.getElementById('channel-count')

	// Then set their content/attributes to our data:
	channelTitle.innerHTML = data.title
	// channelDescription.innerHTML = window.markdownit().render(data.metadata.description) // Converts Markdown → HTML
	channelCount.innerHTML = data.length
	// channelLink.href = `https://www.are.na/channel/${channelSlug}`
}

// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.getElementById('channel-blocks')

	// Links!
	if (block.class == 'Link') {
		let linkItem = `
		<li class="block link-block">
			<img src="${block.image.original.url}">
			<h3 class="block-title">${block.title}</h3>
		</li>
		`
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
	}

	// Images!
	else if (block.class == 'Image') {
		let imageItem = `
		<li class="block image-block">
			<img src="${block.image.original.url}">
			<h3 class="block-title">${block.title}</h3>
		</li>
		`
		channelBlocks.insertAdjacentHTML('beforeend', imageItem)
	}

	// Text!
	else if (block.class == 'Text') {
		let textItem = `
		<li class="block text-block">
			<p>${block.content}</p>
			<h3 class="block-title">${block.title}</h3>
		</li>
		`
		channelBlocks.insertAdjacentHTML('beforeend', textItem)
	}

	// Uploaded (not linked) media…
	else if (block.class == 'Attachment') {
		let attachment = block.attachment.content_type // Save us some repetition

		// Uploaded videos!
		if (attachment.includes('video')) {
			let videoItem = `
			<li class="block video-block">
				<video controls src="${block.attachment.url}"></video>
				<h3 class="block-title">${block.title}</h3>
			</li>
			`
			channelBlocks.insertAdjacentHTML('beforeend', videoItem)
		}

		// Uploaded PDFs!
		else if (attachment.includes('pdf')) {
			let PdfItem = `
			<li>
				<figure class="pdf-block">
					<img src="${block.image.thumb.url}">
					<h3 class="block-title">${block.title}</h3>
				</figure>
			</li>
			`
			channelBlocks.insertAdjacentHTML('beforeend', PdfItem)
		}

		// Uploaded audio!
		else if (attachment.includes('audio')) {
			let audioItem = `
			<li class="block audio-block">
				<picture id="thumbnail">
					<img src="${block.image.original.url}">
				</picture>
				<h3 class="block-title">${block.title}</h3>
					<audio controls src="${block.attachment.url}"></audio>
			</li>
			`
			channelBlocks.insertAdjacentHTML('beforeend', audioItem)
		}
	}

	// Linked Media (YouTube)
	else if (block.class == 'Media') {
		let embed = block.embed.type

		// Linked video!
		if (embed.includes('video')) {
			// Extract the YouTube thumbnail (if it's a YouTube link)
			let youtubeId = block.embed.html.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
			// You can extract and display the YouTube thumbnail if needed
		}
	}
}

// Filter the blocks by type
let filterBlocks = (type) => {
	// Get all block items
	let allBlocks = document.querySelectorAll('.block-grid li');

	// Loop through each block
	allBlocks.forEach(block => {
		// Check if the block's class contains the type and display accordingly
		if (type === 'all') {
			block.style.display = 'list-item'; // Show all blocks
		} else if (block.classList.contains(type)) {
			block.style.display = 'list-item'; // Show block if it matches the type
		} else {
			block.style.display = 'none'; // Hide the block if it does not match
		}
	});
}

// Event listener for the 'All' button
document.getElementById('show-all-button').addEventListener('click', () => {
	filterBlocks('all'); 
});

// Event listener for the 'Images' button
document.getElementById('show-image-button').addEventListener('click', () => {
	filterBlocks('image-block'); 
});

// Event listener for the 'Videos' button
document.getElementById('show-video-button').addEventListener('click', () => {
	filterBlocks('video-block'); 
});

// Event listener for the 'Texts' button
document.getElementById('show-link-button').addEventListener('click', () => {
	filterBlocks('text-block');
});

// Event listener for the 'Sounds' button
document.getElementById('show-audio-button').addEventListener('click', () => {
	filterBlocks('audio-block');
});

// Now that we have said what we can do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data
		console.log("data", data) // Always good to check your response!
		placeChannelInfo(data) // Pass the data to the first function

		// Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
		data.contents.reverse().forEach((block) => {
			console.log(block) // The data for a single block
			renderBlock(block) // Pass the single block data to the render function
		})
	})