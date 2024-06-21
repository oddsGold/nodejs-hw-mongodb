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

    async createContact(data) {
        const contact = await ContactsCollection.create(data);
        return contact;
    }

    async updateContact(id, data, options = {}){
        const res = await ContactsCollection.findOneAndUpdate(
            {_id: id},
            data,
            {
                new: true,
                includeResultMetadata: true,
                ...options,
            }
        )

        if (!res || !res.value) return null;

        return {
            contact: res.value,
            isNew: Boolean(res?.lastErrorObject?.upserted),
        };
    }

    async deleteContact(id) {
        const contact = await ContactsCollection.findOneAndDelete({
            _id: id,
        });

        return contact;
    }

}

export default new ContactsService();
