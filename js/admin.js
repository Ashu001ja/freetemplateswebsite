document.addEventListener('DOMContentLoaded', function () {
    // Handle form submission
    document.getElementById('uploadForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // Collect form data
        const title = document.getElementById('title').value;
        const url = document.getElementById('url').value;
        const videoInput = document.getElementById('video');
        const imageInput = document.getElementById('fileUpload');

        const videoFile = videoInput.files[0];  // Get the video file
        const imageFile = imageInput.files[0];  // Get the image file

        // Ensure all fields are filled
        if (!title || !url || !videoFile || !imageFile) {
            alert('Please fill in all fields and select both a video and an image file.');
            return;
        }

        // Create a FormData object to send the data
        const formData = new FormData();
        formData.append('title', title);
        formData.append('url', url);
        formData.append('video', videoFile);
        formData.append('image', imageFile);

        // Send data to the API via POST request
        fetch('https://mediaupload-production.up.railway.app/api/send', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Design uploaded successfully!');
                // Reset the form
                document.getElementById('uploadForm').reset();
            } else {
                alert('An error occurred while uploading the design.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to upload design. Please try again later.');
        });
    });
});
