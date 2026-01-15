import { NextRequest, NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNELS = {
  moscow: process.env.TELEGRAM_CHANNEL_MOSCOW,
  spb: process.env.TELEGRAM_CHANNEL_SPB,
  russia: process.env.TELEGRAM_CHANNEL_RUSSIA,
  foreign: process.env.TELEGRAM_CHANNEL_FOREIGN,
  suspicious: process.env.TELEGRAM_CHANNEL_SUSPICIOUS,
}

interface NotifyRequest {
  photo_id: string
  short_id: string
  filename: string
  latitude: number
  longitude: number
  city?: string
  country?: string
  address?: string
  image_url: string
  suspicious?: boolean
  suspicious_reasons?: string[]
}

function determineChannel(city?: string, country?: string, suspicious?: boolean): string | null {
  if (suspicious) {
    return CHANNELS.suspicious || null
  }

  if (!country || country.toLowerCase() !== 'russia' && country.toLowerCase() !== 'россия') {
    return CHANNELS.foreign || null
  }

  const cityLower = city?.toLowerCase() || ''

  if (cityLower.includes('москва') || cityLower.includes('moscow')) {
    return CHANNELS.moscow || null
  }

  if (cityLower.includes('санкт-петербург') || cityLower.includes('петербург') || cityLower.includes('saint petersburg')) {
    return CHANNELS.spb || null
  }

  return CHANNELS.russia || null
}

export async function POST(request: NextRequest) {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return NextResponse.json({ error: 'Telegram bot not configured' }, { status: 500 })
    }

    const data: NotifyRequest = await request.json()

    const channel = determineChannel(data.city, data.country, data.suspicious)

    if (!channel) {
      return NextResponse.json({ error: 'No channel configured for this region' }, { status: 400 })
    }

    // Format message
    const locationUrl = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`
    const photoUrl = `${request.nextUrl.origin}/p/${data.short_id}`

    let message = `📍 *Новое фото загружено*\n\n`
    message += `📎 [Открыть фото](${photoUrl})\n`
    message += `🗺 [Открыть на карте](${locationUrl})\n\n`
    message += `📍 *Координаты:* \`${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}\`\n`

    if (data.address) {
      message += `📫 *Адрес:* ${data.address}\n`
    }

    if (data.city) {
      message += `🏙 *Город:* ${data.city}\n`
    }

    if (data.country) {
      message += `🌍 *Страна:* ${data.country}\n`
    }

    if (data.suspicious && data.suspicious_reasons) {
      message += `\n⚠️ *Подозрительная активность:*\n`
      data.suspicious_reasons.forEach(reason => {
        const reasonText = {
          'frequent_same_location': 'Частые загрузки с одной точки',
          'high_frequency': 'Слишком много загрузок за час',
          'night_upload': 'Ночная загрузка (00:00-06:00)',
        }[reason] || reason
        message += `• ${reasonText}\n`
      })
    }

    message += `\n🆔 \`${data.short_id}\``

    // Send to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: channel,
          text: message,
          parse_mode: 'Markdown',
          disable_web_page_preview: false,
        }),
      }
    )

    if (!telegramResponse.ok) {
      const error = await telegramResponse.text()
      console.error('Telegram error:', error)
      return NextResponse.json({ error: 'Failed to send Telegram notification' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notify error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
