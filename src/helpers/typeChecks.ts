interface User {
  id: string | number;
  email: string;
}

// This interface uses snake casing because of SQL convention.
// Should update SQL to use camel casing here...
interface AccountMessage {
  account_id: number;
  message_id: number;
  used: boolean;
}

export interface Message {
  id: number;
  subject: string;
  content: string;
}

/**
 * Checks if a type satisfies User interface
 *
 * @param item  - Item of any type
 * @returns - boolean. true if item satisfies User interface, false otherwise
 *
 */
const isUser = (item: any): item is User => {
  if (item && item.id && item.email) {
    const { id, email } = item;
    if (typeof id === 'string' || typeof id === 'number') {
      return typeof email === 'string';
    }
  }
  return false;
};

/**
 * Checks if a type satisfies AccountMessage interface
 *
 * @param item  - Item of any type
 * @returns - boolean. true if item satisfies AcccountMessage interface, false otherwise
 *
 */
const isAccountMessage = (item: any): item is AccountMessage => {
  if (item && item.account_id && item.message_id && 'used' in item) {
    const { account_id, message_id, used } = item;
    return (
      typeof account_id === 'number' &&
      typeof message_id === 'number' &&
      typeof used === 'boolean'
    );
  }
  return false;
};

/**
 * Checks if a type satisfies Message interface
 *
 * @param item  - Item of any type
 * @returns - boolean. true if item satisfies Message interface, false otherwise
 *
 */
const isMessage = (item: any): item is Message => {
  if (item && item.id && item.subject && item.content) {
    const { id, subject, content } = item;
    return (
      typeof id === 'number' &&
      typeof subject === 'string' &&
      typeof content === 'string'
    );
  }
  return false;
};

/**
 * Returns true if arr is an empty array or if all items are of type User
 *
 * @param item  - arr of any type
 * @returns - boolean. true if User array, false otherwise.
 *
 */
export const isUserArray = (arr: any): arr is User[] =>
  Array.isArray(arr) && arr.every((item) => isUser(item));

/**
 * Returns true if arr is an empty array or if all items are of type AcccountMessage
 *
 * @param item  - arr of any type
 * @returns - boolean. true if AcccountMessage array, false otherwise.
 *
 */
export const isAccountMessageArray = (arr: any): arr is AccountMessage[] =>
  Array.isArray(arr) && arr.every((item) => isAccountMessage(item));

/**
 * Returns true if arr is an empty array or if all items are of type MessageArray.
 *
 * @param item  - arr of any type
 * @returns - boolean. true if AcccountMessage array, false otherwise.
 *
 */
export const isMessageArray = (arr: any): arr is Message[] =>
  Array.isArray(arr) && arr.every((item) => isMessage(item));
