import Config from './config';
import { mongo, rabbit, MessageService, RabbitmqMessageService, Subjects } from '@serjin/common';
import { ProfileService } from './services/profile.service';
import ProfileMongoService from './services/profile.mongo.service';
import { PictureUploadedSubscriber } from './events/subscribers/picture-uploaded-subscriber';
import { AccountCreatedSubscriber } from './events/subscribers/account-created-subscriber';

const initService = async () => {

    await mongo.connectToMongoDB(Config.MONGO_URI, Config.MONGO_DB_NAME);
    console.log('Config.RABBIT_USERNAME: ' + Config.RABBIT_USERNAME);
    console.log('Config.RABBIT_PASSWORD: ' + Config.RABBIT_PASSWORD);
    await rabbit.connect(
        Config.RABBIT_HOST,
        Config.RABBIT_PORT,
        Config.RABBIT_QUEUE,
        Config.RABBIT_USERNAME,
        Config.RABBIT_PASSWORD,
        [Subjects.PictureUploaded, Subjects.ProfileCompleted, Subjects.ProfileUpdated, Subjects.AccountCreated],
        [new PictureUploadedSubscriber(), new AccountCreatedSubscriber()]
    );
}

const closeService = async () => {
    await mongo.close();
    await rabbit.close();
}

//factory pattern
const getProfileService = (): ProfileService => {
    //根據條件來決定使用哪一個database，目前只有mongodb所以直接創建ProfileMongoService
    return new ProfileMongoService(mongo);
}

//factory pattern
const getMessageService = (): MessageService => {
    return new RabbitmqMessageService();
}

export { initService, closeService, getProfileService, getMessageService };