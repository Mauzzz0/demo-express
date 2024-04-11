let storage: string[] = [];

export const tokenRepository = {
  get size() {
    return storage.length;
  },

  add(token: string): number {
    return storage.push(token);
  },

  remove(token: string) {
    storage = storage.filter((refreshToken) => token !== refreshToken);
  },

  find(token: string) {
    return storage.find((t) => t === token);
  },
};
