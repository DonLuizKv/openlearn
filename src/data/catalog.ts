import type { Instrument } from '../domain/models';

const aorn = { title: 'AORN · Identificación del instrumental', url: 'https://info.aorn.org/New-Member-Instrument-Resource.html' };
const scissors = { title: 'University of Saskatchewan · Scissors', url: 'https://wcvm.usask.ca/vsac205/Lab1/scissors.php' };
const cc0 = { license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' };

export const instruments: Instrument[] = [
  {
    id: 'mayo', name: 'Tijeras Mayo', aliases: ['Mayo scissors', 'tijera'], category: 'Corte',
    summary: 'Tijeras de construcción robusta. La variante curva se asocia al corte de tejidos resistentes.',
    recognition: ['Diseño robusto, con hojas relativamente anchas.', 'Dos anillas unidas por una articulación.', 'Existen variantes rectas y curvas.'],
    hint: 'Compara la robustez de las hojas con las tijeras Metzenbaum.',
    photo: { asset: require('../../assets/instruments/mayo.jpg'), author: 'Saltanat ebli', source: 'https://commons.wikimedia.org/wiki/File:Mayo_scissors.jpg', ...cc0 },
    sources: [aorn, scissors],
  },
  {
    id: 'metzenbaum', name: 'Tijeras Metzenbaum', aliases: ['Metz', 'Metzenbaum scissors', 'tijera'], category: 'Corte',
    summary: 'Tijeras de diseño fino, asociadas a la disección y al corte de tejidos delicados.',
    recognition: ['Ramas largas en relación con las hojas.', 'Diseño más fino que las tijeras Mayo.', 'Se presentan en distintas longitudes y curvaturas.'],
    hint: 'Observa la proporción entre la longitud de las ramas y las hojas.',
    photo: { asset: require('../../assets/instruments/metzenbaum.jpg'), author: 'Saltanat ebli', source: 'https://commons.wikimedia.org/wiki/File:Metzenbaum_scissors_04.jpg', ...cc0 },
    sources: [aorn, scissors],
  },
  {
    id: 'kocher', name: 'Pinza Kocher', aliases: ['Ochsner', 'Rochester Ochsner', 'forceps'], category: 'Hemostasia',
    summary: 'Pinza con cierre y dientes terminales, destinada a la sujeción firme de tejido resistente.',
    recognition: ['Anillas y un sistema de cierre o cremallera.', 'Mandíbulas con estrías.', 'Dientes en el extremo: observa el detalle de la fotografía.'],
    hint: 'Fíjate en los dientes terminales, además del cierre entre las anillas.',
    photo: { asset: require('../../assets/instruments/kocher.jpg'), author: 'Sarindam7', source: 'https://commons.wikimedia.org/wiki/File:Kocher%27s_forceps_with_toothed_jaw.jpg', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
    sources: [aorn, { title: 'Cruz Roja · Catálogo de pinzas Kocher', url: 'https://itemscatalogue.redcross.int/detail.aspx?from=kit&itemcode=XSINMEDI163543' }],
  },
  {
    id: 'mayo-hegar', name: 'Portaagujas Mayo-Hegar', aliases: ['needle holder', 'porta agujas', 'sutura'], category: 'Sutura',
    summary: 'Instrumento de cierre diseñado para sujetar la aguja de sutura.',
    recognition: ['Anillas y mecanismo de cierre.', 'Mandíbulas cortas respecto de las ramas.', 'No presenta las hojas de corte de unas tijeras.'],
    hint: 'Compara sus mandíbulas cortas con las hojas de las tijeras Mayo.',
    photo: { asset: require('../../assets/instruments/mayo-hegar.jpg'), author: 'Rschiedon', source: 'https://commons.wikimedia.org/wiki/File:Naaldvoerder_Mayo-hegar.jpg', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/' },
    sources: [aorn],
  },
];

export const categories = ['Todos', 'Corte', 'Hemostasia', 'Sutura'] as const;
export const findInstrument = (id?: string) => instruments.find(item => item.id === id);
