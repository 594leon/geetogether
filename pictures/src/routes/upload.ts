import Router from 'koa-router';
import { validateImageType } from '../middlewares/validate-image-type'
import path from 'path';
import fs from 'fs';
import type { File } from 'formidable';
import sharp from 'sharp';
import Config from '../config';
import { getMessageService } from '../service-injection';
import { PictureUploadedPublisher } from '../events/publishers/picture-uploaded-publisher';
import { InternalError, requireAuth } from '@serjin/common';
import { nanoid } from 'nanoid';

const uploadRoute = (messageService = getMessageService()) => {
    const route = new Router();                                           //限制檔案大小為 350KB
    route.post('/api/pictures/me/avatar', requireAuth(false), validateImageType(350 * 1024), async (ctx) => {

        // 取得上傳的圖片檔案
        const image = ctx.request.files!.image as File;

        // 創建唯一的檔案名稱
        // const filename = `${Date.now()}-${image.originalFilename}`;
        const { id } = ctx.request.currentUser!;
        // 取得副檔名
        let fileExtension = '.png';
        if (image.originalFilename) {
            fileExtension = path.extname(image.originalFilename);
        }
        const uuid = nanoid(5);//預設是 21 characters (default)，這裡我們取 5 characters的UUID ex:"kq9PO"
        const tmpFilename = `${id}-${fileExtension}`;
        const realFilename = `${id}-${uuid}${fileExtension}`;

        // // 確保 uploads 資料夾存在
        // const parentDir = path.dirname(path.dirname(__dirname));

        // // const folderPath = '/path/to/folder';
        // if (!fs.existsSync(Config.UPLOADS_DIR)) {
        //     await fs.promises.mkdir(Config.UPLOADS_DIR, { recursive: true }); // recursive: true } 表示在創建目錄時，如果父級目錄不存在，則會遞迴地創建所有缺少的父級目錄。
        // }

        //檢查使用者的目錄是否存在，沒有則建立目錄
        const parentDirectory = Config.UPLOADS_DIR; // 更換為父目錄的路徑
        const newDirectoryName = id; // 新子目錄的名稱
        const accountDir = path.join(parentDirectory, newDirectoryName);
        // 使用 fs.existsSync 檢查目錄是否存在
        if (!fs.existsSync(accountDir)) {
            try {
                // 如果目錄不存在，使用 fs.mkdirSync 建立目錄
                fs.mkdirSync(accountDir, { recursive: true }); // recursive 選項會自動創建所需的父目錄
                console.log(`成功建立目錄：${accountDir}`);
            } catch (err) {
                console.error(`無法建立目錄：${accountDir}`, err);
                throw new InternalError();
            }
        } else {
            console.log(`目錄已存在：${accountDir}`);
        }


        //每次上傳avatar圖片需把先前的avatar圖片刪除
        try {
            const files = fs.readdirSync(accountDir);

            for (const file of files) {
                if (file.startsWith(`${id}-`)) {
                    const filePath = path.join(accountDir, file);
                    fs.unlinkSync(filePath);
                    console.log(`成功刪除檔案 ${file}`);
                }
            }
        } catch (err) {
            console.error('發生錯誤：', err);
        }


        // 設定儲存路徑
        const tmpduploadPath = path.join(accountDir, tmpFilename);
        const realUploadPath = path.join(accountDir, realFilename);
        console.log(`檔案路徑: ${realUploadPath}`);

        // 將圖片檔案儲存到指定路徑
        await fs.promises.rename(image.filepath, tmpduploadPath);//檔名相同會覆蓋掉原來檔案

        //sharp調整圖片
        //Instagram profile picture size: 320 x 320 pixels
        await sharp(tmpduploadPath).resize(320, 320).toFile(realUploadPath);

        //通知MQ
        messageService.publish(new PictureUploadedPublisher({
            accountId: id,
            picUrl: `/api/pictures/${realFilename}`
        }));

        ctx.status = 201;
        ctx.body = {
            message: 'Image uploaded successfully.',
            imageUrl: `/api/pictures/${realFilename}`,
        };
    });

    return route.routes();
}

export { uploadRoute };