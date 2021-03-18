export class User {
    id: string;
    username: string;
    token?: string

    constructor(options: {
        id?: string,
        username?: string,
        token?: string
      } = {}) {
          this.id = options.id || null;
          this.username = options.username || '';
          this.token = options.token || '';
    }
}
