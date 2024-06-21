import {Router} from "express";
import ContactController from '../controllers/contact-controller.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import isValidId  from '../middlewares/isValidId.js'
import {
    validateContactCreate,
    validateContactUpdate
} from '../validation/contactsValidation.js';


const router = new Router();

router.get('/contacts', ctrlWrapper(ContactController.getContacts));
router.get('/contacts/:contactId', isValidId, ctrlWrapper(ContactController.getContact));
router.post('/contacts', validateContactCreate, ctrlWrapper(ContactController.createNewContact));
router.patch('/contacts/:contactId', validateContactUpdate, ctrlWrapper(ContactController.patchContact));
router.delete('/contacts/:contactId', ctrlWrapper(ContactController.deleteContact));

export default router;
