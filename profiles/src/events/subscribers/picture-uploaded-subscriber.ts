import { PictureUploadedEvent, Subjects, MsgChecker, FormattedSubscriber, MessageService, InternalError } from '@serjin/common';
import { getProfileService, getMessageService } from '../../service-injection';
import { ProfileCompletedPublisher } from '../publishers/profile-completed-publisher';
import { ProfileService } from '../../services/profile.service';
import { ProfileUpdatedPublisher } from '../publishers/profile-updated-publisher';

export class PictureUploadedSubscriber implements FormattedSubscriber<PictureUploadedEvent> {
    subject: PictureUploadedEvent['subject'] = Subjects.PictureUploaded;

    profileService: ProfileService;
    messageService: MessageService;

    constructor(profileService = getProfileService(), messageService = getMessageService()) {
        this.profileService = profileService;
        this.messageService = messageService;
    }

    async onMessage(content: { accountId: string, picUrl: string }, checker: MsgChecker) {
        console.log('PictureUploadedSubscriber: picurl: ' + content.picUrl);
        const profile = await this.profileService.findById(content.accountId);
        if (profile?.id) {
            const isFirst = profile.avatar === 'empty.png';

            //先註解掉Transaction，因為mongoDB限定Transaction機制要在replica set下才能工作
            // await this.profileService.withTransaction<void>(async (session) => {
            //     await this.profileService.update(profile.id, { avatar: content.picUrl }, session);
            //     this.messageService.publish(new ProfileCompletedPublisher({
            //         id: profile.id.toString(),
            //         accountId: profile.accountId,
            //         name: profile.name,
            //         age: profile.age,
            //         gender: profile.gender,
            //         zodiacSign: profile.zodiacSign,
            //         myTags: profile.myTags,
            //         avatar: profile.avatar,
            //         version: profile.version
            //     }));
            // });

            await this.profileService.update(profile.id, { avatar: content.picUrl });
            const updatedProfile = await this.profileService.findById(profile.id);
            if (!updatedProfile) {
                console.log('Profile not Found!');
                throw new InternalError();
            }
            if (isFirst) {
                this.messageService.publish(new ProfileCompletedPublisher({
                    id: updatedProfile.id,
                    name: updatedProfile.name,
                    age: updatedProfile.age,
                    gender: updatedProfile.gender,
                    zodiacSign: updatedProfile.zodiacSign,
                    myTags: updatedProfile.myTags,
                    avatar: updatedProfile.avatar,
                    version: updatedProfile.version
                }));
            } else {
                this.messageService.publish(new ProfileUpdatedPublisher({
                    id: updatedProfile.id,
                    name: updatedProfile.name,
                    age: updatedProfile.age,
                    gender: updatedProfile.gender,
                    zodiacSign: updatedProfile.zodiacSign,
                    myTags: updatedProfile.myTags,
                    avatar: updatedProfile.avatar,
                    version: updatedProfile.version
                }));
            }
        } else {
            console.log('profile not found');
        }
        checker.ack();
    };
}