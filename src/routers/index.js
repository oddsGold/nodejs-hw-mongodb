import {Router} from "express";
import ContactController from '../controllers/contact-controller.js';


const router = new Router();

router.get('/contacts', ContactController.getContacts);
router.get('/contacts/:contactId', ContactController.getContact);

export default router;
