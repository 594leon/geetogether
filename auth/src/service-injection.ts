import Config from './config';
import { mongo, rabbit, Subjects, MessageService, RabbitmqMessageService } from '@serjin/common';
import AccountService from './services/account.service';
import AccountMongoService from './services/account.mongo.service';

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
        [Subjects.AccountCreated, Subjects.AccountLogin],
        [],
        Config.RABBIT_SECRET,
        Config.K8S_NAMESPACE
    );
}

const closeService = async () => {
    await mongo.close();
    await rabbit.close();
}

//factory pattern
const getAccountService = (): AccountService => {
    //根據條件來決定使用哪一個database，目前只有mongodb所以直接創建UserMongoService
    return new AccountMongoService(mongo);
}

//factory pattern
const getMessageService = (): MessageService => {
    return new RabbitmqMessageService();
}

export { initService, closeService, getAccountService, getMessageService }