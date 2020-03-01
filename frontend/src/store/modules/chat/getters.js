export const isInitialized = (state) => !!state.isInitialized;

export const isTyping = (state) => !!state.isTyping;

export const config = (state) => state.config || {};

export const cursor = (state) => state.cursor;

export const allMessages = (state) => [...state.messages];

export const sortedMessages = (state, getters) => {
  const messages = getters.allMessages;
  return messages.sort((a, b) => a.timestamp - b.timestamp);
};
