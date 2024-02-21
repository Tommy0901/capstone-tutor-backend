const imgur = require('imgur')

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
  }
}
