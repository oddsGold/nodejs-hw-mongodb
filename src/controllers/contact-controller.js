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
                status: "success",
                message: "Successfully found contacts!",
                data: contacts,
            });
        }catch (e) {
            next(e);
        }
    }
}

export default new ContactController();
