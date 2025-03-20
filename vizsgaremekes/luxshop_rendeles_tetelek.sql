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
-- Table structure for table `rendeles_tetelek`
--

DROP TABLE IF EXISTS `rendeles_tetelek`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rendeles_tetelek` (
  `RendelesTetelID` int NOT NULL AUTO_INCREMENT,
  `RendelesID` int NOT NULL,
  `TermekID` int NOT NULL,
  `Mennyiseg` int NOT NULL,
  `Egysegar` decimal(10,2) NOT NULL,
  `Kedvezmeny` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`RendelesTetelID`),
  KEY `rendeles_tetelek_ibfk_2` (`TermekID`),
  KEY `rendeles_tetelek_ibfk_1` (`RendelesID`),
  CONSTRAINT `rendeles_tetelek_ibfk_1` FOREIGN KEY (`RendelesID`) REFERENCES `rendelesek` (`RendelesID`) ON DELETE CASCADE,
  CONSTRAINT `rendeles_tetelek_ibfk_2` FOREIGN KEY (`TermekID`) REFERENCES `termekek` (`TermekID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rendeles_tetelek`
--

LOCK TABLES `rendeles_tetelek` WRITE;
/*!40000 ALTER TABLE `rendeles_tetelek` DISABLE KEYS */;
INSERT INTO `rendeles_tetelek` VALUES (1,1,1,3,4503916.00,36921.00),(2,2,2,3,2746173.00,96706.00),(3,3,3,2,681542.00,73060.00),(4,4,4,3,2776458.00,65212.00),(5,5,5,3,777000.00,7457.00),(6,6,6,3,3741265.00,55194.00),(7,7,7,3,4129319.00,52963.00);
/*!40000 ALTER TABLE `rendeles_tetelek` ENABLE KEYS */;
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
