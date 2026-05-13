import ArticleLoader from '@/components/ArticleLoader'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  return <ArticleLoader slug={slug} />
}
