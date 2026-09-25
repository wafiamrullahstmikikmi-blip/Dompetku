import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sizeStr = searchParams.get('size') || '192'
  const size = parseInt(sizeStr, 10)

  return new ImageResponse(
    (
      <div
        style={{
          background: '#2563eb',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: size > 200 ? '128px' : '32px',
        }}
      >
        <div style={{ color: 'white', fontSize: size / 2, fontWeight: 'bold' }}>
          DK
        </div>
      </div>
    ),
    {
      width: size,
      height: size,
    }
  )
}
