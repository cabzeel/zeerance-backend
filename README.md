# Love Story Backend

Backend API for the Love Story romantic gallery application.

## Features

- RESTful API for story management
- Image upload and management
- Music upload and management
- CORS enabled for frontend
- File storage with organized directories

## API Endpoints

### Story Management
- `GET /api/story` - Get all story data
- `POST /api/story` - Save story data
- `PUT /api/slides/:id` - Update a specific slide
- `DELETE /api/slides/:id` - Delete a specific slide

### Image Management
- `GET /api/images` - Get all images
- `POST /api/upload-image` - Upload image (multipart/form-data)
- `POST /api/upload-image-base64` - Upload image (base64)
- `DELETE /api/images/:filename` - Delete an image

### Music Management
- `GET /api/music` - Get all music files
- `POST /api/upload-music` - Upload music (multipart/form-data)
- `POST /api/upload-music-base64` - Upload music (base64)
- `POST /api/download-music` - Download music from URL
- `DELETE /api/music/:filename` - Delete a music file

### Static Files
- `/uploads/images/:filename` - Access uploaded images
- `/uploads/music/:filename` - Access uploaded music

## Local Development

```bash
npm install
npm run dev
```

Server runs on http://localhost:3000

## Deployment to Render

### Step 1: Push to GitHub

1. Create a new GitHub repository
2. Initialize git and push:

```bash
cd backend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/love-story-backend.git
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: love-story-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Click "Create Web Service"

### Step 3: Configure Environment

Render will automatically:
- Install dependencies
- Start the server
- Provide a URL like: `https://love-story-backend.onrender.com`

### Step 4: Update Frontend

Update your frontend's API URL to point to your Render backend:
- Production: `https://your-app.onrender.com`

## Important Notes

### Free Tier Limitations
- Render's free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- 750 hours/month of runtime
- Files persist across deploys

### Persistent Storage
- Create a Render Disk for persistent file storage
- Go to your service → Storage → Add Disk
- Mount path: `/app/uploads`
- This ensures images and music persist across deploys

### Environment Variables (Optional)
If you want to configure the port or other settings:
- Go to service → Environment
- Add: `PORT` = `3000` (Render sets this automatically)

## Production Checklist

- [ ] GitHub repository created and code pushed
- [ ] Render web service created
- [ ] Persistent disk added for uploads
- [ ] Frontend updated with backend URL
- [ ] CORS origins updated in server.js
- [ ] Test all endpoints

## Folder Structure

```
backend/
├── server.js           # Main server file
├── package.json        # Dependencies
├── data/              # Story data (created automatically)
│   └── story-data.json
└── uploads/           # Uploaded files (created automatically)
    ├── images/        # Uploaded images
    └── music/         # Uploaded music
```

## Troubleshooting

### Server not starting
- Check Render logs for errors
- Verify all dependencies are in package.json
- Ensure Node version compatibility

### Files not persisting
- Make sure you've added a Render Disk
- Verify disk is mounted to `/app/uploads`

### CORS errors
- Verify frontend URL in CORS configuration
- Check that both HTTP and HTTPS are allowed

### Images/Music not loading
- Check file permissions
- Verify upload directories exist
- Check Render logs for file system errors

## Support

For issues or questions, check the Render documentation:
- [Render Docs](https://render.com/docs)
- [Render Node.js Guide](https://render.com/docs/deploy-node-express-app)
