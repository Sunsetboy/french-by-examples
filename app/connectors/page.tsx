import { getAllConnectors } from '@/lib/data';
import { ConnectorsList } from '@/components/connectors-list';

export default function ConnectorsPage() {
  const allConnectors = getAllConnectors();

  return <ConnectorsList connectors={allConnectors} />;
}
