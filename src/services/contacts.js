import { ContactsCollection } from "../db/models/contacts.js"
import {calculatePaginationData} from "../utils/calculatePaginationData.js";
import {SORT_ORDER} from "../constants/index.js";
import { ObjectId } from "mongodb";

class ContactsService {
    async getAllContacts({ page, perPage, sortOrder = SORT_ORDER.ASC, sortBy = '_id',filter = {}, userId}) {
        const limit = perPage;
        const skip = (page - 1) * perPage;

        const contactsQuery = ContactsCollection.find({userId: userId});

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
    async getContactById(contactId, userId) {
        const contact = await ContactsCollection.findOne({_id: contactId, userId});
        return contact;
    }

    async createContact(data, userId) {
        const contactData = { ...data, userId: userId };
        const contact = await ContactsCollection.create(contactData);
        return contact;
    }

    async updateContact(id, data, userId, options = {}){
        const res = await ContactsCollection.findOneAndUpdate(
            {
                _id: id,
                userId
            },
            data,
            {
                runValidators: true,
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

    async deleteContact(id, userId) {
        const contact = await ContactsCollection.findOneAndDelete({
            _id: id,
            userId
        });

        return contact;
    }

}

export default new ContactsService();
