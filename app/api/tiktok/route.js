import { NextResponse } from 'next/server';
import { Downloader } from '@tobyg74/tiktok-api-dl';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ detail: 'URL TikTok tidak valid' }, { status: 400 });
    }

    const result = await Downloader(url, { version: 'v1' });

    if (!result || result.status === 'error') {
      return NextResponse.json({ detail: result?.message || 'Gagal mendapatkan data video TikTok' }, { status: 400 });
    }

    const data = result.data || result;
    return NextResponse.json({
      title: data.title || 'TikTok Video',
      author: data.author?.nickname || data.author?.unique_id || 'Unknown',
      cover: data.cover || '',
      video_url: data.video || '',
      music_url: data.music || '',
      duration: data.duration || 0
    });
  } catch (error) {
    console.error('TikTok API error:', error);
    return NextResponse.json({ detail: error.message || 'Gagal memproses URL TikTok' }, { status: 500 });
  }
}
