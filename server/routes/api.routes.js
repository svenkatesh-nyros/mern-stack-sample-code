import { Router } from 'express';

import * as UserController from '../controllers/user.controller';
import * as LaborController from '../controllers/labor.controller';
import * as AuthController from '../controllers/auth.controller';
import * as ServiceController from '../controllers/service.controller';
const router = new Router();

// Auth Controller start
router.route('/login').post(AuthController.login);
router.route('/verify_otp').post(AuthController.verify_otp);
router.route('/forgot_verify_otp').post(AuthController.forgot_verify_otp);
router.route('/resendOtp').post(AuthController.resendOtp);
router.route('/requestOTP').post(AuthController.requestOTP);
// Auth Controller end

// Service Controller starts here 
router.route('/get_services').post(ServiceController.get_services);
router.route('/get_services_page').post(ServiceController.get_services_page);
router.route('/get_custom_services').post(ServiceController.get_custom_services);//All labors list
router.route('/popular_services').post(ServiceController.popular_services);
router.route('/get_custom_skills').post(ServiceController.get_custom_skills);
router.route('/services_by_location').post(ServiceController.services_by_location);
router.route('/create_service').post(ServiceController.create_service);
// Service Controller ends here

// User Controller start
router.route('/create_user').post(UserController.create_user);
router.route('/check_user_exists').post(UserController.check_user_exists); 
router.route('/edit_user').post(UserController.edit_user);
router.route('/get_user_details').post(UserController.get_user_details);
router.route('/upload_user_profile').post(UserController.upload_user_profile);
// User Controller end

// Labor Controller Start
router.route('/get_labors').post(LaborController.get_labors);//All labors list
router.route('/get_labors_page').post(LaborController.get_labors_page);//All labors list
router.route('/all_labors').post(LaborController.all_labors);
router.route('/get_labor_details').post(LaborController.get_labor_details);
router.route('/myprofile').post(LaborController.myprofile);
router.route('/create_labor').post(LaborController.create_labor);
router.route('/edit_labor').post(LaborController.edit_labor);
router.route('/upload_profile').post(LaborController.upload_profile);
// Labor Controller End

export default router;
