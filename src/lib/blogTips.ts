// Static blog tips for Croatia360 Blog & Tips section.
// Each tip has i18n keys for title, short description (card), and body (single page).

const gcsBaseUrl = "https://storage.googleapis.com/croatiasara2026/images/";

export interface BlogTip {
  slug: string;
  titleKey: string;
  descriptionKey: string;
  bodyKey: string;
  imageUrl: string;
}

export const blogTips: BlogTip[] = [
  {
    slug: "best-time-to-visit",
    titleKey: "blog_tip_1_title",
    descriptionKey: "blog_tip_1_description",
    bodyKey: "blog_tip_1_body",
    imageUrl: `${gcsBaseUrl}regions/dalmacija/Primosten_aerial.jpg`,
  },
  {
    slug: "local-customs-etiquette",
    titleKey: "blog_tip_2_title",
    descriptionKey: "blog_tip_2_description",
    bodyKey: "blog_tip_2_body",
    imageUrl: `${gcsBaseUrl}inspiring_culture.jpg`,
  },
  {
    slug: "getting-around-croatia",
    titleKey: "blog_tip_3_title",
    descriptionKey: "blog_tip_3_description",
    bodyKey: "blog_tip_3_body",
    imageUrl: `${gcsBaseUrl}regions/kvarner/Rijeka_grad.jpg`,
  },
  {
    slug: "food-and-drink",
    titleKey: "blog_tip_4_title",
    descriptionKey: "blog_tip_4_description",
    bodyKey: "blog_tip_4_body",
    imageUrl: `${gcsBaseUrl}inspiring_food.jpg`,
  },
  {
    slug: "islands-and-coast",
    titleKey: "blog_tip_5_title",
    descriptionKey: "blog_tip_5_description",
    bodyKey: "blog_tip_5_body",
    imageUrl: `${gcsBaseUrl}inspiring_beach.jpg`,
  },
  {
    slug: "what-to-pack",
    titleKey: "blog_tip_6_title",
    descriptionKey: "blog_tip_6_description",
    bodyKey: "blog_tip_6_body",
    imageUrl: `${gcsBaseUrl}inspiring_nature.jpg`,
  },
];

export function getBlogTipBySlug(slug: string): BlogTip | undefined {
  return blogTips.find((t) => t.slug === slug);
}

export function getAllBlogTipSlugs(): string[] {
  return blogTips.map((t) => t.slug);
}
