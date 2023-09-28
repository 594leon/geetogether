import { Context, Next } from 'koa';
import { BadRequestError } from '@serjin/common';


const validateImageType = (maxFileSize: number) => {

  return async (ctx: Context, next: Next) => {
    const image = ctx.request.files?.image; //前端form-data的上傳圖片要放在一個key名稱image裡面

    console.log('ctx.request.files: ' + JSON.stringify(ctx.request.files));
    // 檢查是否有上傳檔案
    if (!image) {
      throw new BadRequestError('No files uploaded');
    }

    //檢查是否上傳多個檔案
    if (Array.isArray(image)) {
      throw new BadRequestError('Multiple image uploads are not supported');
    }

    if (!image.mimetype) {
      throw new BadRequestError('request MIME type is missing');
    }

    // 檢查類型是否符合限制
    if (!['image/jpeg', 'image/png'].includes(image.mimetype)) {
      throw new BadRequestError('Invalid image type. Only JPEG and PNG are allowed');
    }

    if (image.size > maxFileSize) {
      throw new BadRequestError('Image size exceeds the maximum limit');
    }

    await next();
  }
}

export { validateImageType };