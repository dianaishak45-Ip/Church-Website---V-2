import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Youtube, RefreshCw } from 'lucide-react';

interface YoutubeData {
  videoId: string;
  title: string;
  isLive: boolean;
  status: string;
}

export const LiveStreamWidget: React.FC = () => {
  const [data, setData] = useState<YoutubeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchLiveStream = async () => {
    try {
      const response = await fetch('/api/youtube/live');
      if (response.ok) {
        const result = await response.json();
        setData(result);
        setError(false);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error fetching live stream:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStream();
    
    // Auto-refresh every 60 seconds as requested
    const interval = setInterval(fetchLiveStream, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <RefreshCw className="w-10 h-10 text-gold animate-spin" />
        <p className="arabic-sans text-stone-500">جاري تحميل البث...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center p-12 custom-panel !bg-red-50/10 border-red-100/20">
        <p className="arabic-sans text-red-600">تعذر تحميل البث حالياً</p>
        <button 
          onClick={fetchLiveStream}
          className="mt-4 px-6 py-2 bg-stone-900 text-white rounded-xl arabic-sans text-sm"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 text-center"
      dir="rtl"
    >
      <div className="space-y-2">
        <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-bold arabic-sans border ${
          data.isLive ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-gold/10 text-gold border-gold/20'
        }`}>
          {data.isLive ? <span className="w-2 h-2 bg-red-600 rounded-full" /> : <Youtube className="w-4 h-4" />}
          {data.status}
        </div>
        
        {data.title && (
          <h3 className="arabic-serif text-xl lg:text-2xl font-bold text-stone-800">{data.title}</h3>
        )}
      </div>

      <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/50 bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${data.videoId}?autoplay=${data.isLive ? '1' : '0'}&rel=0`}
          title={data.title || "YouTube video"}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      {!data.isLive && (
        <p className="arabic-sans text-stone-500 text-sm">
          لم يبدأ البث المباشر بعد، نعرض لكم أحد أكثر الفيديوهات مشاهدة مؤخراً.
        </p>
      )}
    </motion.div>
  );
};
