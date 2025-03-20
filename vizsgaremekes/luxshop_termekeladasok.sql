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
-- Table structure for table `termekeladasok`
--

DROP TABLE IF EXISTS `termekeladasok`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `termekeladasok` (
  `EladasID` int NOT NULL AUTO_INCREMENT,
  `TermekID` int NOT NULL,
  `EladoID` int NOT NULL,
  `VasarloID` int NOT NULL,
  `RendelesID` int DEFAULT NULL,
  `Mennyiseg` int NOT NULL,
  `EladasAr` decimal(10,2) NOT NULL,
  `EladasDatum` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`EladasID`),
  KEY `TermekID` (`TermekID`),
  KEY `EladoID` (`EladoID`),
  KEY `VasarloID` (`VasarloID`),
  KEY `RendelesID` (`RendelesID`),
  CONSTRAINT `termekeladasok_ibfk_1` FOREIGN KEY (`TermekID`) REFERENCES `termekek` (`TermekID`),
  CONSTRAINT `termekeladasok_ibfk_2` FOREIGN KEY (`EladoID`) REFERENCES `felhasznalok` (`FelhasznaloID`),
  CONSTRAINT `termekeladasok_ibfk_3` FOREIGN KEY (`VasarloID`) REFERENCES `felhasznalok` (`FelhasznaloID`),
  CONSTRAINT `termekeladasok_ibfk_4` FOREIGN KEY (`RendelesID`) REFERENCES `rendelesek` (`RendelesID`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `termekeladasok`
--

LOCK TABLES `termekeladasok` WRITE;
/*!40000 ALTER TABLE `termekeladasok` DISABLE KEYS */;
INSERT INTO `termekeladasok` VALUES (1,1,1,1,1,1,2512262.00,'2025-03-19 16:04:15'),(2,2,7,2,2,3,2856396.00,'2025-03-18 16:04:15'),(3,3,6,3,3,2,1447347.00,'2025-03-17 16:04:15'),(4,4,7,4,4,3,4593221.00,'2025-03-16 16:04:15'),(5,5,2,5,5,2,2434781.00,'2025-03-15 16:04:15'),(6,6,6,6,6,1,2259707.00,'2025-03-14 16:04:15'),(7,7,1,7,7,1,2249826.00,'2025-03-13 16:04:15');
/*!40000 ALTER TABLE `termekeladasok` ENABLE KEYS */;
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
