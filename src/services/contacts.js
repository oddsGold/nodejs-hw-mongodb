import { ContactsCollection } from "../db/models/contacts.js"

class ContactsService {
    async getAllContacts() {
        const contacts = await ContactsCollection.find();
        return contacts;
    }
}

export default new ContactsService();
