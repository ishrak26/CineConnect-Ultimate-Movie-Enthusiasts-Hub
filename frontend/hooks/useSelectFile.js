import { useState } from 'react'
import useCustomToast from './useCustomToast'

const useSelectFile = (maxHeight, maxWidth) => {
  const [selectedFile, setSelectedFile] = useState()
  const [originalImage, setOriginalImage] = useState()
  const showToast = useCustomToast()

  const onSelectFile = (event) => {
    const file = event.target.files ? event.target.files[0] : null
    const maxImageSize = 10 // 10MB
    const allowedFileTypes = ['image/jpeg', 'image/png']

    if (file) {
      if (file.size > maxImageSize * 1024 * 1024) {
        showToast({
          title: 'File size is too large',
          description: `Maximum file size is ${maxImageSize}MB.`,
          status: 'error',
        })
        return
      }

      if (!allowedFileTypes.includes(file.type)) {
        showToast({
          title: 'File type not allowed',
          description: `Only image file types are allowed (.png / .jpeg).`,
          status: 'error',
        })
        return
      }

      const image = new Image()
      image.src = URL.createObjectURL(file)
      image.onload = () => {
        if (image.width > maxWidth || image.height > maxHeight) {
          showToast({
            title: 'Image dimensions are too large',
            description: `Maximum dimensions are ${maxWidth}x${maxHeight}.`,
            status: 'error',
          })
          return
        }

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = image.width
        canvas.height = image.height
        ctx.drawImage(image, 0, 0, image.width, image.height)
        const resizedImage = canvas.toDataURL('image/jpeg', 1.0)

        setSelectedFile(resizedImage)
        setOriginalImage(file)
      }
    }
  }

  return { selectedFile, setSelectedFile, onSelectFile, originalImage }
}

export default useSelectFile
