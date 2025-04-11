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
-- Table structure for table `felhasznalok`
--

DROP TABLE IF EXISTS `felhasznalok`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `felhasznalok` (
  `FelhasznaloID` int NOT NULL AUTO_INCREMENT,
  `FelhasznaloNev` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `JelszoHash` varchar(255) NOT NULL,
  `Telefonszam` varchar(20) DEFAULT NULL,
  `Lakcim` varchar(255) DEFAULT NULL,
  `Szerep` enum('felhasznalo','elado','admin') DEFAULT 'felhasznalo',
  `RegisztracioDatum` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`FelhasznaloID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `felhasznalok`
--

LOCK TABLES `felhasznalok` WRITE;
/*!40000 ALTER TABLE `felhasznalok` DISABLE KEYS */;
INSERT INTO `felhasznalok` VALUES (1,'Teszt Elek','teszt@example.com','hashedpassword',NULL,NULL,'felhasznalo','2025-03-08 16:10:30'),(2,'Minta Márton','minta@example.com','hashedpassword',NULL,NULL,'felhasznalo','2025-03-08 16:10:30'),(16,'Szabó Tamás','szabo.tamas16@example.com','$2b$12$757402hashedpassword','+36 22 940 8284','Budapest, 22. kerület, 76 utca 40','admin','2024-05-09 16:19:39'),(54,'Szabó Tamás','szabo.tamas54@example.com','$2b$12$695655hashedpassword','+36 24 300 4826','Budapest, 16. kerület, 148 utca 78','felhasznalo','2024-12-26 16:19:39'),(63,'Kovács Péter','tamas.szabo@example.com','$2b$12$611895hashedpassword','+36 24 351 6043','Budapest, 13. kerület, 120 utca 93','felhasznalo','2022-06-12 16:19:39'),(71,'Kovács Béla','kovacs.bela71@example.com','$2b$12$836251hashedpassword','+36 20 456 7890','Budapest, 2. kerület, 34 utca 7','elado','2023-04-15 10:30:22'),(94,'Márkus Tamás','markus.tamas94@example.com','$2b$12$193847hashedpassword','+36 30 123 4567','Budapest, 5. kerület, 56 utca 12','elado','2024-08-19 14:45:10'),(126,'Csira Mari','csira.mari126@example.com','$2b$12$573849hashedpassword','+36 70 987 6543','Debrecen, Kossuth utca 98','elado','2024-02-28 08:20:35');
/*!40000 ALTER TABLE `felhasznalok` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kedvencek`
--

DROP TABLE IF EXISTS `kedvencek`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kedvencek` (
  `KedvencekID` int NOT NULL AUTO_INCREMENT,
  `FelhasznaloID` int NOT NULL,
  `TermekID` int NOT NULL,
  `Letrehozva` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`KedvencekID`),
  KEY `FelhasznaloID` (`FelhasznaloID`),
  KEY `kedvencek_ibfk_2` (`TermekID`),
  CONSTRAINT `kedvencek_ibfk_1` FOREIGN KEY (`FelhasznaloID`) REFERENCES `felhasznalok` (`FelhasznaloID`),
  CONSTRAINT `kedvencek_ibfk_2` FOREIGN KEY (`TermekID`) REFERENCES `termekek` (`TermekID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kedvencek`
--

LOCK TABLES `kedvencek` WRITE;
/*!40000 ALTER TABLE `kedvencek` DISABLE KEYS */;
/*!40000 ALTER TABLE `kedvencek` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kuponok`
--

DROP TABLE IF EXISTS `kuponok`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kuponok` (
  `KuponID` int NOT NULL AUTO_INCREMENT,
  `Kod` varchar(50) NOT NULL,
  `Lejarat` datetime NOT NULL,
  `KedvezmenySzazalek` decimal(5,2) NOT NULL,
  `Aktiv` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`KuponID`),
  UNIQUE KEY `Kod` (`Kod`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kuponok`
--

LOCK TABLES `kuponok` WRITE;
/*!40000 ALTER TABLE `kuponok` DISABLE KEYS */;
INSERT INTO `kuponok` VALUES (9,'COUPON4930','2025-10-13 16:19:39',20.00,1),(21,'COUPON1498','2025-08-21 16:19:39',15.00,1),(22,'COUPON1067','2025-10-28 16:19:39',10.00,0);
/*!40000 ALTER TABLE `kuponok` ENABLE KEYS */;
UNLOCK TABLES;

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
  KEY `RendelesID` (`RendelesID`),
  KEY `rendeles_tetelek_ibfk_2` (`TermekID`),
  CONSTRAINT `rendeles_tetelek_ibfk_1` FOREIGN KEY (`RendelesID`) REFERENCES `rendelesek` (`RendelesID`),
  CONSTRAINT `rendeles_tetelek_ibfk_2` FOREIGN KEY (`TermekID`) REFERENCES `termekek` (`TermekID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rendeles_tetelek`
--

LOCK TABLES `rendeles_tetelek` WRITE;
/*!40000 ALTER TABLE `rendeles_tetelek` DISABLE KEYS */;
/*!40000 ALTER TABLE `rendeles_tetelek` ENABLE KEYS */;
UNLOCK TABLES;

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
  `Statusz` enum('folyamatban','teljesitve','megszakitva') DEFAULT NULL,
  `SzallitasiCim` varchar(255) DEFAULT NULL,
  `FizetesiMod` enum('bankkartya','utanvet','paypal') DEFAULT 'bankkartya',
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
INSERT INTO `rendelesek` VALUES (1,63,'2023-11-22 16:19:39',47632.59,'teljesitve','Budapest, 9. kerület, 33 utca 15','bankkartya'),(17,16,'2024-08-19 16:19:39',42758.06,'teljesitve','Debrecen, Petőfi tér 10','paypal');
/*!40000 ALTER TABLE `rendelesek` ENABLE KEYS */;
UNLOCK TABLES;

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
  `Allapot` enum('aktiv','elfogyott','inaktiv') DEFAULT 'aktiv',
  `FeltoltoID` int DEFAULT NULL,
  `FeltoltesDatum` datetime DEFAULT CURRENT_TIMESTAMP,
  `Kategoria` varchar(50) NOT NULL,
  PRIMARY KEY (`TermekID`),
  KEY `FeltoltoID` (`FeltoltoID`),
  CONSTRAINT `termekek_ibfk_1` FOREIGN KEY (`FeltoltoID`) REFERENCES `felhasznalok` (`FelhasznaloID`)
) ENGINE=InnoDB AUTO_INCREMENT=204 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `termekek`
--

LOCK TABLES `termekek` WRITE;
/*!40000 ALTER TABLE `termekek` DISABLE KEYS */;
INSERT INTO `termekek` VALUES (101,'Nike Air Max Férfi Cipő','Kényelmes sportcipő férfiaknak',45000.00,'https://example.com/nike_air_max.jpg',20,'Nike','fekete','43','aktiv',NULL,'2025-03-13 18:39:32','Férfi cipő'),(102,'Adidas Ultraboost Férfi Cipő','Prémium minőségű futócipő',60000.00,'https://example.com/adidas_ultraboost.jpg',15,'Adidas','fehér','42','aktiv',NULL,'2025-03-13 18:39:32','Férfi cipő'),(103,'Gucci Női Magassarkú Cipő','Luxus magassarkú cipő',120000.00,'https://example.com/gucci_heels.jpg',5,'Gucci','piros','38','aktiv',NULL,'2025-03-13 18:39:32','Női cipő'),(104,'Puma Női Edzőcipő','Kényelmes edzőcipő nőknek',35000.00,'https://example.com/puma_training.jpg',25,'Puma','rózsaszín','39','aktiv',NULL,'2025-03-13 18:39:32','Női cipő'),(105,'Converse Chuck Taylor','Klasszikus tornacipő',30000.00,'https://example.com/converse.jpg',30,'Converse','fehér','41','aktiv',NULL,'2025-03-13 18:39:32','Unisex cipő'),(106,'Rolex Submariner Férfi Karóra','Luxus karóra',2800000.00,'https://example.com/rolex.jpg',3,'Rolex','ezüst','univerzális','aktiv',NULL,'2025-03-13 18:39:32','Férfi kiegészítő'),(107,'Louis Vuitton Férfi Táska','Prémium bőrtáska',450000.00,'https://example.com/lv_bag.jpg',10,'Louis Vuitton','barna','univerzális','aktiv',NULL,'2025-03-13 18:39:32','Férfi kiegészítő'),(108,'Tiffany & Co Női Nyaklánc','Ezüst nyaklánc gyémánt berakással',500000.00,'https://example.com/tiffany_necklace.jpg',7,'Tiffany & Co','ezüst','univerzális','aktiv',NULL,'2025-03-13 18:39:32','Női kiegészítő'),(109,'Chanel Női Karkötő','Elegáns arany karkötő',350000.00,'https://example.com/chanel_bracelet.jpg',12,'Chanel','arany','univerzális','aktiv',NULL,'2025-03-13 18:39:32','Női kiegészítő'),(110,'Ray-Ban Aviator Napszemüveg','Stílusos napszemüveg',75000.00,'https://example.com/rayban_aviator.jpg',50,'Ray-Ban','fekete','univerzális','aktiv',NULL,'2025-03-13 18:39:32','Unisex kiegészítő'),(201,'Gucci Bőr Cipő','Prémium olasz bőr cipő',125000.50,'https://example.com/gucci_shoes.jpg',10,'Gucci','barna','42','aktiv',NULL,'2025-03-13 18:29:13','Férfi cipő'),(202,'Nike Air Jordan 1','Limitált kiadású sportcipő',95000.75,'https://example.com/jordan1.jpg',20,'Nike','piros/fekete','43','aktiv',NULL,'2025-03-13 18:29:13','Unisex cipő'),(203,'Rolex Submariner','Luxus karóra rozsdamentes acélból',2850000.99,'https://example.com/rolex.jpg',5,'Rolex','ezüst','univerzális','aktiv',NULL,'2025-03-13 18:29:13','Kiegészítő');
/*!40000 ALTER TABLE `termekek` ENABLE KEYS */;
UNLOCK TABLES;

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
/*!40000 ALTER TABLE `termekeladasok` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `termekreview`
--

DROP TABLE IF EXISTS `termekreview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `termekreview` (
  `ReviewID` int NOT NULL AUTO_INCREMENT,
  `TermekID` int NOT NULL,
  `FelhasznaloID` int NOT NULL,
  `Ertekeles` int NOT NULL,
  `Komment` varchar(500) DEFAULT NULL,
  `ReviewDatum` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ReviewID`),
  KEY `TermekID` (`TermekID`),
  KEY `FelhasznaloID` (`FelhasznaloID`),
  CONSTRAINT `termekreview_ibfk_1` FOREIGN KEY (`TermekID`) REFERENCES `termekek` (`TermekID`),
  CONSTRAINT `termekreview_ibfk_2` FOREIGN KEY (`FelhasznaloID`) REFERENCES `felhasznalok` (`FelhasznaloID`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `termekreview`
--

LOCK TABLES `termekreview` WRITE;
/*!40000 ALTER TABLE `termekreview` DISABLE KEYS */;
/*!40000 ALTER TABLE `termekreview` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-13 18:45:39
