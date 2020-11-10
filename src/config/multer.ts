import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

const multerConfig =
{
    dest: path.resolve(__dirname, '..', '..', 'uploads'),
    storage: multer.diskStorage(
    {
        destination: (req, file, cb) =>
        {
            cb(null, path.resolve(__dirname, '..', '..', 'uploads'))
        },
        filename: (req, file, cb) =>
        {
            crypto.randomBytes(16, (error, hash) =>
            {
                if (error) cb(error, '')
                const fileName = `${file.originalname}-${hash.toString('hex')}.png`
                cb(null, fileName)
            })
        }
    }),
    limits:
    {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req: any, file: Express.Multer.File, cb: (error: Error | null, param?: boolean) => void) =>
    {
        const allowedMimes = ['image/jpg', 'image/jpeg', 'image/png']
        if(allowedMimes.includes(file.mimetype)) cb(null, true)
        else cb(new Error('Invalid file type.'))
    }
}

export default multerConfig