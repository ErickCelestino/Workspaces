-- CreateTable
CREATE TABLE "general"."ConfirmDeleteUser" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfirmDeleteUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "general"."ConfirmDeleteUser" ADD CONSTRAINT "ConfirmDeleteUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "general"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
