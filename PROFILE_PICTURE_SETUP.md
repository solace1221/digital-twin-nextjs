# Profile Picture Setup Instructions

## Current Status
The profile picture placeholders exist but contain placeholder data (78 bytes each). You need to replace them with your actual professional photo.

## Steps to Add Your Professional Photo:

### 1. Prepare Your Photo
- Use a high-quality, professional headshot
- Square aspect ratio works best (1:1 ratio)
- Recommended size: 400x400 pixels or larger
- Format: JPG or PNG
- File size: Ideally under 500KB for web performance

### 2. Replace the Placeholder Files
Replace these files with your actual professional photo:
```
/public/images/lovely-pearl-avatar.jpg
/public/images/lovely-pearl-professional.jpg
```

### 3. Using PowerShell to Replace:
```powershell
# Navigate to the project directory
cd "C:\Users\lovel\Desktop\digital-twin-nextjs\public\images"

# Copy your professional photo (replace "path\to\your\photo.jpg" with actual path)
Copy-Item "path\to\your\photo.jpg" "lovely-pearl-avatar.jpg" -Force
Copy-Item "path\to\your\photo.jpg" "lovely-pearl-professional.jpg" -Force
```

### 4. Alternative: Drag and Drop Method
1. Open File Explorer to: `C:\Users\lovel\Desktop\digital-twin-nextjs\public\images\`
2. Drag your professional photo into this folder
3. Rename it to `lovely-pearl-avatar.jpg` (overwrite existing)
4. Make a copy and rename to `lovely-pearl-professional.jpg`

## Current Fallback System
If the image fails to load, the system now shows:
- **Header Avatar**: Purple/pink gradient circle with "LP" initials
- **Message Avatars**: Similar gradient circle with "LP"
- **Background**: Gray background to prevent blank spaces

## Testing the Image
1. Start the development server: `pnpm dev`
2. Open the chatbot interface
3. Check browser console for image loading messages
4. If image loads successfully, you'll see your professional photo
5. If it fails, you'll see the "LP" gradient fallback

## Image Requirements Summary
- ✅ Professional headshot
- ✅ Square or close to square aspect ratio
- ✅ Clear, well-lit photo
- ✅ Appropriate for professional/business contexts
- ✅ File size under 500KB
- ✅ JPG format preferred

## Troubleshooting
- **Image not showing**: Check file path and ensure image is actually in the correct location
- **Console errors**: Check browser developer tools for specific error messages
- **Still showing fallback**: Verify image file size is larger than 78 bytes
- **Blurry image**: Use higher resolution source image (400x400px minimum)