/*
SQLyog Community v12.12 (64 bit)
MySQL - 5.6.16 : Database - sguard
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
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

insert  into `administradores`(`administradorId`,`nombre`,`login`,`password`,`email`) values (2,'MI segundo adm','ad2','ad2',NULL),(4,'Administrador Principal','admin','admin','adm@gh.com'),(5,'Juan Peleon','juan','juan','juan@gmail.com');

/*Table structure for table `descargas` */

DROP TABLE IF EXISTS `descargas`;

CREATE TABLE `descargas` (
  `descargaId` int(11) NOT NULL AUTO_INCREMENT,
  `nterminal` varchar(255) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `resultado` text,
  PRIMARY KEY (`descargaId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `descargas` */

insert  into `descargas`(`descargaId`,`nterminal`,`fecha`,`hora`,`resultado`) values (2,'112339','2015-10-07','13:32:15','CARGA SIMPLE TERMINAL [SIN PROCESO]'),(3,'112339','2015-10-07','13:33:42','CARGA SIMPLE TERMINAL [SIN PROCESO]'),(4,'112339','2015-10-07','13:36:32','CARGA SIMPLE TERMINAL [SIN PROCESO]'),(5,'112339','2015-10-07','14:07:06','CARGA SIMPLE TERMINAL [SIN PROCESO]'),(6,'112339','2015-10-07','14:07:59','CARGA SIMPLE TERMINAL [SIN PROCESO]');

/*Table structure for table `descargas_lineas` */

DROP TABLE IF EXISTS `descargas_lineas`;

CREATE TABLE `descargas_lineas` (
  `descargaLineaId` int(11) NOT NULL AUTO_INCREMENT,
  `descargaId` int(11) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  PRIMARY KEY (`descargaLineaId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `descargas_lineas` */

insert  into `descargas_lineas`(`descargaLineaId`,`descargaId`,`tag`,`fecha`,`hora`) values (1,5,'0004044154','2015-10-07','12:25:13'),(2,5,'0406215258','2015-10-07','13:10:49'),(3,5,'0406213943','2015-10-07','13:10:52'),(4,5,'0403669508','2015-10-07','13:10:55');

/*Table structure for table `edificios` */

DROP TABLE IF EXISTS `edificios`;

CREATE TABLE `edificios` (
  `edificioId` int(11) NOT NULL AUTO_INCREMENT,
  `grupoId` int(11) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`edificioId`),
  KEY `ref_grupo` (`grupoId`),
  CONSTRAINT `ref_grupo` FOREIGN KEY (`grupoId`) REFERENCES `grupos` (`grupoId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `edificios` */

insert  into `edificios`(`edificioId`,`grupoId`,`nombre`) values (3,3,'Obra central'),(4,4,'En L2'),(5,3,'Hipercasa');

/*Table structure for table `grupos` */

DROP TABLE IF EXISTS `grupos`;

CREATE TABLE `grupos` (
  `grupoId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`grupoId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `grupos` */

insert  into `grupos`(`grupoId`,`nombre`) values (3,'Grupo L1'),(4,'Grupo L2');

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `puntos` */

insert  into `puntos`(`puntoId`,`nombre`,`edificioId`,`tag`,`cota`,`cubiculo`,`observaciones`) values (1,'Control 01',3,'00111','45',NULL,'Este es un punto interesante'),(2,'Control 02',4,'014552',NULL,NULL,NULL),(3,'FGGDT7899',4,'0045669','788','899','Hola que hse'),(4,'Mi punto',3,'0406219258','C1','CB45',NULL);

/*Table structure for table `rondas` */

DROP TABLE IF EXISTS `rondas`;

CREATE TABLE `rondas` (
  `rondaId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `tagf` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`rondaId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

/*Data for the table `rondas` */

insert  into `rondas`(`rondaId`,`nombre`,`tag`,`tagf`) values (1,'Ronda Exterior 1500',NULL,NULL),(2,'Ronda Interior',NULL,NULL),(11,'La ronda de noche','0406215258','0403669508'),(12,'Vamos a ver la ronda','0406215258','0406215258');

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `rondas_realizadas` */

insert  into `rondas_realizadas`(`rondaRealizadaId`,`rondaId`,`vigilanteId`,`fecha`,`hora`,`resultado`) values (2,1,4,'2015-10-04','15:16:00','FALTAN PUNTOS'),(4,2,4,'2015-10-05','20:16:00','CORRECTO'),(5,2,5,'2015-10-05','20:16:00','CORRECTO');

/*Table structure for table `rondas_realizadaspuntos` */

DROP TABLE IF EXISTS `rondas_realizadaspuntos`;

CREATE TABLE `rondas_realizadaspuntos` (
  `rondaRealizadaPuntoId` int(11) NOT NULL AUTO_INCREMENT,
  `rondaRealizadaId` int(11) DEFAULT NULL,
  `orden` int(1) DEFAULT NULL,
  `puntoId` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `resultado` text,
  PRIMARY KEY (`rondaRealizadaPuntoId`),
  KEY `ref_rondaRealizada` (`rondaRealizadaId`),
  KEY `ref_punto2` (`puntoId`),
  CONSTRAINT `ref_punto2` FOREIGN KEY (`puntoId`) REFERENCES `puntos` (`puntoId`),
  CONSTRAINT `ref_rondaRealizada` FOREIGN KEY (`rondaRealizadaId`) REFERENCES `rondas_realizadas` (`rondaRealizadaId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `rondas_realizadaspuntos` */

insert  into `rondas_realizadaspuntos`(`rondaRealizadaPuntoId`,`rondaRealizadaId`,`orden`,`puntoId`,`fecha`,`hora`,`resultado`) values (3,2,1,1,'2015-10-04','16:00:00','CORRECTO'),(4,2,2,2,NULL,NULL,'FALTA');

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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

/*Data for the table `rondaspuntos` */

insert  into `rondaspuntos`(`rondaPuntoId`,`orden`,`rondaId`,`puntoId`) values (1,1,1,1),(4,1,2,1),(14,2,1,2),(17,1,11,1),(18,2,11,4),(19,2,12,4),(20,3,12,1);

/*Table structure for table `vigilantes` */

DROP TABLE IF EXISTS `vigilantes`;

CREATE TABLE `vigilantes` (
  `vigilanteId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `tagf` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`vigilanteId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `vigilantes` */

insert  into `vigilantes`(`vigilanteId`,`nombre`,`tag`,`tagf`) values (4,'Garcia Pedroche, Manuel','0004044154',NULL),(5,'Mark Twain','004564564',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
