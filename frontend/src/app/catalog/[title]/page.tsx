import ClientArticle from "@/components/ClientArticle/ClientArticle";
import { notFound } from "next/navigation";

interface ArticleData {
  _id: string;
  category: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  tag?: string;
  textenCopy?: string[];
}

async function getArticle(title: string): Promise<ArticleData> {
  const decodedTitle = decodeURIComponent(title);
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    }/articles?title=${decodedTitle}`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!response.ok) {
    notFound();
  }
  return response.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ title: string }>; // Изменяем тип на Promise
}) {
  const { title } = await params; // Ждём params
  const article = await getArticle(title);
  return {
    title: article.title,
    description: article.text.slice(0, 150),
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ title: string }>; // Изменяем тип на Promise
}) {
  const { title } = await params; // Ждём params
  const article = await getArticle(title);
  return <ClientArticle initialArticle={article} />;
}
