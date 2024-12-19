document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "https://mediaupload.vercel.app/"; // API URL
    const portfolioItemsContainer = document.getElementById("portfolioItems");
    const searchInput = document.getElementById("search");
    const searchButton = document.getElementById("searchButton");

    // Fetch data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Store all portfolio items for easy access
            const allItems = data;

            // Function to construct the correct media URL
            function constructMediaUrl(mediaPath) {
                if (!mediaPath) {
                    console.warn("No media path provided, using placeholder image.");
                    return "placeholder.png"; // Fallback placeholder
                }

                // Check if mediaPath is already a full URL
                if (mediaPath.startsWith("http://") || mediaPath.startsWith("https://")) {
                    console.log("Full URL detected:", mediaPath);
                    return mediaPath;
                }

                // Construct the full URL for relative paths
                const fullUrl = `https://sqtwsliwqzyalzadsaeb.supabase.co/storage/v1/object/public/media/${mediaPath}`;
                console.log("Constructed Media URL:", fullUrl);
                return fullUrl;
            }

            // Display portfolio items initially
            function displayItems(items) {
                portfolioItemsContainer.innerHTML = ""; // Clear the container first
                items.forEach(item => {
                    const portfolioItem = document.createElement("div");
                    portfolioItem.classList.add("col-md-4", "mb-4");

                    // Construct media URLs
                    const imageUrl = constructMediaUrl(item.image);
                    const videoUrl = constructMediaUrl(item.video);
                    const itemUrl = item.url || "#";

                    portfolioItem.innerHTML = `
                        <div class="card">
                            <img src="${imageUrl}" class="card-img-top" alt="${item.title || "Image"}" onerror="this.src='placeholder.png';">
                            <div class="card-body">
                                <h5 class="card-title">${item.title || "Untitled"}</h5>
                                <p class="card-text">
                                    <a href="${itemUrl}" target="_blank">Visit Link</a>
                                </p>
                                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#videoModal" onclick="playVideo('${videoUrl}')">Watch Video</button>
                            </div>
                        </div>
                    `;
                    portfolioItemsContainer.appendChild(portfolioItem);
                });
            }

            // Display all items initially
            displayItems(allItems);

            // Search button click event
            searchButton.addEventListener("click", function () {
                const searchQuery = searchInput.value.toLowerCase().trim();
                const filteredItems = allItems.filter(item =>
                    item.title && item.title.toLowerCase().includes(searchQuery)
                );

                // Redirect to the result page with search results
                if (filteredItems.length > 0) {
                    localStorage.setItem("searchResults", JSON.stringify(filteredItems));
                    window.location.href = "result.index.html"; // Redirect to result page
                } else {
                    alert("No matching items found!");
                }
            });
        })
        .catch(error => {
            console.error("Error fetching data from the API", error);
            portfolioItemsContainer.innerHTML = `
                <p class="text-danger">Failed to load portfolio items. Please try again later.</p>
            `;
        });

    // Function to play video in modal
    window.playVideo = function (videoUrl) {
        const modalVideo = document.getElementById("modalVideo");
        modalVideo.src = videoUrl;
        
    };

    // Clear video when modal is closed
    const videoModal = document.getElementById("videoModal");
    videoModal.addEventListener("hidden.bs.modal", function () {
        const modalVideo = document.getElementById("modalVideo");
        modalVideo.src = "";
    });
});

// Inject the modal into the HTML
document.body.innerHTML += `
<div class="modal fade" id="videoModal" tabindex="-1" aria-labelledby="videoModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="videoModalLabel">Video Playback</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <video id="modalVideo" controls width="100%">
                    <source src="" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    </div>
</div>
`;
