-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.4.32-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para gestao
CREATE DATABASE IF NOT EXISTS `gestao` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `gestao`;

-- Copiando estrutura para tabela gestao.categoria
CREATE TABLE IF NOT EXISTS `categoria` (
  `CategoriaID` int(11) NOT NULL AUTO_INCREMENT,
  `Nome` varchar(255) NOT NULL,
  `Descricao` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`CategoriaID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela gestao.fornecedor
CREATE TABLE IF NOT EXISTS `fornecedor` (
  `FornecedorID` int(11) NOT NULL AUTO_INCREMENT,
  `Nome` varchar(255) NOT NULL,
  `Endereco` varchar(255) DEFAULT NULL,
  `Telefone` varchar(50) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `CNPJ` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`FornecedorID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela gestao.historico
CREATE TABLE IF NOT EXISTS `historico` (
  `MovimentacaoID` int(11) NOT NULL AUTO_INCREMENT,
  `ProdutoID` int(11) DEFAULT NULL,
  `CategoriaID` int(11) DEFAULT NULL,
  `TipoMovimentacao` varchar(255) DEFAULT NULL,
  `Preco` decimal(10,2) DEFAULT NULL,
  `Quantidade` int(11) NOT NULL,
  `FornecedorID` int(11) DEFAULT NULL,
  `Nome` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`MovimentacaoID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela gestao.produto
CREATE TABLE IF NOT EXISTS `produto` (
  `ProdutoID` int(11) NOT NULL AUTO_INCREMENT,
  `Nome` varchar(255) NOT NULL,
  `Descricao` varchar(1000) DEFAULT NULL,
  `Preco` decimal(10,2) NOT NULL,
  `QuantidadeEmEstoque` int(11) NOT NULL,
  `CategoriaID` int(11) DEFAULT NULL,
  `FornecedorID` int(11) DEFAULT NULL,
  `Validade` date DEFAULT NULL,
  `Fabricacao` date DEFAULT NULL,
  PRIMARY KEY (`ProdutoID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela gestao.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `UsuarioID` int(11) NOT NULL AUTO_INCREMENT,
  `CNPJ` varchar(255) NOT NULL,
  `Senha` varchar(255) NOT NULL,
  `Permissao` int(11) NOT NULL DEFAULT 1,
  `Email` tinytext NOT NULL,
  `Telefone` tinytext NOT NULL,
  `CEP` varchar(255) NOT NULL,
  `Casa` varchar(255) NOT NULL,
  PRIMARY KEY (`UsuarioID`),
  UNIQUE KEY `Email` (`CNPJ`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportação de dados foi desmarcado.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
