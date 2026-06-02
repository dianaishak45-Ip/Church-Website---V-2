import express from 'express';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';

import { fileURLToPath } from 'url';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Portable __dirname equivalent for ESM/CJS compatibility
const getDirname = () => {
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch {
    return __dirname;
  }
};

const _dirname = getDirname();

// Root health checks for Cloud Run - Must be FIRST
app.all('/healthz', (req, res) => res.status(200).send('OK'));
app.head('/', (req, res) => res.status(200).end());
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Enable JSON body parsing for API endpoints
app.use(express.json());

// Suggestions & Contact Email POST API
app.post('/api/suggestions', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: 'الاسم ومحتوى الرسالة هما حقلان مطلوبان.' });
    }

    const emailTo = process.env.EMAIL_TO || 'info@stmarkshoubra.com';
    const emailFrom = process.env.SMTP_USER || 'suggestions@stmarkshoubra.com';
    const emailSubject = `[اقتراح/تواصل جديد] ${subject || 'بدون موضوع'} - ${name}`;

    const htmlContent = `
      <div style="direction: rtl; text-align: right; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e5dbc7; border-radius: 20px; background-color: #faf9f6; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
        <!-- Header -->
        <div style="text-align: center; border-bottom: 2px solid #c5a880; padding-bottom: 15px; margin-bottom: 25px;">
          <h2 style="color: #1c1917; margin: 0; font-size: 22px;">كنيسة القديس مارمرقس الرسولي بشبرا</h2>
          <p style="color: #c5a880; margin: 5px 0 0 0; font-size: 13px; font-weight: bold; letter-spacing: 0.5px;">بوابة التواصل والاقتراحات الإلكترونية</p>
        </div>

        <!-- Meta Grid -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 14px;">
          <tr style="background-color: #f5f3ef;">
            <td style="padding: 12px; font-weight: bold; width: 140px; border-bottom: 1px solid #e5dbc7; color: #1c1917;">اسم المرسل:</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5dbc7; color: #44403c;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5dbc7; color: #1c1917;">البريد الإلكتروني:</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5dbc7; color: #44403c;" dir="ltr">${email || 'غير محدد'}</td>
          </tr>
          <tr style="background-color: #f5f3ef;">
            <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5dbc7; color: #1c1917;">رقم الهاتف:</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5dbc7; color: #44403c;" dir="ltr">${phone || 'غير محدد'}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5dbc7; color: #1c1917;">نوع الرسالة / الغرض:</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5dbc7; font-weight: bold; color: #c5a880;">${subject}</td>
          </tr>
          <tr style="background-color: #f5f3ef;">
            <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5dbc7; color: #1c1917;">وقت الإرسال:</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5dbc7; color: #44403c;" dir="ltr">${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })} (توقيت القاهرة)</td>
          </tr>
        </table>

        <!-- Message Body -->
        <div style="margin-top: 20px; background-color: #ffffff; padding: 25px; border-radius: 16px; border: 1px solid #f2eee3; box-shadow: 0 2px 5px rgba(0,0,0,0.01);">
          <h3 style="margin-top: 0; color: #1c1917; border-bottom: 1px solid #f2eee3; padding-bottom: 12px; font-size: 16px;">محتوى الرسالة بالتفصيل:</h3>
          <p style="color: #44403c; line-height: 1.8; font-size: 15px; white-space: pre-line; margin: 0;">${message}</p>
        </div>

        <!-- Footer -->
        <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #a8a29e; border-top: 1px solid #e5dbc7; padding-top: 15px;">
          هذه رسالة آلية مرسلة عبر استمارة الاقتراحات والتواصل في الموقع الإلكتروني لكنيسة مارمرقس بشبرا.
        </div>
      </div>
    `;

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      console.log(`[Email] Attempting to send custom email to ${emailTo} via SMTP: ${smtpHost}...`);
      
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const info = await transporter.sendMail({
        from: `"${name}" <${emailFrom}>`,
        to: emailTo,
        replyTo: email || undefined,
        subject: emailSubject,
        html: htmlContent,
        text: `الاسم: ${name}\nالموضوع: ${subject}\nالبريد: ${email || 'غير محدد'}\nالهاتف: ${phone || 'غير محدد'}\n\nالرسالة:\n${message}`
      });

      console.log(`[Email] SMTP suggested message successfully sent! MessageId: ${info.messageId}`);
    } else {
      console.log('------------------------------------------------------------');
      console.log('[Email Simulation Only - SMTP Credentials Not Fully Set]');
      console.log(`To: ${emailTo}`);
      console.log(`Subject: ${emailSubject}`);
      console.log('------------------------- Message --------------------------');
      console.log(`الاسم: ${name}`);
      console.log(`الموضوع: ${subject}`);
      console.log(`البريد: ${email || 'غير محدد'}`);
      console.log(`الهاتف: ${phone || 'غير محدد'}`);
      console.log(`الرسالة:\n${message}`);
      console.log('------------------------------------------------------------');
    }

    return res.status(200).json({ success: true, message: 'تم إرسال اقتراحك وبريدك بنجاح إلى سكرتارية الكنيسة.' });
  } catch (err: any) {
    console.error('[Suggestions API Error]:', err);
    return res.status(500).json({ error: 'عذراً، حدث خطأ داخلي على الخادم أو أثناء إعداد إرسال البريد الإلكتروني.' });
  }
});

// In-memory cache for YouTube data
let youtubeCache: { data: any, timestamp: number } | null = null;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

const TRUSTED_ARCHIVE_VIDEOS = [
  { videoId: 'i6VfdCQAAYw', title: 'قداس عيد الميلاد 1987 - القمص إسطفانوس عازر والقمص لوقا قسطنطين', status: 'أرشيف القداسات التاريخية' },
  { videoId: 'EXhXc86jP5M', title: 'قداس عيد القيامة 1982 ج1 - ألبوم تراث الكنيسة', status: 'أرشيف القداسات التاريخية' },
  { videoId: '46xBUj-G80Y', title: 'قداس عيد القيامة 1982 ج2 - ألبوم تراث الكنيسة', status: 'أرشيف القداسات التاريخية' },
  { videoId: 'zLsEvABonTA', title: 'التوزيع - القمص إسطفانوس عازر - يوم أحد الشعانين لعام 1987', status: 'ألحان وتراث كنسي' },
  { videoId: 'B59t0ih8ddg', title: 'صلاة اللقان - خميس العهد سنة 1987 - القمص إسطفانوس عازر', status: 'صلوات طقسية نادرة' },
  { videoId: 'enY5_FbVXk4', title: 'جزء من القداس الإلهي (ارحمنا) - القمص إسطفانوس عازر', status: 'تراث وألحان الآباء' },
  { videoId: 'k3Vqx6WM1A0', title: 'عظة برمون عيد الغطاس - الحبر الجليل الأنبا أنجيلوس أسقف عام شبرا الشمالية', status: 'تعليم وعظات حية' },
  { videoId: 'I3apMyTGla8', title: 'قداس عيد القيامة المجيد ٢٠١٩ - كنيسة مارمرقس بشبرا', status: 'قداسات الأعياد' },
  { videoId: 'TPbibrU0Ncc', title: 'قداس عيد الميلاد المجيد بكنيسة مارمرقس بشبرا لعام 2016', status: 'قداسات الأعياد' }
];

const FALLBACK_VIDEO_ID = process.env.YOUTUBE_FALLBACK_ID || 'i6VfdCQAAYw'; // Configurable via environment variables

