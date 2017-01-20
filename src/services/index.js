import angular from 'angular';
import ckconfigureService from './ckconfigure-service';
import ckqueryService from './ckquery-service';
import ckrecordService from './ckrecord-service';
import ckauthenticateService from './ckauthenticate-service';
import ckassetService from './ckasset-service';
import authService from './auth-service';
import eventService from './event-service';
import imageService from './image-service';
import imageFileService from './image-file-service';
import guardService from './guard-service';

const services = angular.module('services', [])
.factory('ckconfigureService', ckconfigureService)
.factory('ckqueryService', ckqueryService)
.factory('ckrecordService', ckrecordService)
.factory('ckauthenticateService', ckauthenticateService)
.factory('imageService', imageService)
.factory('imageFileService', imageFileService)
.factory('ckassetService', ckassetService)
.factory('authService', authService)
.factory('eventService', eventService)
.factory('guardService', guardService);

export default services.name;
