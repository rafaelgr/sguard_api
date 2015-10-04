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

/*Table structure for table `puntos` */

DROP TABLE IF EXISTS `puntos`;

CREATE TABLE `puntos` (
  `puntoId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `bloque` varchar(255) DEFAULT NULL,
  `edificio` varchar(255) DEFAULT NULL,
  `cota` varchar(255) DEFAULT NULL,
  `observaciones` text,
  PRIMARY KEY (`puntoId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `puntos` */

insert  into `puntos`(`puntoId`,`nombre`,`tag`,`bloque`,`edificio`,`cota`,`observaciones`) values 
(1,'Control 01','00111','CX','444','45','Este es un punto interesante'),
(2,'Control 02','014552',NULL,NULL,NULL,NULL);

/*Table structure for table `rondas` */

DROP TABLE IF EXISTS `rondas`;

CREATE TABLE `rondas` (
  `rondaId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`rondaId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `rondas` */

insert  into `rondas`(`rondaId`,`nombre`) values 
(1,'Ronda Exterior'),
(2,'Ronda Interior');

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `rondaspuntos` */

insert  into `rondaspuntos`(`rondaPuntoId`,`orden`,`rondaId`,`puntoId`) values 
(1,1,1,1),
(4,1,2,1),
(6,2,1,2);

/*Table structure for table `vigilantes` */

DROP TABLE IF EXISTS `vigilantes`;

CREATE TABLE `vigilantes` (
  `vigilanteId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `tag` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`vigilanteId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `vigilantes` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
