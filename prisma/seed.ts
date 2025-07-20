/*import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Usuários
  const user1 = await prisma.user.create({
    data: {
      id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
      email: 'romeu@yhanko.com',
      password: 'senha123',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: 'b2c3d4e5-f6a7-8901-bcde-2345678901bc',
      nome: 'Maria Silva',
      email: 'maria@example.com',
    },
  });

  // Selos de verificação
  await prisma.verificationSeal.createMany({
    data: [
      {
        user_id: user1.id,
        is_verified: true,
      },
      {
        user_id: user2.id,
        is_verified: false,
      },
    ],
  });

  // Conteúdos patrocinados
  await prisma.sponsoredContent.createMany({
    data: [
      {
        id: 'sc-001',
        ref_content: 'post-001',
        type_content: 'image',
        price_per_day: 10.00,
        days: 5,
        total_price: 50.00,
        start_date: new Date('2025-07-01'),
        end_date: new Date('2025-07-06'),
        area_of_study: 'Tecnologia',
        interest: ['Desenvolvimento', 'IA'],
        localization: 'Luanda',
        curse: 'Ciência da Computação',
        academic_level: 'Licenciatura',
      },
      {
        id: 'sc-002',
        ref_content: 'post-002',
        type_content: 'video',
        price_per_day: 20.00,
        days: 3,
        total_price: 60.00,
        start_date: new Date('2025-07-10'),
        end_date: new Date('2025-07-13'),
        area_of_study: 'Design',
        interest: ['UX', 'UI'],
        localization: 'Maputo',
        curse: 'Design Gráfico',
        academic_level: 'Mestrado',
      },
    ],
  });

  console.log('✅ Seed executado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao rodar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});
*/