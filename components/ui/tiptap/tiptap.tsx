'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { ImageUpload } from './image-upload'
import { MenuBar } from './menu-bar'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'

interface Props {
  value: string
  onChange: (value: string) => void
}

export const Tiptap = ({ value, onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3] }),
      ImageUpload,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  return (
    <div className="tiptap-editor border rounded-md p-2">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="min-h-[200px] p-3" />
    </div>
  )
}
