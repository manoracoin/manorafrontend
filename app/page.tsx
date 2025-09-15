import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function Home() {
  const c = await cookies()
  const locale = (c.get('NEXT_LOCALE')?.value || 'en') as 'en' | 'ar'
  redirect(`/${locale}/dashboard`)
}