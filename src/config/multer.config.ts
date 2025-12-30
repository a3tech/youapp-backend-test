import { diskStorage } from 'multer';
import { extname } from 'path';

export const imageUploadConfig = {
  storage: diskStorage({
    destination: './uploads/profile',
    filename: (_, file, cb) => {
      const uniqueName =
        Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + extname(file.originalname));
    },
  }),
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
};