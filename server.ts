import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Gallery API Route
  app.get('/api/gallery', async (req, res) => {
    const galleryPath = path.join(process.cwd(), 'public', 'gallery');
    try {
      if (!fs.existsSync(galleryPath)) {
        fs.mkdirSync(galleryPath, { recursive: true });
        return res.json([]);
      }
      const files = fs.readdirSync(galleryPath);
      const images = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
      res.json(images);
    } catch (error) {
      console.error('Gallery API Error:', error);
      res.status(500).json({ error: 'Failed to list gallery files' });
    }
  });

  // API Proxy Route for Coptic Readings
  app.get('/api/katamars', async (req, res) => {
    const urls = [
      'https://api.coptic.io/api/readings?detailed=true&lang=ar'
    ];

    let lastError = null;
    for (const url of urls) {
      try {
        console.log(`Trying proxy to: ${url}`);
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          return res.json(data);
        }
        console.error(`Failed ${url}: ${response.status}`);
      } catch (error) {
        console.error(`Error ${url}:`, error);
        lastError = error;
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch readings from all sources',
      details: String(lastError)
    });
  });

  // YouTube Live/Top Video Cache
  let youtubeCache: { data: any, timestamp: number } | null = null;
  let searchFallback: { data: any, timestamp: number } | null = null;
  const CACHE_TTL = 4 * 60 * 1000; // 4 minutes for live check (ensures < 5m detection)
  const SEARCH_FALLBACK_TTL = 24 * 60 * 60 * 1000; // 24 hours for popular videos fallback

  app.get('/api/youtube/live', async (req, res) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = 'UCmx-ea92VQN0Sv9haqEpceQ';

    // Return cached response if within TTL
    if (youtubeCache && (Date.now() - youtubeCache.timestamp < CACHE_TTL)) {
      return res.json(youtubeCache.data);
    }

    const finalApiKey = (apiKey && apiKey.length > 20) ? apiKey : 'AIzaSyDS5n1rigofPHyGLvCf1CpO7UVlgUceKXM';

    const cleanTitle = (title: string) => {
      let t = (title || '').trim();
      t = t.replace(/^\s*(البث\s*المباشر|بث\s*مباشر)[\s:_\-–—|]*/u, '');
      return t.trim();
    };

    const isGeneric = (title: string) => {
      if (!title) return true;
      return /(البث\s*المباشر|بث\s*مباشر|كنيسة)/u.test(title);
    };

    try {
      /* ============================================================
         STEP 1 — RSS CHECK (NO QUOTA)
         ============================================================ */
      let liveIdFromRss = null;
      try {
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
        const rssRes = await fetch(rssUrl, { signal: AbortSignal.timeout(5000) });
        if (rssRes.ok) {
          const rssText = await rssRes.text();
          const match = rssText.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
          if (match && match[1]) {
            liveIdFromRss = match[1];
          }
        }
      } catch (rssErr) {
        console.error('RSS Feed error:', rssErr);
      }

      /* ============================================================
         STEP 2 — CHANNEL LIVE SCRAPE (NO QUOTA - ROBUST FALLBACK)
         ============================================================ */
      let liveIdFromScraping = null;
      if (!liveIdFromRss) {
        try {
          const liveUrl = `https://www.youtube.com/channel/${channelId}/live`;
          const liveRes = await fetch(liveUrl, { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
            signal: AbortSignal.timeout(5000) 
          });
          if (liveRes.ok) {
            const html = await liveRes.text();
            // Look for "videoId":"..." or "video_id":"..." or the canonical link
            const idMatch = html.match(/"videoId":"([^"]+)"/) || html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([^"]+)">/);
            if (idMatch && idMatch[1]) {
              liveIdFromScraping = idMatch[1];
            }
          }
        } catch (scrapeErr) {
          console.error('Scraping error:', scrapeErr);
        }
      }

      /* ============================================================
         STEP 3 — API CONFIRMATION (CHEAP: 1 unit)
         ============================================================ */
      const candidateIds = [liveIdFromRss, liveIdFromScraping].filter(Boolean) as string[];
      
      if (candidateIds.length > 0) {
        const ids = [...new Set(candidateIds)].join(',');
        const vUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${ids}&key=${finalApiKey}`;
        const vRes = await fetch(vUrl);
        const vData = await vRes.json();

        if (vData.items && vData.items.length > 0) {
          // Find the first one that is actually live
          const liveItem = vData.items.find((item: any) => 
            item.snippet.liveBroadcastContent === 'live' || 
            (item.liveStreamingDetails?.actualStartTime && !item.liveStreamingDetails?.actualEndTime)
          );

          if (liveItem) {
            let title = cleanTitle(liveItem.snippet.title);
            if (isGeneric(title)) title = '';

            const result = {
              videoId: liveItem.id,
              title: title,
              isLive: true,
              status: 'بث مباشر الآن'
            };
            youtubeCache = { data: result, timestamp: Date.now() };
            return res.json(result);
          }
        }
      }

      /* ============================================================
         STEP 4 — ACTIVITIES CHECK (CHEAP: 1 unit)
         ============================================================ */
      // If RSS and Scrape didn't find it, the Activities list might have it
      try {
        const actUrl = `https://www.googleapis.com/youtube/v3/activities?part=snippet,contentDetails&channelId=${channelId}&maxResults=5&key=${finalApiKey}`;
        const actRes = await fetch(actUrl);
        const actData = await actRes.json();
        
        if (actData.items && actData.items.length > 0) {
          const videoIds = actData.items
            .map((item: any) => item.contentDetails?.upload?.videoId || item.contentDetails?.liveBroadcast?.videoId)
            .filter(Boolean);
          
          if (videoIds.length > 0) {
            const vUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${videoIds.join(',')}&key=${finalApiKey}`;
            const vRes = await fetch(vUrl);
            const vData = await vRes.json();
            
            const liveItem = vData.items?.find((item: any) => 
              item.snippet.liveBroadcastContent === 'live' || 
              (item.liveStreamingDetails?.actualStartTime && !item.liveStreamingDetails?.actualEndTime)
            );

            if (liveItem) {
              let title = cleanTitle(liveItem.snippet.title);
              if (isGeneric(title)) title = '';

              const result = {
                videoId: liveItem.id,
                title: title,
                isLive: true,
                status: 'بث مباشر الآن'
              };
              youtubeCache = { data: result, timestamp: Date.now() };
              return res.json(result);
            }
          }
        }
      } catch (actErr) {
        console.error('Activities check error:', actErr);
      }

      /* ============================================================
         STEP 5 — POPULAR VIDEO FALLBACK (QUOTA CONSERVATIVE)
         ============================================================ */
      // Use searchFallback if available to save quota
      if (searchFallback && (Date.now() - searchFallback.timestamp < SEARCH_FALLBACK_TTL)) {
        youtubeCache = { data: searchFallback.data, timestamp: Date.now() };
        return res.json(searchFallback.data);
      }

      console.log('Fetching recent videos fallback (1 unit)...');
      try {
        // Uploads playlist ID is UC... -> UU...
        const uploadsPlaylistId = 'UUmx-ea92VQN0Sv9haqEpceQ';
        const playUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=10&key=${finalApiKey}`;
        const playRes = await fetch(playUrl);
        const playData = await playRes.json();

        if (playData.items && playData.items.length > 0) {
          // Pick a random one from the latest 10
          const pick = playData.items[Math.floor(Math.random() * playData.items.length)];
          let title = cleanTitle(pick.snippet.title);
          if (isGeneric(title)) title = '';

          const result = {
            videoId: pick.snippet.resourceId.videoId,
            title: title,
            isLive: false,
            status: 'لا يوجد بث مباشر الآن'
          };
          searchFallback = { data: result, timestamp: Date.now() };
          youtubeCache = { data: result, timestamp: Date.now() };
          return res.json(result);
        }
      } catch (fallbackErr) {
        console.error('Playlist fallback error:', fallbackErr);
      }

      // Final absolute fallback (0 units)
      const finalFallback = {
        videoId: 'K1pW99T6M-E',
        title: 'ألحان كنيسة مارمرقس بشبرا',
        isLive: false,
        status: 'لا يوجد بث مباشر حالياً'
      };
      return res.json(finalFallback);

    } catch (error: any) {
      console.error('YouTube API Generic Error:', error);
      return res.json({
        videoId: 'K1pW99T6M-E',
        title: 'كنيسة مارمرقس بشبرا',
        isLive: false,
        status: 'خطأ في الاتصال باليوتيوب'
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
