-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: luxshop
-- ------------------------------------------------------
-- Server version	9.2.0

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
-- Table structure for table `bids`
--

DROP TABLE IF EXISTS `bids`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bids` (
  `bid_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `bid_amount` int DEFAULT NULL,
  PRIMARY KEY (`bid_id`),
  KEY `fk_user_id_idx` (`user_id`),
  KEY `fk_product_id_idx` (`product_id`),
  CONSTRAINT `fk_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bids`
--

LOCK TABLES `bids` WRITE;
/*!40000 ALTER TABLE `bids` DISABLE KEYS */;
/*!40000 ALTER TABLE `bids` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_body`
--

DROP TABLE IF EXISTS `order_body`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_body` (
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` int NOT NULL,
  KEY `fk_order_body_product` (`product_id`),
  KEY `fk_order_body_order` (`order_id`),
  CONSTRAINT `fk_order_body_order` FOREIGN KEY (`order_id`) REFERENCES `order_header` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_body_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_body`
--

LOCK TABLES `order_body` WRITE;
/*!40000 ALTER TABLE `order_body` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_body` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_header`
--

DROP TABLE IF EXISTS `order_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_header` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_amount` int NOT NULL,
  `status` varchar(50) NOT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `payment_method` enum('card','paypal') NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `FelhasznaloID` (`user_id`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_header`
--

LOCK TABLES `order_header` WRITE;
/*!40000 ALTER TABLE `order_header` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_header` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` int NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `stock` int DEFAULT '0',
  `brand` varchar(50) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `size` varchar(20) DEFAULT NULL,
  `product_condition` enum('new','used') NOT NULL,
  `uploader_id` int DEFAULT NULL,
  `upload_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `category` enum('sneaker','bag','watch') NOT NULL,
  `target_gender` enum('man','woman','unisex') NOT NULL,
  `bidding_enabled` tinyint(1) NOT NULL,
  `bidding_duration` enum('24','48','72') DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `fk_product_uploader` (`uploader_id`),
  CONSTRAINT `fk_product_uploader` FOREIGN KEY (`uploader_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=982 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (952,'OnTheGo Tote Spring in the City Monogram Giant Canvas GM','The Louis Vuitton OnTheGo GM Tote from the Spring in the City collection features the iconic Monogram Giant Canvas in soft pastel tones. Spacious, stylish, and perfect for everyday luxury.',5020,'taska1.jpeg,taska2.jpeg,taska3.jpeg',3,'Louis Vuitton','white','s/m/l','new',6,'2025-03-23 00:00:00','bag','woman',0,NULL),(953,'Clutch Box Bag Monogram Mirror','A sleek and structured Clutch Box Bag featuring the iconic Monogram Mirror finish. Compact yet eye-catching – perfect for evening events or special occasions.',5715,'taska2_1.jpeg,taska2_2.jpeg,taska2_3.jpeg',2,'Louis Vuitton','white','m/l','new',15,'2025-03-23 00:00:00','bag','woman',0,NULL),(954,'Wallet Trunk Damoflage Canvas','The Wallet Trunk in Damoflage Canvas features a bold, trunk-inspired design in a compact format. A stylish everyday wallet with heritage charm.',5900,'taska3_1.jpeg,taska3_2.jpeg,taska3_3.jpeg',2,'Louis Vuitton','green','m/l','new',10,'2025-03-23 00:00:00','bag','woman',0,NULL),(955,'Coussin Bag Denim Printed Monogram Embossed Lambskin MM','The Coussin MM Bag in denim-printed, embossed lambskin combines bold texture with soft luxury. A versatile and trendy piece for day or night.',5275,'taska4_1.jpeg,taska4_2.jpeg,taska4_3.jpeg',1,'Louis Vuitton','black','l','used',7,'2025-03-23 00:00:00','bag','woman',0,NULL),(956,'Jypsiere Bag Clemence 31','The Hermes Jypsiere Clemence 31 Bag is a chic crossbody option with a relaxed structure. Made from luxurious Clemence leather, it offers both practicality and timeless style.',5700,'taska5_1.jpeg,taska5_2.jpeg,taska5_3.jpeg',3,'Hermes','brown','s/m/l','new',16,'2025-03-23 00:00:00','bag','woman',0,NULL),(957,'Shoulder Kelly Bag Clemence 42','The Hermes Shoulder Kelly Bag in Clemence leather blends elegance and function with its spacious design and signature Kelly style. A timeless statement piece.',6380,'taska6_1.jpeg,taska6_2.jpeg,taska6_3.jpeg',1,'Hermes','blue','l','used',3,'2025-03-23 00:00:00','bag','woman',0,NULL),(958,'Geta Bag Chevre Mysore','The Hermes Geta Bag in Chevre Mysore leather offers a sleek silhouette and playful design. Perfect for adding a modern edge to your outfit.',6145,'taska7_1.jpeg,taska7_2.jpeg,taska7_3.jpeg',3,'Hermes','pink','s/m/l','new',23,'2025-03-23 00:00:00','bag','woman',0,NULL),(959,'Quilted Metal Top Handle Flap Banameg Quilted Lambskin Small','The Chanel Quilted Metal Top Handle Flap Bag in soft lambskin combines a timeless quilted design with a modern top handle. Ideal for elegant outings.',5880,'taska8_1.jpeg,taska8_2.jpeg,taska8_3.jpeg',2,'Chanel','white','s/l','new',4,'2025-03-23 00:00:00','bag','woman',0,NULL),(960,'Classic Single Flap Bag Quilted Caviar Jumbo','A Chanel classic: the Single Flap Bag in Jumbo size with caviar leather. Elegant, durable, and highly sought-after ftarget_genderor daily or formal wear.',5385,'taska9_1.jpeg,taska9_2.jpeg,taska9_3.jpeg',1,'Chanel','black','l','used',8,'2025-03-23 00:00:00','bag','woman',0,NULL),(961,'Classic Double Flap Bag Quilted Patent Medium','The Chanel Classic Double Flap Bag in medium size features quilted patent leather, offering a glossy finish to this timeless silhouette.',5080,'taska10_1.jpeg,taska10_2.jpeg,taska10_3.jpeg',2,'Chanel','red','m/l','new',9,'2025-03-23 00:00:00','bag','woman',0,NULL),(962,'Seamaster Professional Diver 300M Co-Axial Master Chronometer Automatic Watch Stainless Steel and Rubber with Ceramic 42','Seamaster Professional Diver 300M Co-Axial Master Chronometer Automatic Watch Stainless Steel and Rubber with Ceramic 42',4740,'ora1.jpeg,ora2.jpeg,ora3.jpeg',1,'Omega','black','42','used',15,'2025-03-23 00:00:00','watch','man',0,NULL),(963,'Seamaster Professional Planet Ocean 600M Co-Axial Chronometer Automatic Watch Stainless Steel 39','A robust diver’s watch crafted from stainless steel and ceramic, featuring rubber accents and Co-Axial Master Chronometer movement.',5195,'ora2_1.jpeg,ora2_2.jpeg,ora2_3.jpeg',1,'Omega','black','39','used',10,'2025-03-23 00:00:00','watch','man',0,NULL),(964,'Seamaster Professional Diver 300M Co-Axial Chronometer Automatic Watch Stainless Steel and Ceramic 42','A sleek and professional diving timepiece made of stainless steel and ceramic, built for precision with Co-Axial Chronometer technology.',5600,'ora3_1.jpeg,ora3_2.jpeg,ora3_3.jpeg',3,'Omega','blue','39/42/42','new',17,'2025-03-23 00:00:00','watch','man',0,NULL),(965,'Must de Cartier Tank Quartz Watch Stainless Steel and Satin with Diamond Bezel 22','A timeless classic from Cartier with a refined diamond bezel and a satin strap, perfect for elegant everyday wear.',6050,'ora4_1.jpeg,ora4_2.jpeg,ora4_3.jpeg',1,'Cartier','white','22','used',15,'2025-03-23 00:00:00','watch','unisex',0,NULL),(966,'Santos Dumont Quartz Watch Rose Gold and Alligator 31','A luxurious quartz watch in rose gold paired with an alligator strap, combining heritage design with modern charm.',13650,'ora5_1.jpeg,ora5_2.jpeg,ora5_3.jpeg',1,'Cartier','white','31','used',17,'2025-03-23 00:00:00','watch','man',0,NULL),(967,'Ballon Blanc de Cartier Quartz Watch Stainless Steel and Satin with Diamond Bezel 30','A sophisticated timepiece with a diamond-set bezel, satin strap, and Cartier’s signature aesthetic in a graceful package.',7020,'ora6_1.jpeg,ora6_2.jpeg,ora6_3.jpeg',1,'Cartier','white','30','used',15,'2025-03-23 00:00:00','watch','man',0,NULL),(968,'Tank Francaise Quartz Watch Stainless Steel with Diamond Bezel 20','An iconic tank-style watch with diamond bezel and stainless steel design, reflecting Cartier’s timeless elegance.',7010,'ora7_1.jpeg,ora7_2.jpeg,ora7_3.jpeg',1,'Cartier','white','20','used',22,'2025-03-23 00:00:00','watch','unisex',0,NULL),(969,'Oyster Perpetual Datejust Automatic Watch Stainless Steel and Yellow Gold 26','A classic Rolex Datejust in stainless steel and yellow gold, blending luxury with functionality for everyday style.',6785,'ora8_1.jpeg,ora8_2.jpeg,ora8_3.jpeg',2,'Rolex','black','26/29','new',23,'2025-03-23 00:00:00','watch','unisex',0,NULL),(970,'Oyster Perpetual Automatic Watch Stainless Steel 36','A minimalist Rolex automatic watch in pure stainless steel, designed for precision and durability.',8310,'ora9_1.jpeg,ora9_2.jpeg,ora9_3.jpeg',1,'Rolex','black','36','used',9,'2025-03-23 00:00:00','watch','man',0,NULL),(971,'Oyster Perpetual Datejust Automatic Watch Stainless Steel and White Gold with Diamond Markers 36','A luxurious Rolex Datejust with white gold and diamond markers, representing timeless style and refined craftsmanship.',8645,'ora10_1.jpeg,ora10_2.jpeg,ora10_3.jpeg',2,'Rolex','black','36/39','new',17,'2025-03-23 00:00:00','watch','man',0,NULL),(972,'Skater Sneakers Cannage Quilt Leather','Premium leather sneakers with Cannage quilt detailing, offering a sporty yet high-fashion aesthetic.',1370,'cipok1.jpeg,cipok2.jpeg,cipok3.jpeg',1,'Christian Dior','grey','42','used',12,'2025-03-23 00:00:00','sneaker','man',0,NULL),(973,'Skater Sneakers Cannage Quilt Tweed','A stylish twist on the classic skater sneaker, crafted with Cannage quilt tweed for a unique textured look.',1030,'cipok2_1.jpeg,cipok2_2.jpeg,cipok2_3.jpeg',2,'Christian Dior','grey','41/43','used',2,'2025-03-23 00:00:00','sneaker','man',0,NULL),(974,'High-Top Sneakers Maxi Oblique Canvas','High-top sneakers featuring Dior’s Maxi Oblique canvas, delivering bold branding and street-ready style.',910,'cipok3_1.jpeg,cipok3_2.jpeg,cipok3_3.jpeg',1,'Christian Dior','grey','38','used',8,'2025-03-23 00:00:00','sneaker','woman',0,NULL),(975,'Runner Sneakers Mesh and Nylon','Chunky sneakers with a mesh and nylon combo, designed for sporty, futuristic fashion lovers.',715,'cipok4_1.jpeg,cipok4_2.jpeg,cipok4_3.jpeg',2,'Balenciaga','red','39/40','new',1,'2025-03-23 00:00:00','sneaker','unisex',0,NULL),(976,'Runner Sneakers Mesh and Nylon','A mesh and nylon runner with urban appeal, offering lightweight comfort and statement style.',645,'cipok5_1.jpeg,cipok5_2.jpeg,cipok5_3.jpeg',1,'Balenciaga','pink','37','used',18,'2025-03-23 00:00:00','sneaker','woman',0,NULL),(977,'Runner Sneakers Mesh and Nylon','The same runner design in a new colorway—fusing athletic performance with Balenciaga\'s signature style.',645,'cipok6_1.jpeg,cipok6_2.jpeg,cipok6_3.jpeg',1,'Balenciaga','pink','38','used',17,'2025-03-23 00:00:00','sneaker','woman',0,NULL),(978,'Trainer Sneakers Monogram Empreinte Leather and Monogram Denim','High-end trainers combining leather and denim in Monogram design, standing out in luxury streetwear.',1200,'cipok7_1.jpeg,cipok7_2.jpeg,cipok7_3.jpeg',3,'Louis Vuitton','blue','41/43/45','new',6,'2025-03-23 00:00:00','sneaker','man',0,NULL),(979,'Wonderland Flat Ranger Boots Monogram Canvas and Leather','Elegant ranger boots with monogram canvas and leather detailing, designed for bold, fashion-forward women.',2075,'cipok8_1.jpeg,cipok8_2.jpeg,cipok8_3.jpeg',1,'Louis Vuitton','brown','38','used',17,'2025-03-23 00:00:00','sneaker','woman',0,NULL),(980,'Skate Sneakers Technical Mesh with Leather and Suede','Sporty skate-inspired sneakers with technical mesh and luxurious suede overlays for ultimate edge.',1415,'cipok9_1.jpeg,cipok9_2.jpeg,cipok9_3.jpeg',2,'Louis Vuitton','blue','42/44','new',14,'2025-03-23 00:00:00','sneaker','man',0,NULL),(981,'Runner Tatic Sneakers Technical Mesh','Futuristic sneakers made with technical mesh for comfort and performance, designed for modern active lifestyles.',880,'cipok10_1.jpeg,cipok10_2.jpeg,cipok10_3.jpeg',1,'Louis Vuitton','white','43','used',1,'2025-03-23 00:00:00','sneaker','man',0,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `country` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `Email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Allison Hill','allison.hill@example.com','$2y$10$NbrnTP3fAbnFbmOHnKYaXRvj7uff0LYTH8xIZM1JRcoreogrNwwmq','+49 1512 3456789','Hauptstrasse 12, 10115 Berlin','user','Germany'),(2,'Calvin Nielsen','calvin.nielsen@example.com','$2y$10$LkTkx9NIQ0Wobtqn62tOy4CqpIqK3yn9FfcgMXAdx9G81aSQHqNgA','+34 612 345 678','Calle Mayor 45, 28013 Madrid','user','Spain'),(3,'Andrew Stewart','andrew.stewart@example.com','$2y$10$8VFgM0Fmxk754LEgw9YooJeTY8HhO6kGL75UQSyPx3BpdbIKaRdeb','+48 600 123 456','ul. Warszawska 20, 00-001 Warszawa','user','Poland'),(4,'Varga János','varga.janos@example.com','$2y$10$oPni6JDWYlgAACTP9gyv1plBArp5B1Id9Z850kEnydx9qWCA79ISj','+36 30 456 7890','Petőfi utca 9, 1061 Budapest','user','Hungary'),(5,'John Jones','john.jones@example.com','$2y$10$JHUdKF0j7elKPoh3pKMzKG5mSoyPstUeC99enq522wjZRL9OaYsP6','+49 176 12345678','Bahnhofstrasse 88, 80331 München','user','Germany'),(6,'Carlos Walls','carlos.walls@example.com','$2y$10$3UjrnvQ0Fp4dNZcui8kBRIg6QjcwIAcw58cwQPvI28U5okXkzl5Wz','+39 345 678 9123','Via Roma 10, 00185 Roma','user','Italy'),(7,'Zachary Huff','zachary.huff@example.com','$2y$10$qWg21nYCsXoblu17rNy8H6h8l7qgATtLFxJpRa5HSUPwePut0Sstz','+34 698 123 456','Avenida del Sol 34, 29010 Málaga','user','Spain'),(8,'Megan Young','megan.young@example.com','$2y$10$IlPxUkJzZsnWLtBPFX7TOrPMf7otYjc9LVC2JSxyjQ312WnXRCI4h','+31 6 12345678','Damstraat 1, 1012 JL Amsterdam','user','Netherlands'),(9,'Christopher Bass','christopher.bass@example.com','$2y$10$P9K63LSFZH3UDqpNVGMrerqtHioRRdzHzmA4KR1VxavU07zUHLnnB','+1 205-555-0198','123 Oak Drive, Birmingham, AL 35203','user','USA'),(10,'Mandy Green','mandy.green@example.com','$2y$10$PXS058H4KPfA1lquCu2r6AZDUd7ne7cbp0MoDh6CpwL7SWktJ5J4x','+39 320 987 6543','Via Milano 20, 20100 Milano','user','Italy'),(11,'Rita Keith','rita.keith@example.com','$2y$10$eQMgV0Lh8WvAwFv0Yg7NZRBT7qYHDBTq0Zf2pCLxb0lnXv2Rra6fS','+39 389 456 1230','Via Napoli 17, 80100 Napoli','user','Italy'),(12,'Takács Éva','haley.hartman@example.com','$2y$10$QOEXfnQsKDGAUuRqphlhHVlnES8GrgmolaHr8IRh1E2JDBld6DYye','+36 70 345 6789','Kossuth Lajos utca 7, 1055 Budapest','user','Hungary'),(13,'Stephanie Gilbert','stephanie.gilbert@example.com','$2y$10$jY6fpIzKMWx4sKAJd7gVMqfoIjzQDcrr1eoqXKXmhnjqidXKZ5BDs','+34 699 888 777','Calle de la Reina 23, 46001 Valencia','user','Spain'),(14,'Michael Stafford','michael.stafford@example.com','$2y$10$FEecAtpf7ZJ69PqcUDO4lKNEfvuP1uRr6YICtu8zF9OHzlwUMVmI5','+31 6 98765432','Keizersgracht 101, 1015 CJ Amsterdam','user','Netherlands'),(15,'Michael Mccarthy','michael.mccarthy@example.com','$2y$10$h8LojIIf94ChZESFqZ8pIx5F21rWz5FYrsK9EjHvIHCtlRJoWcURY','+33 6 78 90 12 34','12 Rue de Paris, 75001 Paris','user','France'),(16,'Joel Williams','joel.williams@example.com','$2y$10$EcFK12BGCSzOjD8uQO001xtSV2ceN59UAgN2BR4cXsxjGJXke1Mo4','+31 6 11223344','Stationsstraat 5, 3511 CE Utrecht','user','Netherlands'),(17,'Tracey Higgins','tracey.higgins@example.com','$2y$10$NCP3CrHe69s7QCs90gxwsRbZya1W84UZ3WoXnlpUVQigMcWcwi4uz','+48 789 654 321','ul. Krakowska 7, 30-001 Kraków','user','Poland'),(18,'Nicholas Adams','nicholas.adams@example.com','$2y$10$2wFqk467s1XDeUnPPy0IfyqhwUqxNxPDM6uLONCROhcc9hoHyx6RH','+33 7 12 34 56 78','20 Avenue Victor Hugo, 69001 Lyon','user','France'),(19,'David Beck','david.beck@example.com','$2y$10$2OZM6rQnBow8w3Ndr86ZfnN8du9WmZIKYoWWKr99HXg1iwWKaqhAh','+31 6 33445566','Nieuwezijds Voorburgwal 10, 1012 RC Amsterdam','user','Netherlands'),(20,'Tony Little','tony.little@example.com','$2y$10$WFgF6cW1GC7dDyQE4efLerNHu9GCLgR0OVSnBovCzfAPxj5eZffTY','+43 660 1234567','Kärntner Straße 9, 1010 Wien','user','Austria'),(21,'Christine Clark','christine.clark@example.com','$2y$10$7IPz26A4drtgFjD0vIhroAIVMPILOQbqV5vliOeT8fGxCjtu6K2jU','+49 160 98765432','Berliner Allee 99, 40212 Düsseldorf','user','Germany'),(22,'Dillon Fernandez','dillon.fernandez@example.com','$2y$10$qPEBqUhArQEPcyLasnipuaUkxRFZXe1cb51JJRzhbuXMZ5f0pKGyt','+1 305-555-0147','456 Sunset Blvd, Miami, FL 33139','user','USA'),(23,'Shannon Rivera','shannon.rivera@example.com','$2y$10$WeNGmWv7OjgpkjVe6MCIJQ2N9u8tBDNXKveCcwrN8fKxJ7Tc4JlLF','+31 6 55667788','Van Baerlestraat 30, 1071 ZW Amsterdam','user','Netherlands'),(24,'Danny Skinner','danny.skinner@example.com','$2y$10$g3vSFkpBBGjxrzuLWOefQrSO42uKiv7RyK6txXYPZTQGOAwwln6Eo','+49 170 1234567','Goethestraße 77, 60313 Frankfurt','user','Germany'),(25,'Frank Lopez','frank.lopez@example.com','$2y$10$sWFHTGP2MLjlQM3ScwS8LUWoo7W4mQJBVWFzkmL2dDx5SFhfjBFZf','+31 6 22334455','Lange Voorhout 1, 2514 EA Den Haag','user','Netherlands');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `wish_list_id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  PRIMARY KEY (`wish_list_id`),
  KEY `FelhasznaloID` (`user_id`),
  KEY `kedvencek_ibfk_2` (`product_id`),
  CONSTRAINT `fk_whislist_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_whislist_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-24 16:07:40