// YouTube Live Status Route - Using RSS Feed and Page Scraping for reliability
app.get('/api/youtube/live', async (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=60'); // Allow 1m browser cache
  
  // Check memory cache first
  if (youtubeCache && (Date.now() - youtubeCache.timestamp < CACHE_TTL)) {
    return res.json(youtubeCache.data);
  }

  const channelId = process.env.YOUTUBE_CHANNEL_ID || 'UC8gyKzkc5zqj7VZjAL7q7YQ';
  const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

  try {
    let result = null;
    
    // 1. Check if actually live first - faster check
    const livePageUrl = `https://www.youtube.com/channel/${channelId}/live`;
    try {
      const liveResponse = await fetch(livePageUrl, {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(3000) // Shorter timeout for faster response
      });
      
      if (liveResponse.ok) {
        const liveHtml = await liveResponse.text();
        const hasLiveMarker = liveHtml.includes('"isLive":true');
        const hasUpcomingMarker = liveHtml.includes('"isUpcoming":true');
        
        if (hasLiveMarker) {
          const match = liveHtml.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
          if (match) {
            const isLiveNow = !hasUpcomingMarker;
            if (isLiveNow) {
              result = {
                videoId: match[1],
                isLive: true,
                title: 'بث مباشر من كنيسة مارمرقس بشبرا',
                status: 'بث مباشر الآن'
              };
            } else {
              // It's an upcoming livestream, so we alert with 'بث مباشر قريباً' status, 
              // but still serve a beautiful playable video in the player to avoid a black waiting countdown screen!
              const periodSeed = Math.floor(Date.now() / (12 * 60 * 60 * 1000));
              const index = periodSeed % TRUSTED_ARCHIVE_VIDEOS.length;
              const fallbackVideo = TRUSTED_ARCHIVE_VIDEOS[index];
              result = {
                videoId: fallbackVideo.videoId,
                isLive: false,
                title: fallbackVideo.title,
                status: 'بث مباشر قريباً',
                upcomingVideoId: match[1]
              };
            }
          }
        }
      }
    } catch(e) {}
    
    if (!result) {
      // 2. Serve a high-quality hand-vetted video from our trusted archive list
      // The video is chosen deterministically based on a 12-hour period seed to change twice a day
      const periodSeed = Math.floor(Date.now() / (12 * 60 * 60 * 1000));
      const index = periodSeed % TRUSTED_ARCHIVE_VIDEOS.length;
      const fallbackVideo = TRUSTED_ARCHIVE_VIDEOS[index];
      
      result = {
        videoId: fallbackVideo.videoId,
        isLive: false,
        isPlaylist: false,
        title: fallbackVideo.title,
        status: fallbackVideo.status
      };
    }

    youtubeCache = { data: result, timestamp: Date.now() };
    return res.json(result);
  } catch (error) {
    console.warn(`[YouTube] Error fetching live status: ${error instanceof Error ? error.message : String(error)}`);
    if (youtubeCache) return res.json(youtubeCache.data);
    
    // Ultimate hardcoded safety fallback
    return res.json({ 
      videoId: FALLBACK_VIDEO_ID, 
      isLive: false, 
      title: 'قداس عيد الميلاد 1987 - القمص إسطفانوس عازر والقمص لوقا قسطنطين',
      status: 'أرشيف القداسات التاريخية' 
    });
  }
});

// Helper to locate storage directories automatically in development and production (e.g. cPanel environment)
const getStorageDir = (type: 'gallery' | 'announcements') => {
  const envVar = type === 'gallery' ? process.env.GALLERY_DIR : process.env.ANNOUNCEMENTS_DIR;
  if (envVar) return envVar;

  const candidates = [
    // 1. In current working directory (e.g. public_html/gallery or sm-website/gallery)
    path.join(process.cwd(), type),
    // 2. In typical cPanel public_html sub-folder
    path.join(process.cwd(), 'public_html', type),
    // 3. Relative parent directory's public_html folder (e.g. from /home/stmanajd/app/ to /home/stmanajd/public_html/gallery)
    path.join(path.resolve(process.cwd(), '..'), 'public_html', type),
    // 4. In project root relative to bundled dist file (e.g. dist/../gallery -> public_html/gallery)
    path.join(path.resolve(_dirname, '..'), type),
    // 5. Inside the dist directory itself (e.g. dist/gallery)
    path.join(_dirname, type),
    // 6. In public folder under process.cwd (e.g. public/gallery in dev)
    path.join(process.cwd(), 'public', type),
    // 7. In public folder relative to dist root (e.g. dist/../public/gallery)
    path.join(path.resolve(_dirname, '..'), 'public', type)
  ];

  for (const cand of candidates) {
    if (fs.existsSync(cand)) {
      return cand;
    }
  }

  // Fallback default
  return path.join(process.cwd(), 'public', type);
};

// Gallery API
app.get('/api/gallery', (req, res) => {
  const galleryPath = getStorageDir('gallery');
  
  try {
    if (!fs.existsSync(galleryPath)) return res.json([]);
    const images = fs.readdirSync(galleryPath)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .sort(); // Sort so they appear in order
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list gallery files' });
  }
});

