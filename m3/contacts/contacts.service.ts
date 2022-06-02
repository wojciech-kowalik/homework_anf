import { v4 as uuid } from "uuid";

export interface Contact {
  id: string;
  name: string;
  details: string;
}

export interface ServiceInterface<T> {
  getAll: () => Promise<T[]>;
  update: (updateCallback: (data: T[]) => void) => void;
  save: (entity: T) => Promise<T>;
}

export class ContactsService implements ServiceInterface<Contact> {
  constructor(private contacts: Contact[]) {}

  async getAll() {
    return this.contacts;
  }

  update(updateCallback: (contacts: Contact[]) => void) {
    const clone = [...this.contacts];
    updateCallback(clone);
    this.contacts = clone;
  }

  async save(contact: Contact) {
    const index = this.contacts.findIndex(({ id }) => contact.id === id);

    if (index === -1) {
      contact.id = uuid();
      this.update((contacts) => contacts.push(contact));
    } else {
      this.update((contacts) => contacts.splice(index, 1, contact));
    }

    return contact;
  }
}
