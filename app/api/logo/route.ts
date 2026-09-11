const logoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_of_Bangladesh_Maritime_University-3nRxheVMn6IZAoZTGXg8n6Rv4WngIc.png'

export async function GET() {
  const response = await fetch(logoUrl, { next: { revalidate: 86400 } })

  if (!response.ok) {
    return new Response('Unable to load university logo', { status: 502 })
  }

  return new Response(response.body, {
    headers: {
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      'Content-Type': response.headers.get('content-type') || 'image/png',
    },
  })
}
