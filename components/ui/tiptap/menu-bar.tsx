'use client'

import React from 'react'
import { Editor } from '@tiptap/react'
import {
  Bold, Italic, Underline, Code, Heading1, Heading2, 
  Heading3, List, Quote, RotateCcw, RotateCw,
} from 'lucide-react'
import { UploadImageButton } from './upload-button'
import { AlertMessage } from '@/components/shared/alert'

interface Props {
  editor: Editor | null
}

export const MenuBar: React.FC<Props> = ({ editor }) => {
  if (!editor) return null

  const [loadingImage, setLoadingImage] = React.useState(false)
  const [errors, setErrors] = React.useState<string>('')

  const buttons = [
    { icon: <Bold className="w-4 h-4"/>, action: () => editor.chain().focus().toggleBold().run(), isActive: () => editor.isActive('bold') },
    { icon: <Italic className="w-4 h-4"/>, action: () => editor.chain().focus().toggleItalic().run(), isActive: () => editor.isActive('italic') },
    { icon: <Underline className="w-4 h-4"/>, action: () => editor.chain().focus().toggleUnderline().run(), isActive: () => editor.isActive('underline') },
    { icon: <Code className="w-4 h-4"/>, action: () => editor.chain().focus().toggleCode().run(), isActive: () => editor.isActive('code') },
    { icon: <Heading1 className="w-4 h-4"/>, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: () => editor.isActive('heading', { level: 1 }) },
    { icon: <Heading2 className="w-4 h-4"/>, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => editor.isActive('heading', { level: 2 }) },
    { icon: <Heading3 className="w-4 h-4"/>, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: () => editor.isActive('heading', { level: 3 }) },
    { icon: <List className="w-4 h-4"/>, action: () => editor.chain().focus().toggleBulletList().run(), isActive: () => editor.isActive('bulletList') },
    { icon: <Quote className="w-4 h-4"/>, action: () => editor.chain().focus().toggleBlockquote().run(), isActive: () => editor.isActive('blockquote') },
    { icon: <RotateCcw className="w-4 h-4"/>, action: () => editor.chain().focus().undo().run() },
    { icon: <RotateCw className="w-4 h-4"/>, action: () => editor.chain().focus().redo().run() },
  ]

  return (
    <>
      {loadingImage && (
        <AlertMessage
          type="success"
          title="Loading..."
          message="Завантаження зображення..."
          className="mb-2"
        />
      )}
      {errors && (
        <AlertMessage
          type="error"
          title="Error!"
          message={errors}
          className="mb-2"
          callback={() => setErrors('')}
        />
      )}
      <div className="flex flex-wrap gap-1 border-b p-1 mb-1 items-center">
        {buttons.map((btn, i) => (
          <button
            key={i}
            type="button"
            onClick={btn.action}
            className={`p-1 border cursor-pointer rounded hover:bg-gray-100 transition ${btn.isActive?.() ? 'bg-gray-200' : ''}`}
          >
            {btn.icon}
          </button>
        ))}
        {editor && (
          <UploadImageButton
            editor={editor}
            progress={(val) => setLoadingImage(val)}
            saveErrors={(msg) => setErrors(msg)}
          />
        )}
      </div>
    </>
  )
}
