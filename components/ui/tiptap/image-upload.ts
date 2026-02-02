// components/ui/tiptap/extensions/image-upload.ts
import Image from '@tiptap/extension-image'

export const ImageUpload = Image.extend({
  addCommands() {
    return {
      setImage: (options: { src: string }) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})
