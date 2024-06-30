import { ContactsCollection } from "../db/models/contacts.js"
import {calculatePaginationData} from "../utils/calculatePaginationData.js";
import {SORT_ORDER} from "../constants/index.js";

class ContactsService {
    async getAllContacts({ page, perPage, sortOrder = SORT_ORDER.ASC, sortBy = '_id',filter = {}}) {
        const limit = perPage;
        const skip = (page - 1) * perPage;

        const contactsQuery = ContactsCollection.find();

        if (filter.type) {
            contactsQuery.where('contactType').equals(filter.type);
        }

        if (filter.isFavourite !== undefined) {
            contactsQuery.where('isFavourite').equals(filter.isFavourite);
        }

        const contactsCount = await ContactsCollection.find().merge(contactsQuery).countDocuments();
        const contacts = await contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec();

        const paginationData = calculatePaginationData(contactsCount, perPage, page);

        return {
            data: contacts,
            ...paginationData,
        };
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
