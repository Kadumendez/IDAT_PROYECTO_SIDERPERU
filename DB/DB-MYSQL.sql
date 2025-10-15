CREATE TABLE `auditoria_evento` (
  `id_evento` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tabla` varchar(128) NOT NULL,
  `pk_valor` varchar(128) NOT NULL,
  `accion` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `cambiado_por` int unsigned DEFAULT NULL,
  `cambiado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `antes_json` json DEFAULT NULL,
  `despues_json` json DEFAULT NULL,
  `comentario` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_evento`),
  KEY `ix_aud_tabla_pk` (`tabla`,`pk_valor`),
  KEY `ix_aud_fecha` (`cambiado_en`),
  KEY `ix_aud_usuario` (`cambiado_por`),
  KEY `ix_aud_tabla_fecha` (`tabla`,`cambiado_en`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `auditoria_evento` WRITE;
/*!40000 ALTER TABLE `auditoria_evento` DISABLE KEYS */;
/*!40000 ALTER TABLE `auditoria_evento` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `colaborador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `colaborador` (
  `id_colaborador` int unsigned NOT NULL AUTO_INCREMENT,
  `nombres` varchar(120) NOT NULL,
  `apellidos` varchar(120) NOT NULL,
  `dni` varchar(15) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `cargo` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_colaborador`),
  UNIQUE KEY `ux_colaborador_dni` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
---- Dumping data for table `colaborador`
LOCK TABLES `colaborador` WRITE;
/*!40000 ALTER TABLE `colaborador` DISABLE KEYS */;
INSERT INTO `colaborador` VALUES (1,'Kadú','Desposorio','99999999',NULL,NULL,NULL,NULL,NULL,'2025-10-01 05:34:29','2025-10-01 05:34:29',NULL);
/*!40000 ALTER TABLE `colaborador` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `detalle_plano`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_plano` (
  `id_detalle` int unsigned NOT NULL AUTO_INCREMENT,
  `id_plano` int unsigned NOT NULL,
  `id_rol` int unsigned NOT NULL,
  `id_permiso` int unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_detalle`),
  KEY `fk_detalle_plano` (`id_plano`),
  KEY `fk_detalle_rol` (`id_rol`),
  KEY `fk_detalle_permiso` (`id_permiso`),
  CONSTRAINT `fk_detalle_permiso` FOREIGN KEY (`id_permiso`) REFERENCES `permiso` (`id_permiso`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_detalle_plano` FOREIGN KEY (`id_plano`) REFERENCES `plano` (`id_plano`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_detalle_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `detalle_plano` WRITE;
/*!40000 ALTER TABLE `detalle_plano` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalle_plano` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `estado_notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_notificacion` (
  `id_estado` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) NOT NULL,
  PRIMARY KEY (`id_estado`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
-- Dumping data for table `estado_notificacion`
LOCK TABLES `estado_notificacion` WRITE;
/*!40000 ALTER TABLE `estado_notificacion` DISABLE KEYS */;
INSERT INTO `estado_notificacion` VALUES (2,'entregada'),(1,'enviada'),(3,'leida');
/*!40000 ALTER 
DROP TABLE IF EXISTS `estado_plano`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_plano` (
  `id_estado` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) NOT NULL,
  PRIMARY KEY (`id_estado`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `estado_plano` WRITE;
/*!40000 ALTER TABLE `estado_plano` DISABLE KEYS */;
INSERT INTO `estado_plano` VALUES (3,'aprobado'),(4,'archivado'),(1,'borrador'),(2,'en_revision');
/*!40000 ALTER TABLE `estado_plano` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `estado_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_usuario` (
  `id_estado` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) NOT NULL,
  PRIMARY KEY (`id_estado`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `estado_usuario` WRITE;
/*!40000 ALTER TABLE `estado_usuario` DISABLE KEYS */;
INSERT INTO `estado_usuario` VALUES (1,'activo'),(3,'bloqueado'),(2,'inactivo');
/*!40000 ALTER TABLE `estado_usuario` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `estado_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_version` (
  `id_estado` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) NOT NULL,
  PRIMARY KEY (`id_estado`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `estado_version` WRITE;
/*!40000 ALTER TABLE `estado_version` DISABLE KEYS */;
INSERT INTO `estado_version` VALUES (2,'obsoleta'),(3,'rechazada'),(1,'vigente');
/*!40000 ALTER TABLE `estado_version` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `login_intento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_intento` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_usuario` int unsigned NOT NULL,
  `intento_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `exito` tinyint(1) NOT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `ua` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_login_usuario_fecha` (`id_usuario`,`intento_en`),
  CONSTRAINT `fk_login_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `login_intento` WRITE;
/*!40000 ALTER TABLE `login_intento` DISABLE KEYS */;
/*!40000 ALTER TABLE `login_intento` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `maquina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maquina` (
  `id_maquina` int unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(120) NOT NULL,
  `nombre` varchar(200) DEFAULT NULL,
  `tipo` varchar(100) DEFAULT NULL,
  `id_zona` int unsigned DEFAULT NULL,
  `id_subzona` int unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_maquina`),
  UNIQUE KEY `ux_maquina_codigo` (`codigo`),
  KEY `ix_maquina_zonas` (`id_zona`,`id_subzona`),
  KEY `ix_maquina_nombre` (`nombre`),
  KEY `fk_maquina_subzona` (`id_subzona`),
  CONSTRAINT `fk_maquina_subzona` FOREIGN KEY (`id_subzona`) REFERENCES `subzona` (`id_subzona`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_maquina_zona` FOREIGN KEY (`id_zona`) REFERENCES `zona` (`id_zona`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `maquina` WRITE;
/*!40000 ALTER TABLE `maquina` DISABLE KEYS */;
/*!40000 ALTER TABLE `maquina` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `medio_notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medio_notificacion` (
  `id_medio` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) NOT NULL,
  PRIMARY KEY (`id_medio`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `medio_notificacion` WRITE;
/*!40000 ALTER TABLE `medio_notificacion` DISABLE KEYS */;
INSERT INTO `medio_notificacion` VALUES (2,'email'),(3,'push'),(4,'sms'),(1,'web');
/*!40000 ALTER TABLE `medio_notificacion` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacion` (
  `id_notificacion` int unsigned NOT NULL AUTO_INCREMENT,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_medio` tinyint unsigned NOT NULL,
  `id_estado` tinyint unsigned NOT NULL,
  `payload` json DEFAULT NULL,
  PRIMARY KEY (`id_notificacion`),
  KEY `fk_notif_medio` (`id_medio`),
  KEY `ix_notif_estado` (`id_estado`),
  KEY `ix_notif_fecha` (`fecha`),
  CONSTRAINT `fk_notif_estado` FOREIGN KEY (`id_estado`) REFERENCES `estado_notificacion` (`id_estado`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_notif_medio` FOREIGN KEY (`id_medio`) REFERENCES `medio_notificacion` (`id_medio`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permiso` (
  `id_permiso` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_permiso`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `permiso` WRITE;
/*!40000 ALTER TABLE `permiso` DISABLE KEYS */;
INSERT INTO `permiso` VALUES (1,'PLANO_VER','Ver planos','2025-10-01 05:34:29','2025-10-01 05:34:29'),(2,'PLANO_EDITAR','Crear/editar planos','2025-10-01 05:34:29','2025-10-01 05:34:29'),(3,'PLANO_APROBAR','Aprobar/flujos','2025-10-01 05:34:29','2025-10-01 05:34:29'),(4,'USUARIO_ADMIN','Administración de usuarios','2025-10-01 05:34:29','2025-10-01 05:34:29');
/*!40000 ALTER TABLE `permiso` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `plano`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plano` (
  `id_plano` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  `codigo` varchar(120) NOT NULL,
  `descripcion` text,
  `id_maquina` int unsigned DEFAULT NULL,
  `id_zona` int unsigned DEFAULT NULL,
  `id_subzona` int unsigned DEFAULT NULL,
  `id_estado` tinyint unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `created_user` int unsigned DEFAULT NULL,
  `updated_user` int unsigned DEFAULT NULL,
  `deleted_user` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id_plano`),
  UNIQUE KEY `ux_plano_codigo` (`codigo`),
  KEY `fk_plano_maquina` (`id_maquina`),
  KEY `fk_plano_subzona` (`id_subzona`),
  KEY `fk_plano_created_user` (`created_user`),
  KEY `fk_plano_updated_user` (`updated_user`),
  KEY `fk_plano_deleted_user` (`deleted_user`),
  KEY `ix_plano_estado` (`id_estado`),
  KEY `ix_plano_loc` (`id_zona`,`id_subzona`),
  KEY `ix_plano_created_at` (`created_at`),
  KEY `ix_plano_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_plano_created_user` FOREIGN KEY (`created_user`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_plano_deleted_user` FOREIGN KEY (`deleted_user`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_plano_estado` FOREIGN KEY (`id_estado`) REFERENCES `estado_plano` (`id_estado`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_plano_maquina` FOREIGN KEY (`id_maquina`) REFERENCES `maquina` (`id_maquina`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_plano_subzona` FOREIGN KEY (`id_subzona`) REFERENCES `subzona` (`id_subzona`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_plano_updated_user` FOREIGN KEY (`updated_user`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_plano_zona` FOREIGN KEY (`id_zona`) REFERENCES `zona` (`id_zona`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `plano` WRITE;
/*!40000 ALTER TABLE `plano` DISABLE KEYS */;
/*!40000 ALTER TABLE `plano` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `planoarchivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planoarchivo` (
  `id_archivo` int unsigned NOT NULL AUTO_INCREMENT,
  `id_version` int unsigned NOT NULL,
  `storage_key` varchar(255) NOT NULL,
  `formato` varchar(40) NOT NULL,
  `tamano_bytes` bigint unsigned NOT NULL,
  `checksum` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_archivo`),
  UNIQUE KEY `ux_pa_storage_key` (`storage_key`),
  UNIQUE KEY `ux_pa_checksum` (`checksum`),
  KEY `ix_pa_version` (`id_version`),
  KEY `ix_pa_formato` (`formato`),
  CONSTRAINT `fk_pa_version` FOREIGN KEY (`id_version`) REFERENCES `planoversion` (`id_version`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `planoarchivo` WRITE;
/*!40000 ALTER TABLE `planoarchivo` DISABLE KEYS */;
/*!40000 ALTER TABLE `planoarchivo` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `planoversion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planoversion` (
  `id_version` int unsigned NOT NULL AUTO_INCREMENT,
  `id_plano` int unsigned NOT NULL,
  `nro_version` int unsigned NOT NULL,
  `id_usuario` int unsigned NOT NULL,
  `id_estado` tinyint unsigned NOT NULL,
  `comentarios` text,
  `hash_integridad` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `created_user` int unsigned DEFAULT NULL,
  `updated_user` int unsigned DEFAULT NULL,
  `deleted_user` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id_version`),
  UNIQUE KEY `ux_pv_plano_nro` (`id_plano`,`nro_version`),
  UNIQUE KEY `ux_pv_hash` (`hash_integridad`),
  KEY `fk_pv_usuario` (`id_usuario`),
  KEY `fk_pv_created_user` (`created_user`),
  KEY `fk_pv_updated_user` (`updated_user`),
  KEY `fk_pv_deleted_user` (`deleted_user`),
  KEY `ix_pv_plano` (`id_plano`),
  KEY `ix_pv_estado` (`id_estado`),
  KEY `ix_pv_created` (`created_at`),
  KEY `ix_pv_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_pv_created_user` FOREIGN KEY (`created_user`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_pv_deleted_user` FOREIGN KEY (`deleted_user`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_pv_estado` FOREIGN KEY (`id_estado`) REFERENCES `estado_version` (`id_estado`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_pv_plano` FOREIGN KEY (`id_plano`) REFERENCES `plano` (`id_plano`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pv_updated_user` FOREIGN KEY (`updated_user`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_pv_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `planoversion` WRITE;
/*!40000 ALTER TABLE `planoversion` DISABLE KEYS */;
/*!40000 ALTER TABLE `planoversion` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id_rol` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Admin','Administrador del sistema','2025-10-01 05:34:29','2025-10-01 05:34:29'),(2,'Editor','Carga y edición de planos','2025-10-01 05:34:29','2025-10-01 05:34:29'),(3,'Lector','Solo lectura','2025-10-01 05:34:29','2025-10-01 05:34:29');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `rol_permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol_permiso` (
  `id_rol` int unsigned NOT NULL,
  `id_permiso` int unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_rol`,`id_permiso`),
  KEY `fk_rolperm_permiso` (`id_permiso`),
  CONSTRAINT `fk_rolperm_permiso` FOREIGN KEY (`id_permiso`) REFERENCES `permiso` (`id_permiso`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_rolperm_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `rol_permiso` WRITE;
/*!40000 ALTER TABLE `rol_permiso` DISABLE KEYS */;
INSERT INTO `rol_permiso` VALUES (1,1,'2025-10-01 05:34:29'),(1,2,'2025-10-01 05:34:29'),(1,3,'2025-10-01 05:34:29'),(1,4,'2025-10-01 05:34:29'),(2,1,'2025-10-01 05:34:29'),(2,2,'2025-10-01 05:34:29'),(3,1,'2025-10-01 05:34:29');
/*!40000 ALTER TABLE `rol_permiso` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `subzona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subzona` (
  `id_subzona` int unsigned NOT NULL AUTO_INCREMENT,
  `id_zona` int unsigned NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `codigo` varchar(120) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_subzona`),
  UNIQUE KEY `ux_subzona_codigo` (`codigo`),
  KEY `ix_subzona_zona` (`id_zona`),
  CONSTRAINT `fk_subzona_zona` FOREIGN KEY (`id_zona`) REFERENCES `zona` (`id_zona`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `subzona` WRITE;
/*!40000 ALTER TABLE `subzona` DISABLE KEYS */;
/*!40000 ALTER TABLE `subzona` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int unsigned NOT NULL AUTO_INCREMENT,
  `id_colaborador` int unsigned DEFAULT NULL,
  `nombre_mostrar` varchar(150) NOT NULL,
  `correo` varchar(180) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `id_estado` tinyint unsigned NOT NULL,
  `intentos_fallidos` tinyint unsigned NOT NULL DEFAULT '0',
  `bloqueado_hasta` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `created_user` int unsigned DEFAULT NULL,
  `updated_user` int unsigned DEFAULT NULL,
  `deleted_user` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `ux_usuario_correo` (`correo`),
  KEY `fk_usuario_colaborador` (`id_colaborador`),
  KEY `ix_usuario_estado` (`id_estado`),
  KEY `ix_usuario_bloqueo` (`bloqueado_hasta`),
  KEY `ix_usuario_deleted` (`deleted_at`),
  CONSTRAINT `fk_usuario_colaborador` FOREIGN KEY (`id_colaborador`) REFERENCES `colaborador` (`id_colaborador`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_usuario_estado` FOREIGN KEY (`id_estado`) REFERENCES `estado_usuario` (`id_estado`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `usuario_chk_1` CHECK ((`intentos_fallidos` <= 10))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,1,'Kadú Desposorio','kadu@example.com','$2y$10$hash_de_ejemplo_reemplazar_por_bcrypt',1,0,NULL,'2025-10-01 05:34:29','2025-10-01 05:34:29',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `usuario_notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_notificacion` (
  `id_usuario` int unsigned NOT NULL,
  `id_notificacion` int unsigned NOT NULL,
  `recibido_en` datetime DEFAULT NULL,
  `leido_en` datetime DEFAULT NULL,
  PRIMARY KEY (`id_usuario`,`id_notificacion`),
  KEY `fk_un_notificacion` (`id_notificacion`),
  KEY `ix_un_leido` (`leido_en`),
  KEY `ix_un_estado` (`id_usuario`,`leido_en`),
  CONSTRAINT `fk_un_notificacion` FOREIGN KEY (`id_notificacion`) REFERENCES `notificacion` (`id_notificacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_un_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `usuario_notificacion` WRITE;
/*!40000 ALTER TABLE `usuario_notificacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_notificacion` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `usuario_rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_rol` (
  `id_usuario` int unsigned NOT NULL,
  `id_rol` int unsigned NOT NULL,
  `asignado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`,`id_rol`),
  KEY `fk_usuariorol_rol` (`id_rol`),
  CONSTRAINT `fk_usuariorol_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_usuariorol_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `usuario_rol` WRITE;
/*!40000 ALTER TABLE `usuario_rol` DISABLE KEYS */;
INSERT INTO `usuario_rol` VALUES (1,1,'2025-10-01 05:34:29');
/*!40000 ALTER TABLE `usuario_rol` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `zona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `zona` (
  `id_zona` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  `codigo` varchar(120) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_zona`),
  UNIQUE KEY `ux_zona_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
LOCK TABLES `zona` WRITE;
/*!40000 ALTER TABLE `zona` DISABLE KEYS */;
/*!40000 ALTER TABLE `zona` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