// Dynamic Announcements / News API
app.get('/api/announcements', (req, res) => {
  const staticPath = process.env.NODE_ENV !== 'production' ? path.resolve(process.cwd(), 'public') : (fs.existsSync(path.join(_dirname, 'index.html')) ? _dirname : path.resolve(process.cwd(), 'dist'));
  const announcementsPath = getStorageDir('announcements');
  const fallbackPath = path.join(staticPath, 'assets', 'images');
  
  try {
    // Check if announcements folder has files, otherwise fall back to assets/images
    let targetPath = announcementsPath;
    if (!fs.existsSync(announcementsPath) || fs.readdirSync(announcementsPath).filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file)).length === 0) {
      targetPath = fallbackPath;
    }
    
    if (!fs.existsSync(targetPath)) return res.json([]);
    
    const files = fs.readdirSync(targetPath)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .sort();
    
    // Return relative URLs depending on which folder they are using
    const folderName = targetPath === announcementsPath ? 'announcements' : 'assets/images';
    const urls = files.map(file => `/${folderName}/${file}`);
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list announcement files' });
  }
});

// Katamars Proxy with Smart Cache & Fail-safe fallback
let katamarsMemoryCache: { key: string; data: any } | null = null;

const STATIC_FALLBACK_KATAMARS = {
  fullDate: {
    dateString: "14 Pashons"
  },
  Synaxarium: [
    {
      name: "تذكار روحي مبارك",
      text: "تذكار روحي وعميق من سير الآباء القديسين والشهداء الذين أرضوا الرب بحياتهم المباركة. لتكن صلواتهم معنا دائماً."
    }
  ],
  Pauline: [
    {
      bookName: "Romans",
      chapters: [
        {
          chapterNum: "8",
          verses: [
            { num: "28", text: "وَنَحْنُ نَعْلَمُ أَنَّ كُلَّ الأَشْيَاءِ تَعْمَلُ مَعاً لِلْخَيْرِ للَّذِينَ يُحِبُّونَ اللهَ." }
          ]
        }
      ]
    }
  ],
  Catholic: [
    {
      bookName: "1 John",
      chapters: [
        {
          chapterNum: "4",
          verses: [
            { num: "16", text: "اللهُ مَحَبَّةٌ، وَمَنْ يَثْبُتْ فِي الْمَحَبَّةِ يَثْبُتْ فِي اللهِ وَاللهُ فِيهِ." }
          ]
        }
      ]
    }
  ],
  Acts: [
    {
      bookName: "Acts",
      chapters: [
        {
          chapterNum: "17",
          verses: [
            { num: "28", text: "لأَنَّنَا بِهِ نَحْيَا وَنَتَحَرَّكُ وَنُوجَدُ." }
          ]
        }
      ]
    }
  ],
  LGospel: [
    {
      bookName: "John",
      chapters: [
        {
          chapterNum: "14",
          verses: [
            { num: "27", text: "سَلاَمًا أَتْرُكُ لَكُمْ. سَلاَمِي أُعْطِيكُمْ. لَيْسَ كَمَا يُعْطِي الْعَالَمُ أُعْطِيكُمْ أَنَا. لاَ تَضْطَرِبْ قُلُوبُكُمْ وَلاَ تَرْهَبْ." }
          ]
        }
      ]
    }
  ]
};

