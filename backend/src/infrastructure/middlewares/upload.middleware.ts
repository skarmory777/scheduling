import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

export class UploadMiddleware {
    private static createStorage(folder: string) {
        const uploadPath = path.join(process.cwd(), 'uploads', folder);

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        return multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const extension = path.extname(file.originalname);
                cb(null, file.fieldname + '-' + uniqueSuffix + extension);
            }
        });
    }

    static getClinicalNoteUploadMiddleware() {
        return multer({
            storage: this.createStorage('clinical-notes'),
            limits: {
                fileSize: 50 * 1024 * 1024, // 50MB
            },
            fileFilter: (req, file, cb) => {
                const allowedMimeTypes = [
                    'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp',
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'text/plain', 'text/csv',
                    'application/dicom', 'image/dicom', 'application/x-dicom'
                ];

                if (allowedMimeTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error(`Unsupported file type: ${file.mimetype}`));
                }
            }
        });
    }

    static handleUploadError(err: any, req: any, res: any, next: any) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File size too large. Maximum size is 50MB'
                });
            }
            return res.status(400).json({
                success: false,
                message: err.message
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        next();
    }
}