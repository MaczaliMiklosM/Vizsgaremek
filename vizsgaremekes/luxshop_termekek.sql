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
-- Table structure for table `termekek`
--

DROP TABLE IF EXISTS `termekek`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `termekek` (
  `TermekID` int NOT NULL AUTO_INCREMENT,
  `Nev` varchar(100) NOT NULL,
  `Leiras` text,
  `Ar` decimal(10,2) NOT NULL,
  `KepUrl` varchar(255) DEFAULT NULL,
  `Stock` int DEFAULT '0',
  `Marka` varchar(50) DEFAULT NULL,
  `Szin` varchar(50) DEFAULT NULL,
  `Meret` varchar(20) DEFAULT NULL,
  `Allapot` varchar(20) NOT NULL,
  `FeltoltoID` int DEFAULT NULL,
  `FeltoltesDatum` datetime DEFAULT CURRENT_TIMESTAMP,
  `Kategoria` varchar(50) NOT NULL,
  `Anyag` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`TermekID`),
  KEY `termekek_ibfk_1` (`FeltoltoID`),
  CONSTRAINT `termekek_ibfk_1` FOREIGN KEY (`FeltoltoID`) REFERENCES `felhasznalok` (`FelhasznaloID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=204 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `termekek`
--

LOCK TABLES `termekek` WRITE;
/*!40000 ALTER TABLE `termekek` DISABLE KEYS */;
INSERT INTO `termekek` VALUES (1,'Nike Air Jordan 1 Retro High OG','Ikonikus sneaker prémium bőrből',1500000.00,'jordan1.jpg',5,'Nike','Fekete',NULL,'Új',1,'2025-03-19 16:04:15','Férfi Cipő','Bőr'),(2,'Louis Vuitton LV Trainer Sneaker','Virgil Abloh tervezésében',2800000.00,'lv_trainer.jpg',3,'Louis Vuitton','Fehér',NULL,'Új',1,'2025-03-18 16:04:15','Férfi Cipő','Bőr'),(3,'Dior B23 High-Top Sneaker','Exkluzív vászon és bőr kombináció',2300000.00,'dior_b23.jpg',4,'Dior','Kék',NULL,'Új',1,'2025-03-17 16:04:15','Férfi Cipő','Vászon'),(4,'Gucci Rhyton Leather Sneaker','Oversized sneaker prémium bőrből',1700000.00,'gucci_rhyton.jpg',6,'Gucci','Bézs',NULL,'Új',1,'2025-03-16 16:04:15','Férfi Cipő','Bőr'),(5,'Prada Cloudbust Thunder','Modern, futurisztikus kialakítás',2500000.00,'prada_cloudbust.jpg',2,'Prada','Fekete',NULL,'Új',1,'2025-03-15 16:04:15','Férfi Cipő','Textil'),(6,'Balenciaga Triple S','Többszörös rétegelt talp design',2200000.00,'balenciaga_tripleS.jpg',5,'Balenciaga','Piros',NULL,'Használt',1,'2025-03-14 16:04:15','Férfi Cipő','Bőr'),(7,'Off-White x Air Jordan 4 \'Sail\'','Virgil Abloh egyedi dizájnja',2700000.00,'offwhite_jordan4.jpg',3,'Nike x Off-White','Bézs',NULL,'Használt',1,'2025-03-13 16:04:15','Női Cipő','Bőr'),(8,'Rolex Daytona Platinum','Limitált kiadású Rolex karóra',12000000.00,'rolex_daytona.jpg',2,'Rolex','Ezüst',NULL,'Új',1,'2025-03-12 16:04:15','Óra','Platina'),(9,'Patek Philippe Nautilus','Ultra luxus arany karóra',25000000.00,'patek_nautilus.jpg',1,'Patek Philippe','Arany',NULL,'Új',1,'2025-03-11 16:04:15','Óra','18K Arany'),(10,'Richard Mille RM 011','F1 ihlette high-tech óra',45000000.00,'richard_mille_rm011.jpg',1,'Richard Mille','Fekete',NULL,'Új',1,'2025-03-10 16:04:15','Óra','Titán'),(11,'Hermès Birkin 30','Kézzel készített luxus táska',18000000.00,'hermes_birkin.jpg',1,'Hermès','Bézs',NULL,'Használt',1,'2025-03-09 16:04:15','Táska','Krokodilbőr'),(12,'Chanel Classic Flap','Időtlen divatikon',14000000.00,'chanel_flap.jpg',2,'Chanel','Fekete',NULL,'Használt',1,'2025-03-08 16:04:15','Táska','Bőr'),(13,'Louis Vuitton Capucines','Exkluzív elegáns táska',11000000.00,'lv_capucines.jpg',1,'Louis Vuitton','Piros',NULL,'Új',1,'2025-03-07 16:04:15','Táska','Bőr'),(14,'Cartier Love Necklace','18K arany nyaklánc gyémántokkal',8000000.00,'cartier_love.jpg',3,'Cartier','Arany',NULL,'Használt',1,'2025-03-06 16:04:15','Nyaklánc','18K Arany'),(15,'Tiffany & Co. Victoria Pendant','Gyémánt nyaklánc platina foglalattal',9500000.00,'tiffany_victoria.jpg',2,'Tiffany & Co.','Ezüst',NULL,'Új',1,'2025-03-05 16:04:15','Nyaklánc','Platina'),(16,'Bvlgari Serpenti Necklace','Kígyómotívumos luxus nyaklánc',13000000.00,'bvlgari_serpenti.jpg',1,'Bvlgari','Arany',NULL,'Új',1,'2025-03-04 16:04:15','Nyaklánc','18K Arany');
/*!40000 ALTER TABLE `termekek` ENABLE KEYS */;
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
