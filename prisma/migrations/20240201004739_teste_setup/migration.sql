-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "geral";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "summons";

-- CreateTable
CREATE TABLE "geral"."Teste" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Teste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "summons"."Teste1" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Teste1_pkey" PRIMARY KEY ("id")
);
