'use client'

import React from 'react'
import sanitizeHtml from 'sanitize-html'

interface Props {
  description: string
  className?: string
}

export const Description = ({ description, className = '' }: Props) => {
  const sanitizedHTML = sanitizeHtml(description, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height'],
      a: ['href', 'target', 'rel'],
    },
  });

  return (
    <div
      className={`content-html prose prose-description max-w-none font-merriweather! text-[13px]! ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  )
}
