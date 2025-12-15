import { getAllTestIds, getTestById } from '@/lib/data';
import { TestTaker } from '@/components/test-taker';
import { notFound } from 'next/navigation';

interface TestPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = getAllTestIds();
  return ids.map((id) => ({
    id,
  }));
}

export default async function TestPage({ params }: TestPageProps) {
  const { id } = await params;

  let test;
  try {
    test = getTestById(id);
  } catch {
    notFound();
  }

  return <TestTaker test={test} />;
}
