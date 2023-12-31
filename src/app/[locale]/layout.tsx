import { notFound } from 'next/navigation'
import { useLocale, NextIntlClientProvider, createTranslator } from 'next-intl'
import { Analytics } from '@vercel/analytics/react'

import '../globals.css'

interface Params {
  locale: string
}

// @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export async function generateMetadata({
  params: { locale },
}: {
  params: Params
}) {
  const messages = (await import(`../../messages/${locale}.json`)).default
  const t = createTranslator({ locale, messages })

  const title = `${t('Index.title')} ${t('Index.title2')}`
  const description = t('Index.description')

  const url = process.env.BASE_URL ?? ''

  return {
    title,
    description,
    keyworkds: ['Hackathon', 'React', 'Next.js'],
    authors: [{ name: 'Thibault Friedrich' }],
    openGraph: {
      title,
      description,
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    metadataBase: new URL(url),
  }
}

export interface LocaleLayoutProps {
  children: React.ReactNode
  params: Params
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const locale = useLocale()

  // Validate that the incoming `locale` parameter is a valid locale
  if (params.locale !== locale) {
    notFound()
  }

  let messages
  try {
    messages = (await import(`../../messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
