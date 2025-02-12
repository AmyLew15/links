// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown

let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)

// https://api.are.na/v2/channels/liminality-in-life

// Okay, Are.na stuff!
let channelSlug = 'liminality-in-life'



// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (data) => {
	// Target some elements in your HTML:
	let channelTitle = document.getElementById('channel-title')
	let channelDescription = document.querySelector('#channel-description')
	let channelCount = document.querySelector('#channel-count')
	let channelLink = document.querySelector('#channel-link')

	// Then set their content/attributes to our data:
	channelTitle.innerHTML = data.title
	channelDescription.innerHTML = window.markdownit().render(data.metadata.description) // Converts Markdown → HTML
	channelCount.innerHTML = data.length
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
}



// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.querySelector('#channel-blocks')

	// Links!
	if (block.class == 'Link') {
		let linkItem =
			`
			<div class="block">
					<img src="${ block.image.original.url }">
				<h3>${ block.title }</h3>

			<div class="overlay">
				<p>${block.title}</p>
				<p>${block.description}</p>
			</div>
			</div>

			`
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
		console.log('link')
	}

	// Images!
	else if (block.class == 'Image') {
		let imageitem=
		<div class="block"
			img src="${block.image.orginial.url}">
			<div class="overlay">
			<p>${block.title}</p>
			<p>${block.description}</p>
		</div>
		</div>
		`;

		channelBlocks.insertAdjacentHTML('beforeend', imageItem);;
	}

	// Text!
	else if (block.class == 'Text') {
		let textItem = `
		<div class="block">
			<p>${block.content}</p>
			<p>${block.description_html}</p>
		</div>
		`;
		channelBlocks.insertAdjacentHTML('beforeend', textItem);
		console.log('text')
	}

	// Uploaded (not linked) media…
	//else if (block.class == 'Attachment') {
		//let attachment = block.attachment.content_type // Save us some repetition

		// Uploaded videos!
		//if (attachment.includes('video')) {
			// …still up to you, but we’ll give you the `video` element:
			//let videoItem =
				//`
				//<li>
					//<p><em>Video</em></p>
					//<video controls src="${ block.attachment.url }"></video>
				//</li>
				//`
			//channelBlocks.insertAdjacentHTML('beforeend', videoItem)
			// More on video, like the `autoplay` attribute:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
		//}

		// Uploaded PDFs!
		//else if (attachment.includes('pdf')) {
			// …up to you!
		//}

		// Uploaded audio!
		//else if (attachment.includes('audio')) {
			// …still up to you, but here’s an `audio` element:
			//let audioItem =
				//`
				//<li>
					//<p><em>Audio</em></p>
					//<audio controls src="${ block.attachment.url }"></video>
				//</li>
				//`
			//channelBlocks.insertAdjacentHTML('beforeend', audioItem)
			// More on audio: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
		//}
	}

	// Linked media…
	else if (block.class == 'Media') {
		let embed = block.embed.type

		// Linked video!
		if (embed.includes('video')) {
			// …still up to you, but here’s an example `iframe` element:
			let linkedVideoItem =
				`
				<div class="block">
					${block.embed.html}
				</div>
				`
			channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem)
			// More on iframe: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
		}

		// Linked audio!
		else if (embed.includes('rich')) {
			let richItem =
				`
			<div class="block">
				<audio controls src="${block.rich.url}"></video>
			</div>
			`
			channelBlocks.insertAdjacentHTML('beforeend', richItem)
		}

		console.log('media')
	}

}



// It‘s always good to credit your work:
//let renderUser = (user, container) => { // You can have multiple arguments for a function!
//	let userAddress =
//		`
//		<address>
//			<img src="${ user.avatar_image.display }">
//			<h3>${ user.first_name }</h3>
//			<p><a href="https://are.na/${ user.slug }">Are.na profile ↗</a></p>
//		</address>
//		`
//	container.insertAdjacentHTML('beforeend', userAddress)
//}



// Now that we have said what we can do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data
		console.log("Data",data) // Always good to check your response!
		placeChannelInfo(data) // Pass the data to the first function

		// Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
		data.contents.reverse().forEach((block) => {
			//console.log(block) // The data for a single block
			renderBlock(block) // Pass the single block data to the render function
		})

		// Also display the owner and collaborators:
		//let channelUsers = document.querySelector('#channel-users') // Show them together
		//data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))
		//renderUser(data.user, channelUsers)
	})