import Config from './config';
import { mongo, rabbit, MessageService, RabbitmqMessageService, Subjects } from '@serjin/common';
import DatabaseService from './services/database.service';
import MongoService from './services/mongo.service';
import { ProfileCompletedSubscriber } from './events/subscribers/profile-completed-subscriber';
import { ProfileUpdatedSubscriber } from './events/subscribers/profile-updated-subscriber';
import { ExpirationPostSubscriber } from './events/subscribers/expiration-post-subscriber';
import { RoomCreatedSubscriber } from './events/subscribers/room-created-subscriber';

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
        [Subjects.ProfileCompleted, Subjects.ProfileUpdated, Subjects.ExpirationPost, Subjects.RoomCreated, Subjects.PostCreated, Subjects.PostClosed, Subjects.PostExpired],
        [new ProfileCompletedSubscriber(), new ProfileUpdatedSubscriber(), new ExpirationPostSubscriber(), new RoomCreatedSubscriber()],
    );
}

const closeService = async () => {
    await mongo.close();
    await rabbit.close();
}

//factory pattern
const getDatabaseService = (): DatabaseService => {
    //根據條件來決定使用哪一個database，目前只有mongodb所以直接創建ProfileMongoService
    return new MongoService(mongo);
}

//factory pattern
const getMessageService = (): MessageService => {
    return new RabbitmqMessageService();
}

export { initService, closeService, getDatabaseService, getMessageService };