-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: luxshop
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `rendelesek`
--

DROP TABLE IF EXISTS `rendelesek`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rendelesek` (
  `RendelesID` int NOT NULL AUTO_INCREMENT,
  `FelhasznaloID` int NOT NULL,
  `RendelesDatum` datetime DEFAULT CURRENT_TIMESTAMP,
  `Osszeg` decimal(10,2) NOT NULL,
  `Statusz` varchar(50) NOT NULL,
  `SzallitasiCim` varchar(255) DEFAULT NULL,
  `FizetesiMod` enum('Átutalás','Bankkártya') NOT NULL,
  PRIMARY KEY (`RendelesID`),
  KEY `FelhasznaloID` (`FelhasznaloID`),
  CONSTRAINT `rendelesek_ibfk_1` FOREIGN KEY (`FelhasznaloID`) REFERENCES `felhasznalok` (`FelhasznaloID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rendelesek`
--

LOCK TABLES `rendelesek` WRITE;
/*!40000 ALTER TABLE `rendelesek` DISABLE KEYS */;
INSERT INTO `rendelesek` VALUES (1,1,'2025-03-19 16:04:15',1710757.00,'Feldolgozás alatt','Luxury Avenue 1, Elite City','Átutalás'),(2,2,'2025-03-18 16:04:15',8610959.00,'Elküldve','Luxury Avenue 2, Elite City','Átutalás'),(3,3,'2025-03-17 16:04:15',9240214.00,'Feldolgozás alatt','Luxury Avenue 3, Elite City','Bankkártya'),(4,4,'2025-03-16 16:04:15',6170940.00,'Kézbesítve','Luxury Avenue 4, Elite City','Átutalás'),(5,5,'2025-03-15 16:04:15',6854146.00,'Kézbesítve','Luxury Avenue 5, Elite City','Bankkártya'),(6,6,'2025-03-14 16:04:15',3517802.00,'Visszaküldve','Luxury Avenue 6, Elite City','Bankkártya'),(7,7,'2025-03-13 16:04:15',7776001.00,'Visszaküldve','Luxury Avenue 7, Elite City','Átutalás');
/*!40000 ALTER TABLE `rendelesek` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-20 18:08:03
