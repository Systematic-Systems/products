-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'Styles'
--
-- ---

CREATE TABLE Styles (
  id integer PRIMARY KEY,
  productId integer NOT NULL,
  name VARCHAR(55) NOT NULL,
  sale_price money DEFAULT 0,
  original_price money DEFAULT 0,
  default_style integer DEFAULT 0,
  FOREIGN KEY (productId)
    REFERENCES Product (id)
);

-- ---
-- Table 'Product'
--
-- ---

CREATE TABLE Product (
  id integer PRIMARY KEY,
  name VARCHAR(55) DEFAULT NULL,
  slogan VARCHAR(500) DEFAULT NULL,
  description VARCHAR(500) DEFAULT NULL,
  category VARCHAR(55) DEFAULT NULL,
  default_price money DEFAULT 0
);

-- ---
-- Table 'skus'
--
-- ---

CREATE TABLE Skus (
  id integer PRIMARY KEY,
  styleId integer DEFAULT NULL,
  size VARCHAR(10) DEFAULT NULL,
  quantity integer DEFAULT 0,
  FOREIGN KEY (styleId)
    REFERENCES Styles (id)
);

-- ---
-- Table 'photos'
--
-- ---

CREATE TABLE Photos (
  id integer PRIMARY KEY,
  styleId integer NOT NULL,
  thumbnail_url VARCHAR(500),
  url VARCHAR(500)
  -- FOREIGN KEY (styleId)
  --   REFERENCES Styles (id)
);

-- ---
-- Table 'Related'
--
-- ---

CREATE TABLE Related (
  id integer PRIMARY KEY,
  current_product_id integer NOT NULL,
  related_product_id integer NOT NULL,
  -- FOREIGN KEY (current_product_id)
  --   REFERENCES Product (id)
);

-- ---
-- Table 'Features'
--
-- ---

CREATE TABLE Features (
  id integer PRIMARY KEY,
  product_id integer NOT NULL,
  feature VARCHAR(55) NOT NULL,
  value VARCHAR(100) DEFAULT NULL
);