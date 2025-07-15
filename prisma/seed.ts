import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const userId = randomUUID();

  const subscription = await prisma.subscription.create({
    data: {
      user_id: userId,
      plan: "premium",
      status: "active",
      expires_at: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  });

  console.log("Subscription criada:", subscription);

  const sponsoredContents = await prisma.sponsoredContent.createMany({
    data: [
      {
        user_id: userId,
        type: "post",
        content: "Post patrocinado sobre tecnologia",
        start_date: new Date(),
        end_date: new Date(new Date().setDate(new Date().getDate() + 7)),
        status: "active",
      },
      {
        user_id: userId,
        type: "badge",
        content: "Badge especial para membros premium",
        start_date: new Date(),
        end_date: new Date(new Date().setDate(new Date().getDate() + 10)),
        status: "active",
      },
    ],
  });

  console.log("SponsoredContents criados:", sponsoredContents);
}

main()
  .then(() => {
    console.log("🌱 Seed finalizado com sucesso!");
    return prisma.$disconnect();
  })
  .catch((error) => {
    console.error("Erro ao executar o seed:", error);
    return prisma.$disconnect().finally(() => process.exit(1));
});