app.get('/api/katamars', async (req, res) => {
  const d = new Date();
  const cacheKey = `${d.getFullYear()}_${String(d.getMonth() + 1).padStart(2, '0')}_${String(d.getDate()).padStart(2, '0')}`;
  const cacheFilename = `katamars_cache_${cacheKey}.json`;
  const tempDir = process.env.TEMP_DIR || process.cwd();
  const cacheFilePath = path.join(tempDir, cacheFilename);

  // 1. In-Memory Cache Check
  if (katamarsMemoryCache && katamarsMemoryCache.key === cacheKey) {
    return res.json(katamarsMemoryCache.data);
  }

  // 2. Disk Cache Check
  try {
    if (fs.existsSync(cacheFilePath)) {
      const cachedData = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
      katamarsMemoryCache = { key: cacheKey, data: cachedData };
      return res.json(cachedData);
    }
  } catch (err) {
    console.warn('[Katamars] Disk cache read error:', err);
  }

  // 3. Find latest successful cached readings from any previous day on disk to act as first tier fallback
  let lastSuccessfulBackup: any = null;
  try {
    const files = fs.readdirSync(tempDir);
    const cacheFiles = files.filter(f => f.startsWith('katamars_cache_') && f.endsWith('.json')).sort();
    if (cacheFiles.length > 0) {
      const latestFile = cacheFiles[cacheFiles.length - 1];
      lastSuccessfulBackup = JSON.parse(fs.readFileSync(path.join(tempDir, latestFile), 'utf8'));
    }
  } catch (err) {}

  // 4. Perform Live Fetch with timeout
  try {
    const response = await fetch('https://api.coptic.io/api/readings?detailed=true&lang=ar', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: AbortSignal.timeout(6000)
    });

    if (response.ok) {
      const liveData = await response.json();
      katamarsMemoryCache = { key: cacheKey, data: liveData };

      // Write cache to disk asynchronously / non-blocking
      try {
        fs.writeFileSync(cacheFilePath, JSON.stringify(liveData, null, 2), 'utf8');
        
        // Clean up chronologically redundant cache files (retain only current)
        const files = fs.readdirSync(tempDir);
        files.forEach(f => {
          if (f.startsWith('katamars_cache_') && f.endsWith('.json') && f !== cacheFilename) {
            try {
              fs.unlinkSync(path.join(tempDir, f));
            } catch (e) {}
          }
        });
      } catch (err) {
        console.warn('[Katamars] Disk cache write error:', err);
      }

      return res.json(liveData);
    }
  } catch (fetchError) {
    console.warn(`[Katamars] Live fetch failed: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}.`);
  }

  // 5. Fallback Sequence
  if (lastSuccessfulBackup) {
    console.log('[Katamars] Serving last available reading from disk cache.');
    return res.json(lastSuccessfulBackup);
  }

  if (katamarsMemoryCache) {
    console.log('[Katamars] Serving in-memory backup.');
    return res.json(katamarsMemoryCache.data);
  }

  console.log('[Katamars] Serving static offline default.');
  return res.json(STATIC_FALLBACK_KATAMARS);
});

// Global Error Listeners
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Give the server a moment to log before exiting
  setTimeout(() => process.exit(1), 100);
});

async function setupApp() {
  const isProd = process.env.NODE_ENV === 'production';
  // Check if we are running the bundled version in dist
  const isBundled = fs.existsSync(path.join(_dirname, 'index.html'));
  const staticPath = isBundled ? _dirname : path.resolve(process.cwd(), 'dist');

  console.log(`[${new Date().toISOString()}] Server env: ${process.env.NODE_ENV}, Bundled: ${isBundled}`);
  console.log(`[${new Date().toISOString()}] Root static path: ${staticPath}`);

  // Serve gallery and announcements dynamically from the detected storage directories
  const resolvedGalleryDir = getStorageDir('gallery');
  const resolvedAnnouncementsDir = getStorageDir('announcements');

  console.log(`[Storage] Detected Gallery directory: ${resolvedGalleryDir}`);
  console.log(`[Storage] Detected Announcements directory: ${resolvedAnnouncementsDir}`);

  app.use('/gallery', express.static(resolvedGalleryDir));
  app.use('/announcements', express.static(resolvedAnnouncementsDir));

  // Logger for assets to debug 404s
  app.use((req, res, next) => {
    if (req.url.startsWith('/images/') || req.url.startsWith('/assets/')) {
      const filePath = path.join(staticPath, req.url.split('?')[0]);
      if (!fs.existsSync(filePath)) {
        console.warn(`[ASSET 404] ${req.url} -> ${filePath}`);
      }
    }
    next();
  });

  if (!isProd) {
    console.log('Starting in development mode with Vite...');
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.error('Failed to load Vite middleware:', e);
      if (fs.existsSync(staticPath)) {
        app.use(express.static(staticPath));
        app.get('*', (req, res) => res.sendFile(path.join(staticPath, 'index.html')));
      } else {
        console.error('No static files found and Vite failed to start.');
        process.exit(1);
      }
    }
  } else {
    console.log('Starting in production mode...');
    if (fs.existsSync(staticPath)) {
      app.use(express.static(staticPath));
      app.get('*', (req, res) => {
        const indexPath = path.join(staticPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          console.error(`Index file not found at: ${indexPath}`);
          res.status(404).send('Application assets missing.');
        }
      });
    } else {
      console.error(`CRITICAL: Static assets directory missing: ${staticPath}`);
      app.get('*', (req, res) => {
        res.status(500).send('Server configuration error: Static assets missing.');
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[${new Date().toISOString()}] Server listening on http://0.0.0.0:${PORT}`);
  });
}

setupApp().catch(err => {
  console.error('SERVER SETUP FATAL ERROR:', err);
  process.exit(1);
});





