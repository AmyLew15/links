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
	// let channelDescription = document.getElementById('channel-description')
	// let channelCount = document.getElementById('channel-count')
	// let channelLink = document.getElementById('channel-link')

	// Then set their content/attributes to our data:
	channelTitle.innerHTML = data.title
	// channelDescription.innerHTML = window.markdownit().render(data.metadata.description) // Converts Markdown → HTML
	// channelCount.innerHTML = data.length
	// channelLink.href = `https://www.are.na/channel/${channelSlug}`
}



// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.getElementById('channel-blocks')
	
	// Links!
	if (block.class == 'Link') {
		
		let linkItem =
		`
		<li>
			<img src="${block.image.original.url}">
			<h3 class="block-title">${block.title}</h3>
		</li>
		`
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
		
	}
	
	// Images!
	else if (block.class == 'Image') {

		let imageItem =
			`
			<li class="image-block">
				<img src="${block.image.original.url}">
				<h3 class="block-title">${block.title}</h3>
			</li>
			`

		channelBlocks.insertAdjacentHTML('beforeend', imageItem)

			}

	// Text!
	else if (block.class == 'Text') {

		let textItem =
			`
			<li class="text-block">
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
			// …still up to you, but we’ll give you the `video` element:
			let videoItem =
				`
				<li class="video-block>
					<video controls src="${ block.attachment.url }"></video>
				</li>
				<h3 class="block-title">${block.title}</h3>
				`
			channelBlocks.insertAdjacentHTML('beforeend', videoItem)
			// More on video, like the `autoplay` attribute:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
		}

		// Uploaded PDFs!
		else if (attachment.includes('pdf')) {

			console.log("pdf", block)

			let PdfItem =
				`
				<li>
					<figure class="pdf-block">
						<img src="${ block.image.thumb.url }">
						<h3 class="block-title">${ block.title }</h3>
					</figure>
				</li>
				`

		channelBlocks.insertAdjacentHTML('beforeend', PdfItem)	

		}

		// Uploaded audio!
		else if (attachment.includes('audio')) {
			let audioItem =
				`
				<li class="audio-block">
					<picture id="thumbnail">
						<img src="${block.image.original.url}">
					</picture>
					<audio controls src="${block.attachment.url}"></audio>
					<h3 class="block-title">${ block.title }</h3>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', audioItem)
			// More on audio: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio

		}

	}

		 // Linked Media (YouTube)
		 else if (block.class == 'Media') {
			let embed = block.embed.type
	
			// Linked video !
			if (embed.includes('video')) {
				// Extract the YouTube thumbnail (if it's a YouTube link)
				let youtubeId = block.embed.html.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
				//let thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId[1]}/0.jpg` : ''; // Extracting the thumbnail
	
				//let linkedVideoItem = `
				//<li>
					//<img src="${thumbnailUrl}" alt="Video Thumbnail" class="video-thumbnail">
					//${block.embed.html}
					//<h3 class="block-title">${block.title}</h3>
				//</li>`
				//channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem)
					// More on iframe: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
			}
		}
}



// It‘s always good to credit your work:
// let renderUser = (user, container) => { // You can have multiple arguments for a function!
// 	let userAddress =
// 		`
// 		<address>
// 			<img src="${ user.avatar_image.display }">
// 			<h3>${ user.first_name }</h3>
// 			<p><a href="https://are.na/${ user.slug }">Are.na profile ↗</a></p>
// 		</address>
// 		`
// 	container.insertAdjacentHTML('beforeend', userAddress)
// }



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

		// Also display the owner and collaborators:
		// let channelUsers = document.getElementById('channel-users') // Show them together
		// data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))
		// renderUser(data.user, channelUsers)
	})