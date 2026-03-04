exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('video_progress').del();
  await knex('enrollments').del();
  await knex('videos').del();
  await knex('sections').del();
  await knex('subjects').del();

  // Insert sample subject
  const [subjectId] = await knex('subjects').insert({
    title: 'Introduction to Web Development',
    slug: 'intro-web-development',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.',
    is_published: true,
    created_at: new Date(),
    updated_at: new Date()
  });

  // Insert sections
  const [section1Id] = await knex('sections').insert({
    subject_id: subjectId,
    title: 'Getting Started with HTML',
    order_index: 0,
    created_at: new Date(),
    updated_at: new Date()
  });

  const [section2Id] = await knex('sections').insert({
    subject_id: subjectId,
    title: 'CSS Fundamentals',
    order_index: 1,
    created_at: new Date(),
    updated_at: new Date()
  });

  const [section3Id] = await knex('sections').insert({
    subject_id: subjectId,
    title: 'JavaScript Basics',
    order_index: 2,
    created_at: new Date(),
    updated_at: new Date()
  });

  // Insert videos for Section 1 (HTML)
  await knex('videos').insert([
    {
      section_id: section1Id,
      title: 'What is HTML?',
      description: 'Introduction to HTML and its role in web development.',
      youtube_video_id: 'dD2EISBDjWM',
      order_index: 0,
      duration_seconds: 600,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      section_id: section1Id,
      title: 'HTML Document Structure',
      description: 'Understanding the basic structure of an HTML document.',
      youtube_video_id: 'mbeT8mpmtHA',
      order_index: 1,
      duration_seconds: 720,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      section_id: section1Id,
      title: 'Common HTML Elements',
      description: 'Learn about headings, paragraphs, links, and images.',
      youtube_video_id: 'Wm6CUkswsNw',
      order_index: 2,
      duration_seconds: 900,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);

  // Insert videos for Section 2 (CSS)
  await knex('videos').insert([
    {
      section_id: section2Id,
      title: 'Introduction to CSS',
      description: 'Learn what CSS is and how it styles web pages.',
      youtube_video_id: 'yfoY53QXEnI',
      order_index: 0,
      duration_seconds: 480,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      section_id: section2Id,
      title: 'CSS Selectors',
      description: 'Understanding different ways to select elements in CSS.',
      youtube_video_id: 'l1mER1bV0N0',
      order_index: 1,
      duration_seconds: 650,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);

  // Insert videos for Section 3 (JavaScript)
  await knex('videos').insert([
    {
      section_id: section3Id,
      title: 'JavaScript Basics',
      description: 'Introduction to JavaScript programming language.',
      youtube_video_id: 'W6NZfCO5SIk',
      order_index: 0,
      duration_seconds: 3000,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      section_id: section3Id,
      title: 'Variables and Data Types',
      description: 'Understanding variables, strings, numbers, and booleans.',
      youtube_video_id: 'hdI2bqOjy3c',
      order_index: 1,
      duration_seconds: 1800,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);

  console.log('Sample data seeded successfully!');
};
