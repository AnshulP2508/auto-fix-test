export class EncryptionBox {
  #secretKey = 'lab-secret';

  encrypt(value: string): string {
    return btoa(`${this.#secretKey}:${value}`);
  }
}
