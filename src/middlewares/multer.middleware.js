import multer from "multer";

// to keep the media on the disk using multer
//multer is basically storage type things to keep user media during registration adn we have to inject it with the specified route

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../public/temp')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage})