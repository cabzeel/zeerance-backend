const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

// Directories
const DATA_FILE = path.join(__dirname, 'data', 'story-data.json');
const IMAGES_DIR = path.join(__dirname, 'uploads', 'images');
const MUSIC_DIR = path.join(__dirname, 'uploads', 'music');

// Create necessary directories
[path.dirname(DATA_FILE), IMAGES_DIR, MUSIC_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Initialize data file
if (!fs.existsSync(DATA_FILE)) {
  const initialData = {
    slides: [
      {
        id: '1',
        title: 'The Beginning',
        text: 'Every love story has a beginning... This is ours. ❤️',
        image:
          'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=1200',
        duration: 5,
      },
      {
        id: '2',
        title: 'Our First Meet',
        text: "Friday 12th December 2025 - You took my number from Blessed 😅. At that exact moment, I didn't know, but that was the start of something beautiful.",
        image:
          'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200',
        duration: 5,
      },
      {
        id: '3',
        title: 'Falling for You',
        text: "Then came 13th December 2025 - You opened up to me. I didn't see weakness; I saw strength. I saw a woman who, despite life trying its best to keep her down, kept fighting. I fell for your strength, your resilience, your beauty, your smile, your laugh, your heart. 💖",
        image:
          'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200',
        duration: 5,
      },
      {
        id: '4',
        title: 'Forever and Always',
        text: "I know you don't like me cursing 😅, but permit me this once. F*** everyone who says our love is rushed. I saw everything I wanted in a woman, I went for it, and as long as I'm sane, I'll love you till my last breath. 💕",
        image:
          'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200',
        duration: 5,
      },
      {
        id: '5',
        title: 'End',
        text: "Happy Valentine's Day, Endurance 💓. This is the start of something beautiful.\n\nLots of love... Cabzeel 💓",
        image:
          'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200',
        duration: 5,
      },
    ],
    musicUrl: '',
    settings: {
      autoPlay: true,
      password: 'valentine2026',
    },
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  console.log('Initialized story-data.json');
}

// Middleware
app.use(
  cors({
    origin: [
      'https://www.zeerance.netlify.app',
      'https://zeerance.netlify.app',
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/uploads/images', express.static(IMAGES_DIR));
app.use('/uploads/music', express.static(MUSIC_DIR));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = file.fieldname === 'music' ? MUSIC_DIR : IMAGES_DIR;
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const prefix = file.fieldname === 'music' ? 'music' : 'image';
    cb(null, `${prefix}_${timestamp}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const musicExts = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (file.fieldname === 'image' && imageExts.includes(ext)) {
      cb(null, true);
    } else if (file.fieldname === 'music' && musicExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Love Story API is running' });
});

// Get story data
app.get('/api/story', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
  } catch (error) {
    console.error('Error reading story data:', error);
    res.status(500).json({ error: 'Error reading story data' });
  }
});

// Save story data
app.post('/api/story', (req, res) => {
  try {
    const data = req.body;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, message: 'Story saved successfully' });
  } catch (error) {
    console.error('Error saving story data:', error);
    res.status(500).json({ error: 'Error saving story data' });
  }
});

// Update single slide
app.put('/api/slides/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const slideIndex = data.slides.findIndex((s) => s.id === req.params.id);

    if (slideIndex === -1) {
      return res.status(404).json({ error: 'Slide not found' });
    }

    data.slides[slideIndex] = { ...data.slides[slideIndex], ...req.body };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, slide: data.slides[slideIndex] });
  } catch (error) {
    console.error('Error updating slide:', error);
    res.status(500).json({ error: 'Error updating slide' });
  }
});

// Delete slide
app.delete('/api/slides/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    data.slides = data.slides.filter((s) => s.id !== req.params.id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, message: 'Slide deleted' });
  } catch (error) {
    console.error('Error deleting slide:', error);
    res.status(500).json({ error: 'Error deleting slide' });
  }
});

// Upload image (base64)
app.post('/api/upload-image-base64', (req, res) => {
  try {
    const { image, filename } = req.body;
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    const imageBuffer = Buffer.from(matches[2], 'base64');
    const timestamp = Date.now();
    const ext = path.extname(filename) || '.jpg';
    const newFilename = `image_${timestamp}${ext}`;
    const filepath = path.join(IMAGES_DIR, newFilename);

    fs.writeFileSync(filepath, imageBuffer);
    res.json({
      success: true,
      url: `/uploads/images/${newFilename}`,
      filename: newFilename,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Error uploading image' });
  }
});

// Upload image (multipart)
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      success: true,
      url: `/uploads/images/${req.file.filename}`,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Error uploading image' });
  }
});

// Get all images
app.get('/api/images', (req, res) => {
  try {
    const files = fs.readdirSync(IMAGES_DIR);
    const imageFiles = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      })
      .map((file) => {
        const stat = fs.statSync(path.join(IMAGES_DIR, file));
        return {
          name: file,
          url: `/uploads/images/${file}`,
          date: stat.mtime,
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(imageFiles);
  } catch (error) {
    console.error('Error reading images:', error);
    res.status(500).json({ error: 'Error reading images' });
  }
});

// Delete image
app.delete('/api/images/:filename', (req, res) => {
  try {
    const filepath = path.join(IMAGES_DIR, req.params.filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ success: true, message: 'Image deleted' });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Error deleting image' });
  }
});

// Upload music (multipart)
app.post('/api/upload-music', upload.single('music'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      success: true,
      url: `/uploads/music/${req.file.filename}`,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error('Error uploading music:', error);
    res.status(500).json({ error: 'Error uploading music' });
  }
});

// Upload music (base64)
app.post('/api/upload-music-base64', (req, res) => {
  try {
    const { audio, filename } = req.body;
    const matches = audio.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid audio format' });
    }

    const audioBuffer = Buffer.from(matches[2], 'base64');
    const timestamp = Date.now();
    const ext = path.extname(filename) || '.mp3';
    const newFilename = `music_${timestamp}${ext}`;
    const filepath = path.join(MUSIC_DIR, newFilename);

    fs.writeFileSync(filepath, audioBuffer);
    res.json({
      success: true,
      url: `/uploads/music/${newFilename}`,
      filename: newFilename,
    });
  } catch (error) {
    console.error('Error uploading music:', error);
    res.status(500).json({ error: 'Error uploading music' });
  }
});

// Download music from URL
app.post('/api/download-music', (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const timestamp = Date.now();
    const urlObj = new URL(url);
    const ext = path.extname(urlObj.pathname) || '.mp3';
    const newFilename = `music_${timestamp}${ext}`;
    const filepath = path.join(MUSIC_DIR, newFilename);
    const file = fs.createWriteStream(filepath);

    const protocol = urlObj.protocol === 'https:' ? https : http;

    protocol
      .get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          file.close();
          fs.unlinkSync(filepath);

          protocol
            .get(response.headers.location, (redirectResponse) => {
              redirectResponse.pipe(file);
              file.on('finish', () => {
                file.close();
                res.json({
                  success: true,
                  url: `/uploads/music/${newFilename}`,
                  filename: newFilename,
                });
              });
            })
            .on('error', (err) => {
              fs.unlinkSync(filepath);
              res
                .status(500)
                .json({ error: 'Error downloading music: ' + err.message });
            });
        } else if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            res.json({
              success: true,
              url: `/uploads/music/${newFilename}`,
              filename: newFilename,
            });
          });
        } else {
          fs.unlinkSync(filepath);
          res.status(400).json({
            error: 'Could not download music. Status: ' + response.statusCode,
          });
        }
      })
      .on('error', (err) => {
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        res
          .status(500)
          .json({ error: 'Error downloading music: ' + err.message });
      });
  } catch (error) {
    console.error('Error downloading music:', error);
    res.status(500).json({ error: 'Error downloading music' });
  }
});

// Get all music files
app.get('/api/music', (req, res) => {
  try {
    const files = fs.readdirSync(MUSIC_DIR);
    const musicFiles = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return ['.mp3', '.wav', '.ogg', '.m4a', '.aac'].includes(ext);
      })
      .map((file) => {
        const stat = fs.statSync(path.join(MUSIC_DIR, file));
        return {
          name: file,
          url: `/uploads/music/${file}`,
          date: stat.mtime,
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(musicFiles);
  } catch (error) {
    console.error('Error reading music files:', error);
    res.status(500).json({ error: 'Error reading music files' });
  }
});

// Delete music
app.delete('/api/music/:filename', (req, res) => {
  try {
    const filepath = path.join(MUSIC_DIR, req.params.filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ success: true, message: 'Music deleted' });
    } else {
      res.status(404).json({ error: 'Music not found' });
    }
  } catch (error) {
    console.error('Error deleting music:', error);
    res.status(500).json({ error: 'Error deleting music' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║                                            ║
║      💕 Love Story Backend Running 💕     ║
║                                            ║
║  Server: http://localhost:${PORT}           ║
║  Status: Ready to capture memories         ║
║                                            ║
║  Features:                                 ║
║  ✓ CORS enabled for frontend               ║
║  ✓ Image uploads                           ║
║  ✓ Music integration                       ║
║  ✓ RESTful API                             ║
║                                            ║
╚════════════════════════════════════════════╝
  `);
});

module.exports = app;
