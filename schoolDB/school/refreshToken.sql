DROP TABLE IF EXISTS `refreshTokenPortal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `refreshTokenPortal` (
  `userid` int(11) NOT NULL,
  `refreshToken` varchar(100) NOT NULL,
  `accessToken` varchar(500) NOT NULL,
  `createddatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifieddatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`refreshToken`),
  KEY `userid` (`userid`)
)