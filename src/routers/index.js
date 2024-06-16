import {Router} from "express";
import ContactController from '../controllers/contact-controller.js';


const router = new Router();

router.get('/contacts', ContactController.getContacts);

export default router;
