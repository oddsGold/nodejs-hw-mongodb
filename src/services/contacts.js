import { ContactsCollection } from "../db/models/contacts.js"

class ContactsService {
    async getAllContacts() {
        const contacts = await ContactsCollection.find();
        return contacts;
    }
    async getContactById(contactId) {
        const contact = await ContactsCollection.findById(contactId);
        return contact;
    }

}

export default new ContactsService();
