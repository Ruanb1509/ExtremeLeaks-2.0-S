/*
  # Criar tabela de modelos

  1. Nova Tabela
    - `models`
      - `id` (integer, primary key, auto increment)
      - `name` (string, not null)
      - `photoUrl` (string, not null)
      - `bio` (text, nullable)
      - `hairColor` (string, nullable)
      - `eyeColor` (string, nullable)
      - `bodyType` (string, nullable)
      - `bustSize` (string, nullable)
      - `height` (integer, nullable - em cm)
      - `weight` (integer, nullable - em kg)
      - `age` (integer, nullable)
      - `birthPlace` (string, nullable)
      - `ethnicity` (enum, nullable)
      - `orientation` (string, nullable)
      - `tags` (json, nullable)
      - `views` (integer, default 0)
      - `slug` (string, unique, not null)
      - `isActive` (boolean, default true)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)

  2. Índices
    - Índice único no slug
    - Índice na etnia para filtros
    - Índice nas visualizações para ordenação
*/

CREATE TABLE IF NOT EXISTS models (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  "photoUrl" VARCHAR(500) NOT NULL,
  bio TEXT,
  "hairColor" VARCHAR(100),
  "eyeColor" VARCHAR(100),
  "bodyType" VARCHAR(100),
  "bustSize" VARCHAR(20),
  height INTEGER,
  weight INTEGER,
  age INTEGER,
  "birthPlace" VARCHAR(255),
  ethnicity VARCHAR(20) CHECK (ethnicity IN ('arab', 'asian', 'ebony', 'indian', 'latina', 'white')),
  orientation VARCHAR(100),
  tags JSONB DEFAULT '[]',
  views INTEGER DEFAULT 0 NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  "isActive" BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_models_ethnicity ON models(ethnicity);
CREATE INDEX IF NOT EXISTS idx_models_views ON models(views DESC);
CREATE INDEX IF NOT EXISTS idx_models_created_at ON models("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_models_active ON models("isActive");
CREATE INDEX IF NOT EXISTS idx_models_tags ON models USING GIN(tags);