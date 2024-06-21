import ContactsService from "../services/contacts.js";
import createHttpError from 'http-errors';

class ContactController {
    async getContacts(req, res, next) {
        const contacts = await ContactsService.getAllContacts();

        if (!contacts) {
            return next(createHttpError(404, `Contacts not found`));
        }

        return res.status(200).json({
            status: 200,
            message: "Successfully found contacts!",
            data: contacts,
        });

    }

    async getContact(req, res, next) {
        const {contactId} = req.params;

        const contact = await ContactsService.getContactById(contactId);

        if (!contact) {
            return next(createHttpError(404, `Contact with id=${contactId} not found`));
        }

        return res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
    }

    async createNewContact(req, res) {
        const data = req.body;

        const contact = await ContactsService.createContact(data);

        res.status(201).json({
            status: 201,
            message: `Successfully created a contact!`,
            data: contact,
        });
    }

    async patchContact(req, res, next) {
        const { contactId } = req.params;
        const data = req.body;

        const result = await ContactsService.updateContact(contactId, data);

        if (!result) {
            return next(createHttpError(404, 'Contact not found'));
        }

        res.json({
            status: 200,
            message: `Successfully patched a contact!`,
            data: result.contact,
        });
    }

    async deleteContact(req, res, next) {
        const { contactId } = req.params;

        const contact = await ContactsService.deleteContact(contactId);

        if (!contact) {
            return next(createHttpError(404, 'Contact not found'));
        }

        res.status(204).send();
    }

}

export default new ContactController();
