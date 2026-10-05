export type MenuItem = { name: string; price: string; desc: string; tag?: string };
export type MenuGroup = {
  id: 'cafe' | 'filtrados' | 'frios' | 'dulce' | 'salado';
  title: string;
  photo?: { src: string; width: number; height: number; alt: string };
  items: MenuItem[];
};

export const menu: MenuGroup[] = [
  {
    id: 'cafe',
    title: 'Café',
    items: [
      { name: 'Espresso', price: '$3.200', desc: 'Doble, con el blend de Huila y Mogiana.' },
      { name: 'Cortado', price: '$3.600', desc: 'Espresso con un toque de leche texturizada.' },
      { name: 'Flat white', price: '$4.800', desc: 'Doble ristretto y leche sedosa. Intenso y cremoso.', tag: 'Favorito' },
      { name: 'Latte', price: '$5.200', desc: 'Espresso con mucha leche, en taza grande.' },
      { name: 'Capuchino', price: '$5.200', desc: 'Con espuma firme y cacao amargo por encima.' },
      { name: 'Mocaccino', price: '$5.600', desc: 'Latte con chocolate semiamargo derretido.' },
    ],
  },
  {
    id: 'filtrados',
    title: 'Filtrados',
    photo: { src: '/assets/img/filtrado.jpg', width: 1600, height: 1067, alt: 'Agua caliente cayendo sobre café molido en un V60, vista desde arriba.' },
    items: [
      { name: 'V60 de Guji', price: '$5.900', desc: 'Etiopía natural. Durazno y jazmín, cuerpo liviano.' },
      { name: 'Chemex para dos', price: '$9.800', desc: 'Tres tazas de café limpio, a elección del origen de la semana.' },
    ],
  },
  {
    id: 'frios',
    title: 'Fríos',
    items: [
      { name: 'Cold brew', price: '$5.500', desc: 'Infusionado 18 horas en frío, con hielo.' },
      { name: 'Tónico de café', price: '$6.200', desc: 'Espresso sobre agua tónica, hielo y una rodaja de naranja.' },
    ],
  },
  {
    id: 'dulce',
    title: 'Dulce',
    photo: { src: '/assets/img/dulce.jpg', width: 1600, height: 897, alt: 'Medialunas cortadas sobre un plato, junto a una taza de café.' },
    items: [
      { name: 'Medialunas (x2)', price: '$3.800', desc: 'De manteca, almibaradas, horneadas cada mañana.', tag: 'Del día' },
      { name: 'Budín de limón', price: '$4.900', desc: 'Húmedo, con glaseado cítrico.' },
      { name: 'Brownie de chocolate', price: '$5.200', desc: 'Con nueces y sal en escamas.' },
      { name: 'Alfajor de maicena', price: '$2.800', desc: 'Dulce de leche y coco rallado.' },
    ],
  },
  {
    id: 'salado',
    title: 'Salado',
    items: [
      { name: 'Tostado de jamón y queso', price: '$9.500', desc: 'Pan de miga artesanal, jamón cocido natural y queso fontina.' },
      { name: 'Tostada con palta', price: '$10.800', desc: 'Pan de masa madre, palta, huevo poché y semillas.' },
    ],
  },
];

export const menuFilters = [
  { id: 'all', label: 'Todo' },
  { id: 'cafe', label: 'Café' },
  { id: 'filtrados', label: 'Filtrados' },
  { id: 'frios', label: 'Fríos' },
  { id: 'dulce', label: 'Dulce' },
  { id: 'salado', label: 'Salado' },
] as const;

export type Origin = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zoom: number;
  notes: string;
  altitude: string;
  process: string;
  roast: string;
  about: string;
};

export const origins: Origin[] = [
  {
    id: 'huila', name: 'Huila, Colombia', lat: 2.53, lng: -75.52, zoom: 7,
    notes: 'Caramelo, naranja, cacao', altitude: '1.750 m', process: 'Lavado', roast: 'Medio',
    about: 'Finca de Don Alirio Gómez. Es la base de nuestro espresso.',
  },
  {
    id: 'guji', name: 'Guji, Etiopía', lat: 5.85, lng: 38.98, zoom: 7,
    notes: 'Durazno, jazmín, té negro', altitude: '2.000 m', process: 'Natural', roast: 'Claro',
    about: 'Cooperativa de pequeños productores. Lo servimos en filtrados.',
  },
  {
    id: 'mogiana', name: 'Mogiana, Brasil', lat: -20.54, lng: -47.4, zoom: 7,
    notes: 'Avellana, chocolate, miel', altitude: '1.100 m', process: 'Natural', roast: 'Medio oscuro',
    about: 'Fazenda de familia en Minas Gerais. Ideal para cafés con leche.',
  },
];

export const HOME = { name: 'TerraCoffe, Honduras 4850', lat: -34.5875, lng: -58.4297 };

export const timeline = [
  { year: '2016', title: 'El garaje de Villa Crespo', text: 'Primeras tostadas de madrugada y seis clientes que recibían las bolsas en bici.' },
  { year: '2019', title: 'Se abre Honduras 4850', text: 'Una barra, ocho mesas y la máquina de espresso frente a la ventana.' },
  { year: '2023', title: 'Compra directa a productores', text: 'Dejamos los intermediarios y trabajamos con tres fincas que visitamos cada año.' },
];
