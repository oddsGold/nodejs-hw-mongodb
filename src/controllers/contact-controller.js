import ContactsService from "../services/contacts.js";
import ApiError from "../exeptions/api-error.js";
class ContactController {
    async getContacts(req, res, next) {
        try{
            const contacts = await ContactsService.getAllContacts();

            if(!contacts) {
                return next(ApiError.NotFoundError('Contacts not found'));
            }

            return res.status(200).json({
                status: 200,
                message: "Successfully found contacts!",
                data: contacts,
            });
        }catch (e) {
            next(e);
        }
    }

    async getContact(req, res, next) {
        try {
            const { contactId } = req.params;

            if (!contactId.match(/^[0-9a-fA-F]{24}$/)) {
                return next(ApiError.BadRequestError(`Invalid contact ID format`));
            }

            const contact = await ContactsService.getContactById(contactId);

            if (!contact) {
                return next(ApiError.NotFoundError(`Contact with id=${contactId} not found`));
            }

            return res.status(200).json({
                status: 200,
                message: `Successfully found contact with id ${contactId}!`,
                data: contact,
            });
        }catch (e) {
            next(e);
        }
    }

}

export default new ContactController();
