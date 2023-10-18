/**
 * Check if any of the words are in the string
 */
export const haveAnyInString = (str: string, words: string[]) => {
  const preProcessedString = str.toLowerCase();
  return words.some((word) => preProcessedString.includes(word));
};

/**
 * Fetch image from URL and return as buffer
 * @param imageUrl URL for image to download
 * @returns Buffer of image
 */
export const fetchImageToBuffer = async (imageUrl: string) => {
  const response = await fetch(imageUrl);
  const data = await response.arrayBuffer();
  const buffer = Buffer.from(data);
  return buffer;
};

export const fetchTextToBuffer = async (textUrl: string) => {
  const response = await fetch(textUrl);
  const data = await response.text();
  const buffer = Buffer.from(data);
  return buffer;
};

/**
 * Exclude keys from object
 */
export const exclude = <User, Key extends keyof User>(user: User, keys: Key[]): Omit<User, Key> => {
  for (let key of keys) {
    delete user[key];
  }
  return user;
};

export const requestNotifyPermission = () => {
  if (!('Notification' in window)) {
    return;
  } else if (Notification.permission !== 'denied') {
    // We need to ask the user for permission
    Notification.requestPermission();
  }
};

export const notify = ({
  title,
  body,
  image,
  icon,
}: {
  title: string;
  body: string;
  image?: string;
  icon?: string;
}) => {
  const fire = () => {
    new Notification(title, {
      body,
      image,
      icon,
    });
  };
  if (!('Notification' in window)) {
    return;
  }
  if (Notification.permission === 'granted') {
    fire();
    return;
  }
  if (Notification.permission !== 'denied') {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        fire();
      }
    });
  }
};
