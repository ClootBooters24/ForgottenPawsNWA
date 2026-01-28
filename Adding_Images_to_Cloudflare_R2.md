# Adding New Images to Cloudflare R2 Bucket

## Overview
This document provides instructions on how to add new images to the Cloudflare R2 bucket and update the corresponding JSON files for the gallery or event page.

## Prerequisites
- You need to have a Cloudflare account with access to the R2 bucket.
- Ensure you have access to the repository where the project is hosted.

## Steps to Add New Images
1. **Log in to your Cloudflare account.**  
   Go to the Cloudflare dashboard and log in with your credentials.

2. **Navigate to the R2 section.**  
   Find the R2 service in the dashboard and select the bucket you want to upload images to.

3. **Upload Images.**  
   - Click on the option to upload files.  
   - Select the images you want to add from your local machine.  
   - Ensure the images are in a web-friendly format (e.g., JPG, PNG).

4. **Update the JSON File.**  
   - Locate the appropriate JSON file in the repository (e.g., `assets/dogs.json` or `assets/events.json`).  
   - Open the JSON file in a text editor.
   - Add a new entry for each image you uploaded. The format should be as follows:
     ```json
     {
       "image": "URL_TO_YOUR_IMAGE",
       "description": "A brief description of the image"
     }
     ```
   - Replace `URL_TO_YOUR_IMAGE` with the direct link to the image in the R2 bucket.

5. **Save Changes.**  
   - After updating the JSON file, save your changes and commit them to the repository.

## Example JSON Entries

### events.json
Here’s an example of how an entry in the `events.json` file should look:
```json
{
  "events": [
    {
      "name": "Event Name",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "time": "Event Time",
      "location": "Event Location",
      "description": "A brief description of the event.",
      "status": "confirmed",
      "link": "URL_TO_EVENT"
    }
  ]
}
```

### dogs.json
Here’s an example of how an entry in the `dogs.json` file should look:
```json
[
    {
        "name": "Dog Name",
        "age": "Dog Age",
        "breed": "Dog Breed",
        "status": "Available",
        "description": "A brief description of the dog.",
        "image": "URL_TO_DOG_IMAGE"
    }
]
```
Here’s an example of how an entry in the JSON file should look:
```json
{
  "image": "https://your-bucket-name.r2.cloudflarestorage.com/path/to/your/image.jpg",
  "description": "A beautiful dog ready for adoption"
}
```

## Conclusion
Following these steps will ensure that new images are correctly added to the Cloudflare R2 bucket and that the gallery or event page is updated accordingly. If you have any questions or need further assistance, please reach out to the support team.