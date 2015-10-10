/*
SQLyog Community v12.14 (32 bit)
MySQL - 5.6.26-log : Database - sguard
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`sguard` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `sguard`;

/*Table structure for table `administradores` */

DROP TABLE IF EXISTS `administradores`;

CREATE TABLE `administradores` (
  `administradorId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(765) DEFAULT NULL,
  `login` varchar(765) DEFAULT NULL,
  `password` varchar(765) DEFAULT NULL,
  `email` varchar(765) DEFAULT NULL,
  PRIMARY KEY (`administradorId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `administradores` */

insert  into `administradores`(`administradorId`,`nombre`,`login`,`password`,`email`) values 
(2,'MI segundo adm','ad2','ad2',NULL),
(4,'Administrador Principal','admin','admin','adm@gh.com'),
(5,'Juan Peleon','juan','juan','juan@gmail.com');

/*Table structure for table `descargas` */

DROP TABLE IF EXISTS `descargas`;

CREATE TABLE `descargas` (
  `descargaId` int(11) NOT NULL AUTO_INCREMENT,
  `nterminal` varchar(255) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `resultado` text,
  PRIMARY KEY (`descargaId`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

/*Data for the table `descargas` */

insert  into `descargas`(`descargaId`,`nterminal`,`fecha`,`hora`,`resultado`) values 
(21,'112339','2015-10-07','18:02:27','CARGA SIMPLE TERMINAL [SIN PROCESO]'),
(22,'112339','2015-10-07','18:06:04','CARGA SIMPLE TERMINAL [SIN PROCESO]'),
(23,'112339','2015-10-07','18:09:26','CARGA SIMPLE TERMINAL [SIN PROCESO]'),
(24,'112339','2015-10-07','18:12:25','CARGA SIMPLE TERMINAL [SIN PROCESO]');

/*Table structure for table `descargas_lineas` */

DROP TABLE IF EXISTS `descargas_lineas`;

CREATE TABLE `descargas_lineas` (
  `descargaLineaId` int(11) NOT NULL AUTO_INCREMENT,
  `descargaId` int(11) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `tipoId` int(11) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`descargaLineaId`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8;

/*Data for the table `descargas_lineas` */

insert  into `descargas_lineas`(`descargaLineaId`,`descargaId`,`tag`,`fecha`,`hora`,`tipo`,`tipoId`,`nombre`) values 
(35,21,'0004044154','2015-10-07','18:00:44','VIGILANTE',6,NULL),
(36,21,'0406213943','2015-10-07','18:00:47',NULL,NULL,NULL),
(37,21,'0406215258','2015-10-07','18:00:50','PUNTO',5,NULL),
(38,21,'0406219258','2015-10-07','18:00:53','PUNTO',6,NULL),
(39,21,'0406220547','2015-10-07','18:00:57','RONDA',14,NULL),
(40,21,'0403669508','2015-10-07','18:01:00','PUNTO',8,NULL),
(41,21,'0406209033','2015-10-07','18:01:03','PUNTO',7,NULL),
(42,21,'0004049464','2015-10-07','18:01:09',NULL,NULL,NULL),
(43,21,'0406220547','2015-10-07','18:01:11','RONDA',14,NULL),
(44,21,'0403669508','2015-10-07','18:01:13','PUNTO',8,NULL),
(45,21,'0406209033','2015-10-07','18:01:15','PUNTO',7,NULL),
(46,21,'0406213943','2015-10-07','18:01:19',NULL,NULL,NULL),
(47,21,'0406219258','2015-10-07','18:01:21','PUNTO',6,NULL),
(48,21,'0406215258','2015-10-07','18:01:23','PUNTO',5,NULL),
(49,21,'0004044154','2015-10-07','18:01:32','VIGILANTE',6,NULL),
(50,21,'0403669508','2015-10-07','18:01:34','PUNTO',8,NULL),
(51,21,'0406209033','2015-10-07','18:01:36','PUNTO',7,NULL),
(52,21,'0406215258','2015-10-07','18:01:40','PUNTO',5,NULL),
(53,21,'0406220547','2015-10-07','18:01:43','RONDA',14,NULL),
(54,21,'0406219258','2015-10-07','18:01:45','PUNTO',6,NULL),
(55,21,'0406215258','2015-10-07','18:01:46','PUNTO',5,NULL),
(56,21,'0403669508','2015-10-07','18:01:47','PUNTO',8,NULL),
(57,21,'0004049464','2015-10-07','18:01:51',NULL,NULL,NULL),
(58,21,'0406213943','2015-10-07','18:01:53',NULL,NULL,NULL),
(59,21,'0406215258','2015-10-07','18:01:54','PUNTO',5,NULL),
(60,21,'0403669508','2015-10-07','18:01:55','PUNTO',8,NULL),
(61,22,'0004049464','2015-10-07','18:05:37','VIGILANTE',7,NULL),
(62,22,'0406220547','2015-10-07','18:05:39','RONDA',14,NULL),
(63,22,'0403669508','2015-10-07','18:05:41','PUNTO',8,NULL),
(64,22,'0406209033','2015-10-07','18:05:43','PUNTO',7,NULL),
(65,22,'0406213943','2015-10-07','18:05:48',NULL,NULL,NULL),
(66,22,'0406215258','2015-10-07','18:05:50','PUNTO',5,NULL),
(67,22,'0406219258','2015-10-07','18:05:51','PUNTO',6,NULL),
(68,23,'0004044154','2015-10-07','18:08:50','VIGILANTE',6,NULL),
(69,23,'0406213943','2015-10-07','18:08:52',NULL,NULL,NULL),
(70,23,'0406215258','2015-10-07','18:08:53','PUNTO',5,NULL),
(71,23,'0406219258','2015-10-07','18:08:54','PUNTO',6,NULL),
(72,23,'0406220547','2015-10-07','18:08:56','RONDA',14,NULL),
(73,23,'0406209033','2015-10-07','18:08:57','PUNTO',7,NULL),
(74,23,'0403669508','2015-10-07','18:08:58','PUNTO',8,NULL),
(75,24,'0406220547','2015-10-07','18:11:37','RONDA',14,NULL);

/*Table structure for table `edificios` */

DROP TABLE IF EXISTS `edificios`;

CREATE TABLE `edificios` (
  `edificioId` int(11) NOT NULL AUTO_INCREMENT,
  `grupoId` int(11) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`edificioId`),
  KEY `ref_grupo` (`grupoId`),
  CONSTRAINT `ref_grupo` FOREIGN KEY (`grupoId`) REFERENCES `grupos` (`grupoId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `edificios` */

insert  into `edificios`(`edificioId`,`grupoId`,`nombre`) values 
(6,5,'Edificio principal');

/*Table structure for table `grupos` */

DROP TABLE IF EXISTS `grupos`;

CREATE TABLE `grupos` (
  `grupoId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`grupoId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `grupos` */

insert  into `grupos`(`grupoId`,`nombre`) values 
(5,'GRUPO 1');

/*Table structure for table `puntos` */

DROP TABLE IF EXISTS `puntos`;

CREATE TABLE `puntos` (
  `puntoId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `edificioId` int(11) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `cota` varchar(255) DEFAULT NULL,
  `cubiculo` varchar(255) DEFAULT NULL,
  `observaciones` text,
  PRIMARY KEY (`puntoId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Data for the table `puntos` */

insert  into `puntos`(`puntoId`,`nombre`,`edificioId`,`tag`,`cota`,`cubiculo`,`observaciones`) values 
(5,'Control 1',6,'0406215258','C1','CB1','Primer punto'),
(6,'Control 2',6,'0406219258','C1','CB2','Segundo punto'),
(7,'Control 3',6,'0406209033','C1','CB3','Tercer punto'),
(8,'Punto Flotante',6,'0403669508','CF','CBF','El punto que flota');

/*Table structure for table `rondas` */

DROP TABLE IF EXISTS `rondas`;

CREATE TABLE `rondas` (
  `rondaId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `tagf` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`rondaId`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

/*Data for the table `rondas` */

insert  into `rondas`(`rondaId`,`nombre`,`tag`,`tagf`) values 
(13,'Ronda 01-02','0406215258',NULL),
(14,'R-03-F','0406220547',NULL);

/*Table structure for table `rondas_realizadas` */

DROP TABLE IF EXISTS `rondas_realizadas`;

CREATE TABLE `rondas_realizadas` (
  `rondaRealizadaId` int(11) NOT NULL AUTO_INCREMENT,
  `rondaId` int(11) DEFAULT NULL,
  `vigilanteId` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `resultado` text,
  PRIMARY KEY (`rondaRealizadaId`),
  KEY `ref_ronda2` (`rondaId`),
  KEY `ref_vigilante` (`vigilanteId`),
  CONSTRAINT `ref_ronda2` FOREIGN KEY (`rondaId`) REFERENCES `rondas` (`rondaId`),
  CONSTRAINT `ref_vigilante` FOREIGN KEY (`vigilanteId`) REFERENCES `vigilantes` (`vigilanteId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `rondas_realizadas` */

insert  into `rondas_realizadas`(`rondaRealizadaId`,`rondaId`,`vigilanteId`,`fecha`,`hora`,`resultado`) values 
(6,NULL,NULL,'2015-10-09','10:00:00','descomocido');

/*Table structure for table `rondas_realizadaspuntos` */

DROP TABLE IF EXISTS `rondas_realizadaspuntos`;

CREATE TABLE `rondas_realizadaspuntos` (
  `rondaRealizadaPuntoId` int(11) NOT NULL AUTO_INCREMENT,
  `rondaRealizadaId` int(11) DEFAULT NULL,
  `orden` int(1) DEFAULT NULL,
  `puntoId` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `tagleido` varchar(255) DEFAULT NULL,
  `resultado` text,
  PRIMARY KEY (`rondaRealizadaPuntoId`),
  KEY `ref_rondaRealizada` (`rondaRealizadaId`),
  KEY `ref_punto2` (`puntoId`),
  CONSTRAINT `ref_punto2` FOREIGN KEY (`puntoId`) REFERENCES `puntos` (`puntoId`),
  CONSTRAINT `ref_rondaRealizada` FOREIGN KEY (`rondaRealizadaId`) REFERENCES `rondas_realizadas` (`rondaRealizadaId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `rondas_realizadaspuntos` */

/*Table structure for table `rondaspuntos` */

DROP TABLE IF EXISTS `rondaspuntos`;

CREATE TABLE `rondaspuntos` (
  `rondaPuntoId` int(11) NOT NULL AUTO_INCREMENT,
  `orden` int(11) DEFAULT NULL,
  `rondaId` int(11) DEFAULT NULL,
  `puntoId` int(11) DEFAULT NULL,
  PRIMARY KEY (`rondaPuntoId`),
  KEY `ref_ronda` (`rondaId`),
  KEY `ref_punto` (`puntoId`),
  CONSTRAINT `ref_punto` FOREIGN KEY (`puntoId`) REFERENCES `puntos` (`puntoId`),
  CONSTRAINT `ref_ronda` FOREIGN KEY (`rondaId`) REFERENCES `rondas` (`rondaId`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

/*Data for the table `rondaspuntos` */

insert  into `rondaspuntos`(`rondaPuntoId`,`orden`,`rondaId`,`puntoId`) values 
(21,1,13,5),
(22,2,13,6),
(23,1,14,7),
(24,2,14,8);

/*Table structure for table `vigilantes` */

DROP TABLE IF EXISTS `vigilantes`;

CREATE TABLE `vigilantes` (
  `vigilanteId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `tagf` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`vigilanteId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `vigilantes` */

insert  into `vigilantes`(`vigilanteId`,`nombre`,`tag`,`tagf`) values 
(6,'Fernando Colomo','0004044154',NULL),
(7,'Pedro Martinez','0004049464',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
