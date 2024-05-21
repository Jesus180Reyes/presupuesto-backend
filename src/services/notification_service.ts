/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transaction } from 'sequelize';
// import NotificationsModel from '../models/notifications';
import admin from 'firebase-admin';
import path from 'path';
import FILES from './files';
// import FILES from '../constants/files';
// import { NotificationUtils } from '../utils/notification_utils';

export type NotificationModule = 'checks';

// const notificationUtils = new NotificationUtils();

export class NotificationBody {
  usersId: number[];
  checkId: number;
  frequencyId?: number;
  title: string;
  //usually used as body
  description: string;
  isView: boolean;
  module: NotificationModule;

  projectId?: number;

  /**
   * it could be a list of tokens of just one
   */
  tokens: any[] | any;

  constructor({
    usersId,
    checkId,
    frequencyId,
    title,
    description,
    isView = false,
    module,
    tokens,
    projectId,
  }: {
    usersId: number[];
    checkId: number;
    frequencyId?: number;
    title: string;
    description: string;
    isView: boolean;
    projectId?: number;
    module: NotificationModule;
    tokens: any[];
  }) {
    this.frequencyId = frequencyId;
    this.tokens = tokens;
    this.projectId = projectId;
    this.usersId = usersId;
    this.checkId = checkId;
    this.title = title;
    this.description = description;
    this.isView = isView;
    this.module = module;
  }
}
export class NotificationServices {
  async sendPush(data: any) {
    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(FILES.FIREBASE_CLIENT),
        });
      }
      if (data.token == null) {
        return null;
      }
      const isArray = Array.isArray(data.token);
      const message = !isArray
        ? {
            token: data.token,
            notification: {
              title: data.notification.title,
              body: data.notification.body,
            },
          }
        : {
            tokens: data.token,
            notification: {
              title: data.notification.title,
              body: data.notification.body,
            },
          };

      const response = isArray
        ? await sendMessages(message).catch(error => {
            clearUnusableTokens(error, data.token);
          })
        : await sendMessage(message).catch(error => {
            clearUnusableTokens(error, data.token);
          });
      return response;
    } catch (error: any) {
      console.error('Error sending message:', error);
      return error;
    }
  }

  async sendPushAndSave(data: NotificationBody, transaction?: Transaction) {
    //sends the notification as always has been send
    try {
      await this.sendPush({
        token: data.tokens,
        notification: {
          title: data.title,
          body: data.description,
        },
      });
    } catch (e) {
        console.error(e)
    }

    //store the new notification info
    for (const userId of data.usersId) {
      // * Guardar notificacion en BD
    //   await NotificationsModel().create(
    //     {
    //       users_id: userId,
    //       enterprise_proyects_id: data.projectId,
    //       checks_id: data.checkId,
    //       frecuency_id: data.frequencyId,
    //       description: data.description,
    //       title: data.title,
    //       is_view: data.isView,
    //       module: data.module,
    //     },
    //     { transaction }
    //   );
    }
  }
}

function sendMessages(message: any): Promise<any> {
  return admin.messaging().sendMulticast(message);
}
function sendMessage(message: any): Promise<any> {
  return admin.messaging().send(message);
}
async function clearUnusableTokens(error: any, tokens: any) {
  const isArray = Array.isArray(tokens);
  if (error?.errorCode === 'messaging/registration-token-not-registered') {
    if (isArray) {
      for (const tok of tokens) {
        // notificationUtils.deleteFCMToken(tok).catch((_: any) => {});
      }
    } else {
    //   notificationUtils.deleteFCMToken(tokens).catch((_: any) => {});
    }
  }
}
