import { Router } from "express";
const router = Router();

/** import controllers */
import * as controller from '../controllers/controller.js';

/** Questions Routes API */

router.route('/questions')
        .get(controller.getQuestions) /** GET Request */
        .post(controller.insertQuestions) /** POST Request */
        .delete(controller.dropQuestions) /** DELETE Request */

router.route('/result')
        .get(controller.getResult) /** GET Request */
        .post(controller.storeResult) /** POST Request */
        .delete(controller.dropResult) /** DELETE Request */

export default router;