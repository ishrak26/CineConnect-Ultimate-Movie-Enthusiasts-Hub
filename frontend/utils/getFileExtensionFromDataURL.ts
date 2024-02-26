// utils/getFileExtensionFromDataURL.ts

/**
 * Extracts the file extension from a base64 data URL.
 *
 * @param dataURL - The base64 encoded data URL of the file.
 * @returns The file extension if recognized, otherwise 'unknown'. Returns null if the data URL format is not recognized.
 */
const getFileExtensionFromDataURL = (dataURL: string): string | null => {
  const match = dataURL.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)
  if (match && match.length > 1) {
    const mimeType: string = match[1]

    // Map of MIME types to file extensions
    const mimeToExtensions: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      // Extend this object to include other MIME types as needed
    }

    return mimeToExtensions[mimeType] || 'unknown'
  }
  return null
}

export default getFileExtensionFromDataURL
