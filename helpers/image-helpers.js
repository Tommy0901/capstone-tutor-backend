const imgur = require('imgur')
const axios = require('axios')

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const { Storage } = require('@google-cloud/storage')
const { createApi } = require('unsplash-js')

const storage = new Storage({
  projectId: 'silver-fragment-411909',
  keyFilename: '/home/welcome/.ssh/silver-fragment-411909-86d979044673.json' // 替換成你的服務帳戶金鑰路徑
})

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_KEY
})

const bucketName = 'test_upload_image' // 替換成你的 GCS 存儲桶名稱

const uploadToGCS = async (fileBuffer, remoteFilePath) => {
  try {
    // 上傳到 GCS
    await storage.bucket(bucketName).file(remoteFilePath).save(fileBuffer)
    console.log(`File uploaded to GCS: ${remoteFilePath}`)
  } catch (err) {
    console.error(`Error uploading file: ${err.message}`)
  }
}

const deleteFile = async fileNumber => {
  try {
    await storage.bucket(bucketName).file(`${fileNumber}.jpg`).delete()
    console.log(`File ${fileNumber}.jpg deleted successfully.`)
  } catch (err) {
    console.error(`Error deleting file: ${err.message}`)
  }
}

module.exports = {
  imgurUpload (file) { // file 是 multer 處理完的檔案
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      (async () => {
        try {
          const img = await imgur.uploadFile(file.path)
          resolve(img?.link || null)
        } catch (err) {
          reject(err)
        }
      })()
    })
  },
  uploadImageToGCS (API_URL, fileNumber) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          // 下載圖片
          const response = await axios.get(API_URL, { responseType: 'arraybuffer' })
          // 上傳到 GCS
          await uploadToGCS(Buffer.from(response.data), `${fileNumber}.jpg`)
          resolve(console.log('Image uploaded to GCS'))
        } catch (err) {
          reject(err)
        }
      })()
    })
  },
  deleteFileInGCS (fileNumber) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          await deleteFile(fileNumber)
          resolve(console.log('File deleted in GCS'))
        } catch (err) {
          reject(err)
        }
      })()
    })
  },
  getUserPhotos: async () => {
    // 串接 unsplash 的圖片
    try {
      const photos = await Promise.all([
        unsplash.search.getPhotos({
          query: 'portrait',
          page: 1,
          perPage: 30
        }),
        unsplash.search.getPhotos({
          query: 'lady',
          page: 1,
          perPage: 4,
          orientation: 'portrait'
        })
      ])

      const userImages = photos.flatMap(photo => photo.response.results.map(result => result.urls.small))
      return userImages
    } catch (err) {
      console.error(err)
    }
  }
}
