import Notification from "../models/notification.js";

export const createNotification = async (senderId, receiverId, navigationId, message, notificationType) => {
  try {
    const newNotification = new Notification({
      sender: senderId,
      receiver: receiverId,
      navigationId: navigationId,
      message: message,
      notificationType: notificationType
    });

    const createdNotification = await newNotification.save();

    return createdNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new Error('Failed to create notification');
  }
};
