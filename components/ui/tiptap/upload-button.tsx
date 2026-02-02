'use client'

import React from 'react'
import { Editor } from '@tiptap/react'
import { Loader2, Image as ImageIcon } from 'lucide-react'
import { http } from '@/services/instance'
import { AxiosError } from 'axios'

interface Props {
  editor: Editor
  saveErrors?: (message: string) => void;
  progress?: (value: boolean) => void
}

export const UploadImageButton: React.FC<Props> = ({ editor, saveErrors, progress }) => {
  const [ loading, setLoading ] = React.useState(false);
  const [ errors, setErrors ] = React.useState<string>('');

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      progress && progress(true);
      const res = await http.post('/api/upload-image', formData);
      const data = res.data;

      if (data.url) {
        const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${data.url}`;
        editor.chain().focus().setImage({ src: fullUrl }).run();
      }
    } catch (error: unknown) {
      if(error instanceof AxiosError) {
        setErrors(error.response?.data.message)
      }
    } finally {
      setLoading(false);
      progress && progress(false);
    }
  }

  React.useEffect(() => {
    saveErrors && saveErrors(errors);
  }, [errors, setErrors]);

  return (
    <label className="flex items-center gap-1 p-1 border rounded cursor-pointer hover:bg-gray-100 transition">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
      <input type="file" accept="image/*" className="hidden" onChange={uploadImage} />
    </label>
  )
}
