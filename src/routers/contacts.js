import {Router} from "express";
import ContactController from '../controllers/contact-controller.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import isValidId  from '../middlewares/isValidId.js'
import {
    validateContactCreate,
    validateContactUpdate
} from '../validation/contactsValidation.js';
import {validateBody} from "../middlewares/validateBody.js";
import {authenticate} from "../middlewares/authenticate.js";

const router = new Router();

router.get('/contacts', authenticate, ctrlWrapper(ContactController.getContacts));
router.get('/contacts/:contactId', authenticate, isValidId, ctrlWrapper(ContactController.getContact));
router.post('/contacts', authenticate, validateBody(validateContactCreate), ctrlWrapper(ContactController.createNewContact));
router.patch('/contacts/:contactId', authenticate, validateBody(validateContactUpdate), ctrlWrapper(ContactController.patchContact));
router.delete('/contacts/:contactId', authenticate, isValidId, ctrlWrapper(ContactController.deleteContact));

export default router;
