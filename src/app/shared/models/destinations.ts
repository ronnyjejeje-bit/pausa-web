export interface Destination { name: string; region: string; seed: string; }

export const POPULAR_DESTINATIONS: Destination[] = [
  { name: 'Lima', region: 'Costa central', seed: 'dest-lima' },
  { name: 'Cusco', region: 'Sur andino', seed: 'dest-cusco' },
  { name: 'Máncora', region: 'Costa norte', seed: 'dest-mancora' },
  { name: 'Paracas', region: 'Costa sur', seed: 'dest-paracas' },
  { name: 'Arequipa', region: 'Sur andino', seed: 'dest-arequipa' },
  { name: 'Huaraz', region: 'Andes del norte', seed: 'dest-huaraz' },
];

export const DESTINATION_SUGGESTIONS = [
  ...POPULAR_DESTINATIONS.map((d) => d.name),
  'Oxapampa', 'Lunahuaná', 'Urubamba', 'Barranco', 'Miraflores', 'San Isidro',
];