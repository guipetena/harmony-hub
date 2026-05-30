import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  const hash = (p: string) => bcrypt.hash(p, 10)

  // ── Artistas ──────────────────────────────────────────────────────────
  const artistsData = [
    {
      email: 'artista@demo.com', name: 'João Silva',
      profile: {
        slug: 'joao-mpb',
        artisticName: 'João & MPB',
        shortBio: 'Voz e violão para jantares e eventos íntimos.',
        bio: 'Músico com 10 anos de experiência em MPB e Bossa Nova. Repertório versátil de Tom Jobim a Chico Buarque, ideal para restaurantes, casamentos e eventos corporativos.',
        city: 'São Paulo', state: 'SP',
        type: 'Solo',
        priceMin: 800, priceMax: 2000,
        musicalStyles: ['MPB', 'Bossa Nova', 'Acústico'],
        membersCount: 1,
        available: true,
        whatsapp: '11999999999',
        instagram: '@joaompb',
        verified: true,
      },
    },
    {
      email: 'luana@demo.com', name: 'Luana Prado',
      profile: {
        slug: 'luana-prado',
        artisticName: 'Luana Prado',
        shortBio: 'Voz suave para jantares e eventos íntimos.',
        bio: 'Cantora há 8 anos, especializada em MPB e Bossa Nova. Repertório versátil de Tom Jobim a Adele, ideal para restaurantes, casamentos e eventos corporativos.',
        city: 'São Paulo', state: 'SP',
        type: 'Solo',
        priceMin: 600, priceMax: 1200,
        musicalStyles: ['MPB', 'Bossa Nova', 'Acústico'],
        membersCount: 1,
        available: true,
        whatsapp: '11988880001',
        instagram: '@luanaprado',
        verified: true,
      },
    },
    {
      email: 'duovioleiro@demo.com', name: 'Duo Violeiro',
      profile: {
        slug: 'duo-violeiro',
        artisticName: 'Duo Violeiro',
        shortBio: 'Acústico envolvente para bares e pubs.',
        bio: 'Dupla com 6 anos no circuito de bares e restaurantes. Repertório de pop/rock acústico nacional e internacional. Animamos qualquer ambiente.',
        city: 'Curitiba', state: 'PR',
        type: 'Dupla',
        priceMin: 900, priceMax: 1800,
        musicalStyles: ['Acústico', 'Pop/Rock', 'MPB'],
        membersCount: 2,
        available: true,
        whatsapp: '41988880002',
        instagram: '@duovioleiro',
        verified: false,
      },
    },
    {
      email: 'bandanoturna@demo.com', name: 'Banda Noturna',
      profile: {
        slug: 'banda-noturna',
        artisticName: 'Banda Noturna',
        shortBio: 'Rock e indie para noites inesquecíveis.',
        bio: 'Banda de rock com 4 integrantes. Show completo com luz e som próprios. Repertório do clássico ao moderno, do nacional ao internacional.',
        city: 'Rio de Janeiro', state: 'RJ',
        type: 'Banda',
        priceMin: 2500, priceMax: 5000,
        musicalStyles: ['Pop/Rock', 'Indie'],
        membersCount: 4,
        available: false,
        whatsapp: '21988880003',
        instagram: '@bandanoturna',
        verified: true,
      },
    },
    {
      email: 'marcusblue@demo.com', name: 'Marcus Blue',
      profile: {
        slug: 'marcus-blue',
        artisticName: 'Marcus Blue',
        shortBio: 'Jazz e Bossa Nova com alma.',
        bio: 'Pianista e cantor especializado em jazz e bossa nova. Ambiente sofisticado para hotéis, restaurantes e eventos corporativos de alto padrão.',
        city: 'Belo Horizonte', state: 'MG',
        type: 'Solo',
        priceMin: 800, priceMax: 1600,
        musicalStyles: ['Jazz', 'Bossa Nova'],
        membersCount: 1,
        available: true,
        whatsapp: '31988880004',
        instagram: '@marcusblue',
        verified: false,
      },
    },
    {
      email: 'grupobatuque@demo.com', name: 'Grupo Batuque',
      profile: {
        slug: 'grupo-batuque',
        artisticName: 'Grupo Batuque',
        shortBio: 'Samba, pagode e forró que faz todo mundo dançar.',
        bio: 'Grupo de 5 integrantes especializado em samba, pagode e forró. Muita energia e interação com o público. Perfeito para festas, casamentos e eventos temáticos.',
        city: 'Salvador', state: 'BA',
        type: 'Banda',
        priceMin: 1800, priceMax: 3500,
        musicalStyles: ['Samba', 'Pagode', 'Forró'],
        membersCount: 5,
        available: true,
        whatsapp: '71988880005',
        instagram: '@grupobatuque',
        verified: false,
      },
    },
    {
      email: 'isacampos@demo.com', name: 'Isa Campos',
      profile: {
        slug: 'isa-campos',
        artisticName: 'Isa Campos',
        shortBio: 'Sertanejo acústico direto do coração.',
        bio: 'Cantora sertaneja com voz marcante e repertório dos maiores sucessos nacionais. Ideal para festas de aniversário, churrascos e eventos ao ar livre.',
        city: 'Porto Alegre', state: 'RS',
        type: 'Solo',
        priceMin: 700, priceMax: 1400,
        musicalStyles: ['Sertanejo', 'Acústico'],
        membersCount: 1,
        available: true,
        whatsapp: '51988880006',
        instagram: '@isacampos',
        verified: false,
      },
    },
  ]

  for (const a of artistsData) {
    const user = await prisma.user.upsert({
      where: { email: a.email },
      update: {},
      create: { name: a.name, email: a.email, password: await hash('123456'), role: 'ARTIST' },
    })
    const profile = await prisma.artistProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: { ...a.profile, userId: user.id },
    })
    await prisma.artistMedia.createMany({
      data: [
        { artistProfileId: profile.id, type: 'IMAGE', url: `https://picsum.photos/seed/${a.profile.slug}/800/600` },
      ],
      skipDuplicates: true,
    })
  }

  // ── Estabelecimento ───────────────────────────────────────────────────
  const estUser = await prisma.user.upsert({
    where: { email: 'bar@demo.com' },
    update: {},
    create: { name: 'Maria Santos', email: 'bar@demo.com', password: await hash('123456'), role: 'ESTABLISHMENT' },
  })

  await prisma.establishmentProfile.upsert({
    where: { userId: estUser.id },
    update: {},
    create: {
      userId: estUser.id,
      establishmentName: 'Bar do Zé',
      city: 'São Paulo',
      state: 'SP',
      description: 'Bar tradicional com música ao vivo toda sexta.',
      whatsapp: '11988888888',
    },
  })

  console.log('✅ Seed concluído!')
  console.log('   artista@demo.com / 123456  (artista demo principal)')
  console.log('   bar@demo.com / 123456       (estabelecimento demo)')
  console.log('   + 6 artistas adicionais com slug, priceMin/Max, type')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
