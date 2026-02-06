'use client'

import React from 'react'
import sanitizeHtml from 'sanitize-html'

interface Props {
  description:  string
  size?:        string
  className?:   string
}

export const Description = ({ description, size='14', className = '' }: Props) => {
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
      className={`content-html prose prose-description leading-[1.2]! max-w-none font-merriweather! ${className}`}
      style={size ? { fontSize: `${size}px` } : undefined}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  )
}
