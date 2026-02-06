import { DataSource } from 'typeorm';
import { Course, CourseLevel, CourseCategory } from '../entities/course.entity';
import { Module } from '../entities/module.entity';
import { Lesson, LessonType } from '../entities/lesson.entity';

export async function seedAcademyCourses(dataSource: DataSource) {
  const courseRepository = dataSource.getRepository(Course);
  const moduleRepository = dataSource.getRepository(Module);
  const lessonRepository = dataSource.getRepository(Lesson);

  console.log('🌱 Seeding academy courses...');

  // Sample Courses
  const courses = [
    {
      slug: 'zaklady-hypotecniho-poradenstvi',
      title: 'Základy hypotečního poradenství',
      description:
        'Komplexní kurz pro začínající finanční poradce. Naučte se všechny aspekty hypotečního poradenství - od úvodních konzultací až po uzavření smlouvy.',
      thumbnailUrl: '/images/courses/hypoteky-zaklady.jpg',
      level: CourseLevel.BEGINNER,
      category: CourseCategory.FINANCIAL,
      instructorName: 'Ing. Martin Dvořák',
      instructorBio:
        'Senior hypoteční poradce s 15 lety zkušeností. Vedl více než 500 klientů k získání hypotéky.',
      instructorPhoto: '/images/instructors/martin-dvorak.jpg',
      duration: 180, // 3 hours
      published: true,
      featured: true,
      position: 1,
      modules: [
        {
          title: 'Úvod do hypotečního poradenství',
          description: 'Základní pojmy, typy hypoték a role poradce',
          position: 1,
          duration: 45,
          lessons: [
            {
              title: 'Co je hypotéka a jak funguje?',
              description: 'Základní principy hypotéky, úrok, splátky',
              position: 1,
              duration: 15,
              type: LessonType.VIDEO,
              published: true,
              free: true, // Preview lesson
            },
            {
              title: 'Typy hypoték v ČR',
              description: 'Klasická, americká, kombinovaná hypotéka',
              position: 2,
              duration: 20,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
            {
              title: 'Role hypotečního poradce',
              description: 'Zodpovědnosti, etika, proces poradenství',
              position: 3,
              duration: 10,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
          ],
        },
        {
          title: 'Proces žádosti o hypotéku',
          description: 'Krok za krokem od konzultace k schválení',
          position: 2,
          duration: 60,
          lessons: [
            {
              title: 'Úvodní konzultace s klientem',
              description: 'Co zjistit, jaké otázky položit',
              position: 1,
              duration: 20,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
            {
              title: 'Dokumentace a podklady',
              description: 'Jaké dokumenty jsou potřeba',
              position: 2,
              duration: 15,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
            {
              title: 'Kalkulace a porovnání nabídek',
              description: 'Jak správně porovnat nabídky bank',
              position: 3,
              duration: 25,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
          ],
        },
        {
          title: 'Práce s klientem',
          description: 'Komunikace, řešení námitek, uzavírání',
          position: 3,
          duration: 75,
          lessons: [
            {
              title: 'Efektivní komunikace s klientem',
              description: 'Jak získat důvěru a budovat vztah',
              position: 1,
              duration: 25,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
            {
              title: 'Řešení námitek a obav',
              description: 'Časté námitky a jak na ně reagovat',
              position: 2,
              duration: 25,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
            {
              title: 'Uzavření a následná péče',
              description: 'Finalizace smlouvy a péče o klienta',
              position: 3,
              duration: 25,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
          ],
        },
      ],
    },
    {
      slug: 'prodej-nemovitosti-pro-makelare',
      title: 'Prodej nemovitostí pro začínající makléře',
      description:
        'Praktický kurz zaměřený na proces prodeje nemovitostí. Od ocenění přes marketing až po uzavření smlouvy.',
      thumbnailUrl: '/images/courses/reality-prodej.jpg',
      level: CourseLevel.BEGINNER,
      category: CourseCategory.REAL_ESTATE,
      instructorName: 'Lucie Novotná',
      instructorBio:
        'Realitní makléřka s 10 lety zkušeností. Prodala více než 200 nemovitostí v hodnotě přes 500 mil. Kč.',
      instructorPhoto: '/images/instructors/lucie-novotna.jpg',
      duration: 240, // 4 hours
      published: true,
      featured: true,
      position: 2,
      modules: [
        {
          title: 'Základy realitního makléřství',
          description: 'Úvod do profese, zákonné rámce, etika',
          position: 1,
          duration: 60,
          lessons: [
            {
              title: 'Co dělá realitní makléř?',
              description: 'Role, odpovědnosti, příležitosti',
              position: 1,
              duration: 20,
              type: LessonType.VIDEO,
              published: true,
              free: true, // Preview
            },
            {
              title: 'Právní rámec v ČR',
              description: 'Zákony, předpisy, daně',
              position: 2,
              duration: 20,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
            {
              title: 'Etika a profesionalita',
              description: 'Kodex makléře, důvěra, transparentnost',
              position: 3,
              duration: 20,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
          ],
        },
        {
          title: 'Ocenění nemovitostí',
          description: 'Metody ocenění, komparace, tržní analýza',
          position: 2,
          duration: 90,
          lessons: [
            {
              title: 'Metody oceňování',
              description: 'Nákladová, výnosová, porovnávací',
              position: 1,
              duration: 30,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
            {
              title: 'Tržní analýza a komparace',
              description: 'Jak správně porovnat nemovitosti',
              position: 2,
              duration: 30,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
            {
              title: 'Praktické ocenění krok za krokem',
              description: 'Případová studie reálné nemovitosti',
              position: 3,
              duration: 30,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
          ],
        },
        {
          title: 'Marketing a prodej',
          description: 'Jak efektivně prodat nemovitost',
          position: 3,
          duration: 90,
          lessons: [
            {
              title: 'Fotografie a prezentace nemovitosti',
              description: 'Jak vytvořit atraktivní inzerát',
              position: 1,
              duration: 30,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
            {
              title: 'Prohlídky s klienty',
              description: 'Jak vést efektivní prohlídky',
              position: 2,
              duration: 30,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
            {
              title: 'Vyjednávání a uzavření',
              description: 'Strategie vyjednávání, finalizace smlouvy',
              position: 3,
              duration: 30,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
          ],
        },
      ],
    },
    {
      slug: 'investicni-strategie-pro-pokrocile',
      title: 'Investiční strategie pro pokročilé',
      description:
        'Pokročilý kurz pro finanční poradce. ETF, akcie, dluhopisy, diverzifikace portfolia a daňová optimalizace.',
      thumbnailUrl: '/images/courses/investice-advanced.jpg',
      level: CourseLevel.ADVANCED,
      category: CourseCategory.FINANCIAL,
      instructorName: 'Ing. Jan Král, MBA',
      instructorBio:
        'Investiční specialista s 20 lety zkušeností. Spravuje portfolia v hodnotě přes 2 miliardy Kč.',
      instructorPhoto: '/images/instructors/jan-kral.jpg',
      duration: 300, // 5 hours
      published: true,
      featured: false,
      position: 3,
      modules: [
        {
          title: 'Moderní investiční nástroje',
          description: 'ETF, indexové fondy, alternativní investice',
          position: 1,
          duration: 120,
          lessons: [
            {
              title: 'ETF vs. Mutual Funds',
              description: 'Výhody, nevýhody, kdy co použít',
              position: 1,
              duration: 40,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
            {
              title: 'Indexové strategie',
              description: 'Pasivní investování, tracking error',
              position: 2,
              duration: 40,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
            {
              title: 'Alternativní investice',
              description: 'REITs, komodity, kryptoměny',
              position: 3,
              duration: 40,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
          ],
        },
        {
          title: 'Diverzifikace a řízení rizik',
          description: 'Jak správně složit odolné portfolio',
          position: 2,
          duration: 90,
          lessons: [
            {
              title: 'Moderní teorie portfolia',
              description: 'Markowitz, eficientní hranice',
              position: 1,
              duration: 30,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
            {
              title: 'Praktická diverzifikace',
              description: 'Jak skutečně diverzifikovat',
              position: 2,
              duration: 30,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
            {
              title: 'Rebalancování portfolia',
              description: 'Kdy a jak upravovat alokaci',
              position: 3,
              duration: 30,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
          ],
        },
        {
          title: 'Daňová optimalizace',
          description: 'Jak minimalizovat daňovou zátěž',
          position: 3,
          duration: 90,
          lessons: [
            {
              title: 'Daně z kapitálových výnosů',
              description: 'Základ daně, osvobození, odpočty',
              position: 1,
              duration: 30,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
            {
              title: 'Tax-loss harvesting',
              description: 'Kompenzace zisků ztrátami',
              position: 2,
              duration: 30,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
            {
              title: 'Daňově efektivní účty',
              description: 'DIP, IPS, life-cycle strategie',
              position: 3,
              duration: 30,
              type: LessonType.VIDEO,
              published: true,
              free: false,
            },
          ],
        },
      ],
    },
  ];

  // Create courses with modules and lessons
  for (const courseData of courses) {
    const { modules, ...courseInfo } = courseData;

    // Create course
    const course = courseRepository.create({
      ...courseInfo,
      moduleCount: modules.length,
      lessonCount: modules.reduce((sum, m) => sum + m.lessons.length, 0),
    });

    const savedCourse = await courseRepository.save(course);
    console.log(`  ✓ Created course: ${savedCourse.title}`);

    // Create modules
    for (const moduleData of modules) {
      const { lessons, ...moduleInfo } = moduleData;

      const module = moduleRepository.create({
        ...moduleInfo,
        courseId: savedCourse.id,
        lessonCount: lessons.length,
      });

      const savedModule = await moduleRepository.save(module);
      console.log(`    ✓ Created module: ${savedModule.title}`);

      // Create lessons
      for (const lessonData of lessons) {
        const lesson = lessonRepository.create({
          ...lessonData,
          moduleId: savedModule.id,
        });

        await lessonRepository.save(lesson);
        console.log(`      ✓ Created lesson: ${lesson.title}`);
      }
    }
  }

  console.log('✅ Academy courses seeded successfully!');
}
