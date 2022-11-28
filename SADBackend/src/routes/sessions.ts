import { Router } from 'express';
import SessionController from '../controllers/session';
import UserController from '../controllers/user';
import { IRoute } from '../interfaces/routes';
import {AuthenticateRequest, AuthoriseByRoles} from '../middleware/auth';
 import ValidationMiddleware from '../middleware/validate';
import { GetSessionForStudentBody, GetSessionForStudentParams_ValidationStage, GetAttendenceForSessionParams, GetAttendenceForStudentParams_ValidationStage, GetSessionsQuery, SessionPostRequest_Stage1, UpdateStudentAttendanceBody, GetSessionsQueryBody, GetSessionByID_ValidationStage, SessionPutRequest_ValidationStage } from '../validation/session';
export default class SessionRoute implements IRoute {
  public path = '/sessions/';
  public router = Router();
  public sessionController = new SessionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}resource/`, AuthenticateRequest, AuthoriseByRoles(["Admin"]), ValidationMiddleware(SessionPostRequest_Stage1, 'body'), this.sessionController.PostSession);
    this.router.get(`${this.path}GetSessionsForStudent/:studentID`, AuthenticateRequest, AuthoriseByRoles(["Admin"]), ValidationMiddleware(GetSessionForStudentParams_ValidationStage, 'params'), ValidationMiddleware(GetSessionsQuery, 'query'), ValidationMiddleware(GetSessionForStudentBody, 'body'), this.sessionController.GetAllSessionsForStudent);
    this.router.get(`${this.path}GetSessionAttendence/:sessionID`, AuthenticateRequest, ValidationMiddleware(GetAttendenceForSessionParams, 'params'),  this.sessionController.GetSessionAttendence);
    this.router.get(`${this.path}GetUserAttendence/:sessionID/:studentID`, AuthenticateRequest, ValidationMiddleware(GetAttendenceForStudentParams_ValidationStage, 'params'), this.sessionController.GetUserAttendence);
    this.router.patch(`${this.path}PatchUserAttendence/:sessionID/:studentID`, AuthenticateRequest, ValidationMiddleware(GetAttendenceForStudentParams_ValidationStage, 'params'), ValidationMiddleware(UpdateStudentAttendanceBody, 'body'), this.sessionController.PatchUserAttendence);
    this.router.delete(`${this.path}resource/:sessionID`, AuthenticateRequest, AuthoriseByRoles(["Admin"]), ValidationMiddleware(GetSessionByID_ValidationStage, 'params'),  this.sessionController.DeleteSession);
    this.router.get(`${this.path}resource/:sessionID`, AuthenticateRequest, AuthoriseByRoles(["Admin"]), ValidationMiddleware(GetSessionByID_ValidationStage, 'params'),  this.sessionController.GetSession);
    this.router.put(`${this.path}resource/:sessionID`, AuthenticateRequest, AuthoriseByRoles(["Admin"]), ValidationMiddleware(GetSessionByID_ValidationStage, 'params'), ValidationMiddleware(SessionPutRequest_ValidationStage, 'body'), this.sessionController.UpdateSession);
    this.router.get(`${this.path}resource/`, AuthenticateRequest, AuthoriseByRoles(["Admin", "Staff"]), ValidationMiddleware(GetSessionsQuery, 'query'), ValidationMiddleware(GetSessionsQueryBody, 'body'), this.sessionController.GetSessions);

    // this.router.get(`${this.path}resource/`, AuthenticateRequest, ValidationMiddleware(GetUsersQuery, 'query'), ValidationMiddleware(GetUsersQueryBody, 'body'),  this.userController.GetUsers);
    // this.router.get(`${this.path}resource/:id`, AuthenticateRequest, ValidationMiddleware(GetUserByID, 'params'),  this.userController.GetUser);
    // this.router.get(`${this.path}self`, AuthenticateRequest, this.userController.GetCurrentUser);
  }
}