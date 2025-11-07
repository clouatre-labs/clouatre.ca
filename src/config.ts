export const SITE = {
  website: "https://clouatre.ca",
  author: "Hugues Clouâtre",
  profile: "https://github.com/clouatre",
  desc: "Technology leadership, AI workflows, and cloud architecture insights from a world-class executive leader with expertise in AWS, Oracle, and digital transformation.",
  title: "Hugues Clouâtre",
  ogImage: "hugues-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 6,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Suggest Changes",
    url: "https://github.com/clouatre-labs/clouatre.ca/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "America/Montreal", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
