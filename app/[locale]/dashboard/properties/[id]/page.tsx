import BasePage, { generateStaticParams as baseGenerateStaticParams } from '../../../../dashboard/properties/[id]/page';

// Wrapper page that adapts locale-prefixed params to the base page
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { id } = await params;
  return <BasePage params={Promise.resolve({ id })} />;
}

// Expand the base page's params with locale prefixes so Next can statically build them
export function generateStaticParams() {
  const baseParams = baseGenerateStaticParams(); // [{ id }]
  const locales = ['en', 'ar'];
  return baseParams.flatMap(({ id }: { id: string }) =>
    locales.map((locale) => ({ locale, id }))
  );
}


