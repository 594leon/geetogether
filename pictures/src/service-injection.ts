import Config from './config';
import { rabbit, MessageService, RabbitmqMessageService, Subjects } from '@serjin/common';

const initService = async () => {

    const event = Subjects.PictureUploaded;
    console.log('Config.RABBIT_USERNAME: ' + Config.RABBIT_USERNAME);
    console.log('Config.RABBIT_PASSWORD: ' + Config.RABBIT_PASSWORD);
    await rabbit.connect(Config.RABBIT_HOST, Config.RABBIT_PORT, Config.RABBIT_QUEUE, Config.RABBIT_USERNAME, Config.RABBIT_PASSWORD, [Subjects.PictureUploaded], []);

}

const closeService = async () => {
    await rabbit.close();
}

//factory pattern
const getMessageService = (): MessageService => {
    return new RabbitmqMessageService();
}

export { initService, closeService, getMessageService }

