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
  `Orszag` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`FelhasznaloID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `felhasznalok`
--

LOCK TABLES `felhasznalok` WRITE;
/*!40000 ALTER TABLE `felhasznalok` DISABLE KEYS */;
INSERT INTO `felhasznalok` VALUES (1,'Alexander Cartier','alex.cartier@luxuryshop.com','securehash1','+36201234561','Budapest, Andrássy út 1.','felhasznalo','2025-03-19 16:04:15','Magyarország'),(2,'Isabella Vuitton','isabella.vuitton@luxuryshop.com','securehash2','+36201234562','Paris, Champs-Élysées 12.','admin','2025-03-18 16:04:15','Franciaország'),(3,'Sebastian Rolex','sebastian.rolex@luxuryshop.com','securehash3','+36201234563','London, Mayfair 22.','felhasznalo','2025-03-17 16:04:15','Egyesült Királyság'),(4,'Victoria Hermès','victoria.hermes@luxuryshop.com','securehash4','+36201234564','Milan, Via Monte Napoleone 3.','admin','2025-03-16 16:04:15','Olaszország'),(5,'Christian Balenciaga','christian.balenciaga@luxuryshop.com','securehash5','+36201234565','New York, Fifth Avenue 101.','felhasznalo','2025-03-15 16:04:15','USA'),(6,'Sophia Prada','sophia.prada@luxuryshop.com','securehash6','+36201234566','Berlin, Kurfürstendamm 56.','felhasznalo','2025-03-14 16:04:15','Németország'),(7,'Leonardo Gucci','leonardo.gucci@luxuryshop.com','securehash7','+36201234567','Dubai, Sheikh Zayed Road 88.','admin','2025-03-13 16:04:15','Egyesült Arab Emírségek');
/*!40000 ALTER TABLE `felhasznalok` ENABLE KEYS */;
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

--
-- Table structure for table `wish_list`
--

DROP TABLE IF EXISTS `wish_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wish_list` (
  `wish_list_id` int NOT NULL,
  `FelhasznaloID` int NOT NULL,
  `TermekID` int NOT NULL,
  `Letrehozva` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`wish_list_id`),
  KEY `FelhasznaloID` (`FelhasznaloID`),
  KEY `kedvencek_ibfk_2` (`TermekID`),
  CONSTRAINT `wish_list_ibfk_1` FOREIGN KEY (`FelhasznaloID`) REFERENCES `felhasznalok` (`FelhasznaloID`),
  CONSTRAINT `wish_list_ibfk_2` FOREIGN KEY (`TermekID`) REFERENCES `termekek` (`TermekID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wish_list`
--

LOCK TABLES `wish_list` WRITE;
/*!40000 ALTER TABLE `wish_list` DISABLE KEYS */;
INSERT INTO `wish_list` VALUES (1,1,1,'2025-03-19 16:04:15'),(2,2,2,'2025-03-18 16:04:15'),(3,3,3,'2025-03-17 16:04:15'),(4,4,4,'2025-03-16 16:04:15'),(5,5,5,'2025-03-15 16:04:15'),(6,6,6,'2025-03-14 16:04:15'),(7,7,7,'2025-03-13 16:04:15');
/*!40000 ALTER TABLE `wish_list` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-21 19:54:27
