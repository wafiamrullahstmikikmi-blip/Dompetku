import { ImageResponse } from 'next/og'
import React from 'react'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sizeStr = searchParams.get('size') || '192'
  const size = parseInt(sizeStr, 10)

  return new ImageResponse(
    React.createElement(
      'div',
      {
        style: {
          background: '#2563eb',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: size > 200 ? '128px' : '32px',
        }
      },
      React.createElement(
        'div',
        {
          style: { color: 'white', fontSize: size / 2, fontWeight: 'bold' }
        },
        'DK'
      )
    ),
    {
      width: size,
      height: size,
    }
  )
}
