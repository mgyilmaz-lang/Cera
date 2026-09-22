import { useEffect, useMemo, useState } from 'react';
import { api } from '@appdeploy/client';

type Clay = { id: string; brand: string; code: string; name: string; forming: 'Vakum' | 'Döküm'; type: string; color: string; min: number; max: number; recommended: number | null; dryingShrinkage: number | null; firingShrinkage: number | null; totalShrinkage: number | null; absorption: number | null; plasticity: string; packageWeightKg: number; price: number; supplier: string; sourceUrl: string; checkedAt: string; confidence: 'Doğrulandı' | 'Kısmen doğrulandı' | 'Doğrulanmalı'; notes: string; source: string };
type Glaze = { code: string; name: string; brand: string; min: number; max: number; price: number; finish: string; coats: number; source: string; sourceUrl: string; confidence: 'Ürün serisi doğrulandı' | 'Renk/ürün bazında doğrulanmalı' };
type Kiln = { name: string; brand: string; volume: number; power: number; maxTemp: number; diameter: number; height: number; source: string };

const claySource = 'https://www.izoref.com/315-camurlar';
const clayCheckedAt = '19.09.2026';
const clays: Clay[] = [
  { id: 'wit-g11', brand: 'Witgert', code: 'G-11', name: 'Beyaz Stoneware Döküm Çamuru', forming: 'Döküm', type: 'Stoneware', color: 'Beyaz', min: 1000, max: 1300, recommended: null, dryingShrinkage: null, firingShrinkage: null, totalShrinkage: null, absorption: null, plasticity: 'Döküm çamuru', packageWeightKg: 10, price: 123.34, supplier: 'İzoref', sourceUrl: claySource, checkedAt: clayCheckedAt, confidence: 'Kısmen doğrulandı', notes: 'Güncel katalogda G-11 beyaz stoneware döküm çamuru 10 kg ve 1000–1300°C olarak listeleniyor.', source: 'İzoref / Witgert' },
  { id: 'wit-g10', brand: 'Witgert', code: 'G-10', name: 'Kırmızı Stoneware Döküm Çamuru', forming: 'Döküm', type: 'Stoneware', color: 'Kırmızı', min: 1000, max: 1240, recommended: null, dryingShrinkage: null, firingShrinkage: null, totalShrinkage: null, absorption: null, plasticity: 'Döküm çamuru', packageWeightKg: 10, price: 123.34, supplier: 'İzoref', sourceUrl: claySource, checkedAt: clayCheckedAt, confidence: 'Kısmen doğrulandı', notes: 'Güncel katalogda G-10 kırmızı stoneware döküm çamuru 10 kg olarak listeleniyor.', source: 'İzoref / Witgert' },
  { id: 'wit-g12', brand: 'Witgert', code: 'G-12', name: 'Siyah Döküm Çamuru', forming: 'Döküm', type: 'Stoneware', color: 'Siyah', min: 1000, max: 1150, recommended: null, dryingShrinkage: null, firingShrinkage: null, totalShrinkage: null, absorption: null, plasticity: 'Döküm çamuru', packageWeightKg: 10, price: 137.04, supplier: 'İzoref', sourceUrl: claySource, checkedAt: clayCheckedAt, confidence: 'Kısmen doğrulandı', notes: 'Güncel katalogda G-12 siyah döküm çamuru 10 kg ve 1000–1150°C olarak listeleniyor.', source: 'İzoref / Witgert' },
  { id: 'wit-g001', brand: 'Witgert', code: 'G-001', name: 'Mont Blanc Porselen Döküm Çamuru', forming: 'Döküm', type: 'Porselen', color: 'Beyaz', min: 1200, max: 1300, recommended: null, dryingShrinkage: null, firingShrinkage: null, totalShrinkage: null, absorption: null, plasticity: 'Porselen döküm', packageWeightKg: 10, price: 383.72, supplier: 'İzoref', sourceUrl: claySource, checkedAt: clayCheckedAt, confidence: 'Kısmen doğrulandı', notes: 'Güncel katalogda G-001 Mont Blanc porselen döküm çamuru 10 kg olarak listeleniyor.', source: 'İzoref / Witgert' },
  { id: 'wit-11-v', brand: 'Witgert', code: '11', name: 'Beyaz Şamotsuz Vakum Çamur', forming: 'Vakum', type: 'Stoneware / seramik', color: 'Beyaz', min: 1000, max: 1240, recommended: null, dryingShrinkage: null, firingShrinkage: null, totalShrinkage: null, absorption: null, plasticity: 'Torna / elle şekillendirme', packageWeightKg: 10, price: 89.08, supplier: 'İzoref', sourceUrl: claySource, checkedAt: clayCheckedAt, confidence: 'Kısmen doğrulandı', notes: 'Güncel katalogda Witgert 11 beyaz şamotsuz vakum çamur 10 kg olarak listeleniyor.', source: 'İzoref / Witgert' },
  { id: 'wit-w9-v', brand: 'Witgert', code: 'W 9', name: 'Extra Siyah Şamotsuz Vakum Çamur', forming: 'Vakum', type: 'Stoneware', color: 'Siyah', min: 1000, max: 1240, recommended: null, dryingShrinkage: null, firingShrinkage: null, totalShrinkage: null, absorption: null, plasticity: 'Torna / elle şekillendirme', packageWeightKg: 10, price: 137.04, supplier: 'İzoref', sourceUrl: claySource, checkedAt: clayCheckedAt, confidence: 'Kısmen doğrulandı', notes: 'Güncel katalogda W 9 extra siyah şamotsuz vakum çamur 10 kg olarak listeleniyor.', source: 'İzoref / Witgert' },
  { id: 'gs-33-v', brand: 'G&S', code: '33', name: 'Beyaz Seramik Vakum Çamuru', forming: 'Vakum', type: 'Seramik', color: 'Beyaz', min: 1040, max: 1180, recommended: null, dryingShrinkage: null, firingShrinkage: null, totalShrinkage: null, absorption: null, plasticity: 'Torna / elle şekillendirme', packageWeightKg: 10, price: 99.36, supplier: 'İzoref', sourceUrl: claySource, checkedAt: clayCheckedAt, confidence: 'Kısmen doğrulandı', notes: 'G&S 33 beyaz seramik vakum çamuru katalogda 10 kg olarak listeleniyor.', source: 'İzoref / Goerg & Schneider' },
  { id: 'gs-33-d', brand: 'G&S', code: '33', name: 'Beyaz Seramik Sıvı Döküm Çamuru', forming: 'Döküm', type: 'Seramik', color: 'Beyaz', min: 1040, max: 1180, recommended: null, dryingShrinkage: null, firingShrinkage: null, totalShrinkage: null, absorption: null, plasticity: 'Sıvı döküm', packageWeightKg: 10, price: 116.49, supplier: 'İzoref', sourceUrl: claySource, checkedAt: clayCheckedAt, confidence: 'Kısmen doğrulandı', notes: 'G&S 33 sıvı döküm çamuru katalogda beyaz ve 10 kg olarak listeleniyor.', source: 'İzoref / Goerg & Schneider' },
  { id: 'gs-208-v', brand: 'G&S', code: '208', name: 'Beyaz/Açık Krem Stoneware Vakum Çamuru', forming: 'Vakum', type: 'Stoneware', color: 'Beyaz / açık krem', min: 1000, max: 1240, recommended: null, dryingShrinkage: null, firingShrinkage: null, totalShrinkage: null, absorption: null, plasticity: 'Torna / elle şekillendirme', packageWeightKg: 10, price: 99.36, supplier: 'İzoref', sourceUrl: claySource, checkedAt: clayCheckedAt, confidence: 'Kısmen doğrulandı', notes: 'G&S 208 stoneware vakum çamuru katalogda beyaz/açık krem olarak listeleniyor.', source: 'İzoref / Goerg & Schneider' },
  { id: 'gs-208-d', brand: 'G&S', code: '208', name: 'Beyaz/Açık Krem Stoneware Sıvı Döküm Çamuru', forming: 'Döküm', type: 'Stoneware', color: 'Beyaz / açık krem', min: 1000, max: 1240, recommended: null, dryingShrinkage: null, firingShrinkage: null, totalShrinkage: null, absorption: null, plasticity: 'Sıvı döküm', packageWeightKg: 10, price: 123.34, supplier: 'İzoref', sourceUrl: claySource, checkedAt: clayCheckedAt, confidence: 'Kısmen doğrulandı', notes: 'G&S 208 stoneware sıvı döküm çamuru katalogda beyaz/açık krem ve 10 kg olarak listeleniyor.', source: 'İzoref / Goerg & Schneider' },
  { id: 'sio-pa-v', brand: 'Sio-2', code: 'PA Blanca', name: 'Beyaz Seramik Vakum Çamuru', forming: 'Vakum', type: 'Seramik', color: 'Beyaz', min: 1040, max: 1180, recommended: null, dryingShrinkage: null, firingShrinkage: null, totalShrinkage: null, absorption: null, plasticity: 'Torna / elle şekillendirme', packageWeightKg: 12.5, price: 54.82, supplier: 'İzoref', sourceUrl: claySource, checkedAt: clayCheckedAt, confidence: 'Kısmen doğrulandı', notes: 'Sio-2 PA Blanca beyaz seramik vakum çamuru katalogda 12,5 kg olarak listeleniyor.', source: 'İzoref / Sio-2' },
  { id: 'sio-praf-v', brand: 'Sio-2', code: 'PRAF', name: 'Beyaz Şamotlu Stoneware Vakum Çamuru', forming: 'Vakum', type: 'Stoneware', color: 'Beyaz', min: 1000, max: 1240, recommended: null, dryingShrinkage: null, firingShrinkage: null, totalShrinkage: null, absorption: null, plasticity: 'Torna / elle şekillendirme', packageWeightKg: 12.5, price: 93.19, supplier: 'İzoref', sourceUrl: claySource, checkedAt: clayCheckedAt, confidence: 'Kısmen doğrulandı', notes: 'Sio-2 PRAF beyaz şamotlu stoneware vakum çamuru katalogda 12,5 kg olarak listeleniyor.', source: 'İzoref / Sio-2' },
  { id: 'sio-prni-v', brand: 'Sio-2', code: 'PRNI Negra', name: 'Siyah Stoneware Vakum Çamuru', forming: 'Vakum', type: 'Stoneware', color: 'Siyah', min: 1000, max: 1240, recommended: null, dryingShrinkage: null, firingShrinkage: null, totalShrinkage: null, absorption: null, plasticity: 'Torna / elle şekillendirme', packageWeightKg: 12.5, price: 93.19, supplier: 'İzoref', sourceUrl: claySource, checkedAt: clayCheckedAt, confidence: 'Kısmen doğrulandı', notes: 'Sio-2 PRNI Negra siyah stoneware vakum çamuru katalogda 12,5 kg olarak listeleniyor.', source: 'İzoref / Sio-2' }
];
const glazes: Glaze[] = [
  { code:'MAYCO-SW', name:'Stoneware Classic / Matte / Crystal / Gloss', brand:'Mayco', min:1180, max:1305, price:0, finish:'Klasik, mat, kristal, parlak', coats:2, source:'Mayco resmi Stoneware kataloğu', sourceUrl:'https://www.maycocolors.com/color/fired/stoneware/', confidence:'Ürün serisi doğrulandı' },
  { code:'MAYCO-SC', name:'Stroke & Coat', brand:'Mayco', min:999, max:1305, price:0, finish:'Yoğun pigmentli parlak / dekoratif', coats:2, source:'Mayco resmi Stroke & Coat', sourceUrl:'https://www.maycocolors.com/color/fired/stroke-coat/', confidence:'Ürün serisi doğrulandı' },
  { code:'MAYCO-FND', name:'Foundations', brand:'Mayco', min:999, max:1100, price:0, finish:'Düşük derece opak / dekoratif', coats:2, source:'Mayco katalog arşivi', sourceUrl:'https://www.maycocolors.com/documents/', confidence:'Ürün serisi doğrulandı' },
  { code:'MAYCO-ELE', name:'Elements', brand:'Mayco', min:999, max:1305, price:0, finish:'Efekt / dekoratif', coats:2, source:'Mayco katalog arşivi', sourceUrl:'https://www.maycocolors.com/documents/', confidence:'Ürün serisi doğrulandı' },
  { code:'MAYCO-JG', name:'Jungle Gems', brand:'Mayco', min:999, max:1100, price:0, finish:'Kristal / efekt', coats:2, source:'Mayco katalog arşivi', sourceUrl:'https://www.maycocolors.com/documents/', confidence:'Ürün serisi doğrulandı' },
  { code:'MAYCO-RK', name:'Raku Glazes', brand:'Mayco', min:950, max:1050, price:0, finish:'Raku / efekt', coats:2, source:'Mayco katalog arşivi', sourceUrl:'https://www.maycocolors.com/documents/', confidence:'Ürün serisi doğrulandı' },
  { code:'MAYCO-AS', name:'Astro Gems', brand:'Mayco', min:999, max:1100, price:0, finish:'Kristal / dokulu efekt', coats:2, source:'Mayco katalog arşivi', sourceUrl:'https://www.maycocolors.com/documents/', confidence:'Ürün serisi doğrulandı' },
  { code:'AMACO-PC', name:"Potter's Choice", brand:'AMACO', min:1186, max:1222, price:0, finish:'Yüksek ateş, akışkan / katmanlanabilir', coats:3, source:'AMACO resmi kataloğu', sourceUrl:'https://shop.amaco.com/glazes-underglazes/high-fire-glazes/pc-potters-choice/', confidence:'Ürün serisi doğrulandı' },
  { code:'AMACO-PCF', name:"Potter's Choice Flux", brand:'AMACO', min:1186, max:1222, price:0, finish:'Flux / efekt / katmanlama', coats:3, source:'AMACO resmi kataloğu', sourceUrl:'https://amaco.com/asset/680a4a4db5d90', confidence:'Ürün serisi doğrulandı' },
  { code:'AMACO-C', name:'Celadon', brand:'AMACO', min:1186, max:1222, price:0, finish:'Parlak, yarı şeffaf', coats:3, source:'AMACO resmi Celadon', sourceUrl:'https://shop.amaco.com/glazes-underglazes/high-fire-glazes/c-celadon/', confidence:'Ürün serisi doğrulandı' },
  { code:'AMACO-COS', name:'Cosmos', brand:'AMACO', min:1186, max:1222, price:0, finish:'Efekt / kristal', coats:3, source:'AMACO resmi kataloğu', sourceUrl:'https://amaco.com/asset/680a4a4db5d90', confidence:'Ürün serisi doğrulandı' },
  { code:'AMACO-PH', name:'Phase', brand:'AMACO', min:1186, max:1222, price:0, finish:'Efekt / yüksek ateş', coats:3, source:'AMACO resmi kataloğu', sourceUrl:'https://amaco.com/asset/680a4a4db5d90', confidence:'Ürün serisi doğrulandı' },
  { code:'AMACO-SM', name:'Satin Matte', brand:'AMACO', min:1186, max:1222, price:0, finish:'Saten mat', coats:3, source:'AMACO resmi kataloğu', sourceUrl:'https://amaco.com/asset/680a4a4db5d90', confidence:'Ürün serisi doğrulandı' },
  { code:'AMACO-SH', name:'Shino', brand:'AMACO', min:1186, max:1222, price:0, finish:'Shino / yüksek ateş', coats:3, source:'AMACO resmi kataloğu', sourceUrl:'https://amaco.com/asset/680a4a4db5d90', confidence:'Ürün serisi doğrulandı' },
  { code:'AMACO-HI', name:'High Fire', brand:'AMACO', min:1186, max:1305, price:0, finish:'Yüksek ateş', coats:3, source:'AMACO resmi kataloğu', sourceUrl:'https://amaco.com/asset/680a4a4db5d90', confidence:'Ürün serisi doğrulandı' },
  { code:'AMACO-KI', name:'Kiln Ice', brand:'AMACO', min:1186, max:1222, price:0, finish:'Kristal / buz efekti', coats:3, source:'AMACO resmi kataloğu', sourceUrl:'https://amaco.com/asset/680a4a4db5d90', confidence:'Ürün serisi doğrulandı' },
  { code:'AMACO-CR', name:'Crawls', brand:'AMACO', min:1186, max:1222, price:0, finish:'Crackle / crawl efekt', coats:3, source:'AMACO resmi kataloğu', sourceUrl:'https://amaco.com/asset/680a4a4db5d90', confidence:'Ürün serisi doğrulandı' },
  { code:'BOTZ-IR', name:'Irdenware', brand:'BOTZ', min:1020, max:1100, price:0, finish:'Parlak, mat, efekt ve craquelé seçenekleri', coats:2, source:'BOTZ resmi ürün kataloğu', sourceUrl:'https://www.botz-glasuren.de/produktuebersicht', confidence:'Ürün serisi doğrulandı' },
  { code:'BOTZ-ST', name:'Stoneware', brand:'BOTZ', min:1220, max:1280, price:0, finish:'Stoneware / yüksek ateş', coats:2, source:'BOTZ resmi ürün kataloğu', sourceUrl:'https://www.botz-glasuren.de/produktuebersicht', confidence:'Ürün serisi doğrulandı' },
  { code:'BOTZ-ED', name:'Edition Stoneware Engobes', brand:'BOTZ', min:1180, max:1280, price:0, finish:'Stoneware engobe', coats:2, source:'BOTZ resmi ürün kataloğu', sourceUrl:'https://www.botz-glasuren.de/produktuebersicht', confidence:'Ürün serisi doğrulandı' },
  { code:'BOTZ-EN', name:'Engobes', brand:'BOTZ', min:900, max:1100, price:0, finish:'Engobe / dekor', coats:2, source:'BOTZ resmi ürün kataloğu', sourceUrl:'https://www.botz-glasuren.de/produktuebersicht', confidence:'Ürün serisi doğrulandı' },
  { code:'BOTZ-UNI', name:'Unidekor', brand:'BOTZ', min:1000, max:1250, price:0, finish:'Dekoratif renk', coats:2, source:'BOTZ resmi ürün kataloğu', sourceUrl:'https://www.botz-glasuren.de/produktuebersicht', confidence:'Ürün serisi doğrulandı' },
  { code:'BOTZ-PLUS', name:'BOTZ PLUS / SPS 9020', brand:'BOTZ', min:1050, max:1280, price:0, finish:'Akış / efekt artırıcı', coats:1, source:'BOTZ resmi ürün kataloğu', sourceUrl:'https://www.botz-glasuren.de/produktuebersicht', confidence:'Ürün serisi doğrulandı' },
  { code:'BOTZ-PRO', name:'BOTZ PRO', brand:'BOTZ', min:1020, max:1280, price:0, finish:'Geniş aralık, yarı şeffaf / pastel', coats:2, source:'BOTZ resmi ürün kataloğu', sourceUrl:'https://www.botz-glasuren.de/produktuebersicht', confidence:'Ürün serisi doğrulandı' },
  { code:'BOTZ-GL', name:'Glimmer', brand:'BOTZ', min:900, max:1060, price:0, finish:'Simli / ışıltılı efekt', coats:2, source:'BOTZ ürün kataloğu', sourceUrl:'https://www.botz-glasuren.de/produktuebersicht', confidence:'Ürün serisi doğrulandı' },
  { code:'CJ-1020', name:'1020–1080°C sırları', brand:'Carl Jäger', min:1020, max:1080, price:0, finish:'Parlak, mat, şeffaf ve renkli', coats:2, source:'Carl Jäger resmi mağaza', sourceUrl:'https://shop.carl-jaeger.de/gesamtes-sortiment/glasuren-und-farben/glasuren-1020-10800c/', confidence:'Ürün serisi doğrulandı' },
  { code:'CJ-1130', name:'1130–1170°C sırları', brand:'Carl Jäger', min:1130, max:1170, price:0, finish:'Parlak, saten ve renkli', coats:2, source:'Carl Jäger resmi mağaza', sourceUrl:'https://shop.carl-jaeger.de/gesamtes-sortiment/glasuren-und-farben/glasuren-1130-11700c/', confidence:'Ürün serisi doğrulandı' },
  { code:'CJ-1150', name:'1150–1200°C sırları', brand:'Carl Jäger', min:1150, max:1200, price:0, finish:'Orta derece / efekt', coats:2, source:'Carl Jäger resmi mağaza', sourceUrl:'https://shop.carl-jaeger.de/gesamtes-sortiment/', confidence:'Ürün serisi doğrulandı' },
  { code:'CJ-1200', name:'1200–1260°C sırları', brand:'Carl Jäger', min:1200, max:1260, price:0, finish:'Stoneware / porselen, parlak ve efekt', coats:2, source:'Carl Jäger resmi mağaza', sourceUrl:'https://shop.carl-jaeger.de/gesamtes-sortiment/glasuren-und-farben/glasuren-1200-12600c/', confidence:'Ürün serisi doğrulandı' },
  { code:'CJ-RAKU', name:'Raku Glasuren', brand:'Carl Jäger', min:950, max:1050, price:0, finish:'Raku / efekt', coats:2, source:'Carl Jäger resmi mağaza', sourceUrl:'https://shop.carl-jaeger.de/gesamtes-sortiment/', confidence:'Ürün serisi doğrulandı' },
  { code:'CJ-POR', name:'Porzellan Glasuren', brand:'Carl Jäger', min:1200, max:1260, price:0, finish:'Porselen sırları', coats:2, source:'Carl Jäger resmi mağaza', sourceUrl:'https://shop.carl-jaeger.de/gesamtes-sortiment/', confidence:'Ürün serisi doğrulandı' },
  { code:'CJ-ENG', name:'Engoben', brand:'Carl Jäger', min:1020, max:1260, price:0, finish:'Töpferengobe / Sinterengobe', coats:2, source:'Carl Jäger resmi mağaza', sourceUrl:'https://shop.carl-jaeger.de/gesamtes-sortiment/', confidence:'Ürün serisi doğrulandı' },
  { code:'CLAY-CLR', name:'Şeffaf Parlak', brand:'CLAY', min:1200, max:1280, price:420, finish:'Parlak / şeffaf', coats:2, source:'CLAY / sırlar', sourceUrl:'https://www.clay.tr/sirlar/', confidence:'Renk/ürün bazında doğrulanmalı' },
  { code:'CLAY-MAT', name:'Opak Mat', brand:'CLAY', min:1200, max:1280, price:460, finish:'Mat / opak', coats:2, source:'CLAY / sırlar', sourceUrl:'https://www.clay.tr/sirlar/', confidence:'Renk/ürün bazında doğrulanmalı' }
];

const kilns: Kiln[] = [
  { name: 'Ecotop 20 S', brand: 'ROHDE', volume: 20, power: 2.3, maxTemp: 1290, diameter: 330, height: 225, source: 'ROHDE' },
  { name: 'Ecotop 43', brand: 'ROHDE', volume: 43, power: 2.9, maxTemp: 1260, diameter: 400, height: 340, source: 'ROHDE' },
  { name: 'Ecotop 43 S', brand: 'ROHDE', volume: 43, power: 3.6, maxTemp: 1290, diameter: 400, height: 340, source: 'ROHDE' },
  { name: 'Ecotop 60', brand: 'ROHDE', volume: 60, power: 3.6, maxTemp: 1260, diameter: 400, height: 455, source: 'ROHDE' },
  { name: 'Ecotop 60 S', brand: 'ROHDE', volume: 60, power: 5, maxTemp: 1290, diameter: 400, height: 455, source: 'ROHDE' },
  { name: 'Ecotop 80 S', brand: 'ROHDE', volume: 80, power: 6, maxTemp: 1290, diameter: 470, height: 455, source: 'ROHDE' },
  { name: 'Ecotop 95 S', brand: 'ROHDE', volume: 95, power: 7.3, maxTemp: 1290, diameter: 520, height: 455, source: 'ROHDE' },
  { name: 'Ecotop 145 S', brand: 'ROHDE', volume: 145, power: 8.8, maxTemp: 1290, diameter: 520, height: 680, source: 'ROHDE' }
];

const money = (n: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(n);
const tempRange = (a: number, b: number) => a + '–' + b + '°C';

function App() {
  const [tab, setTab] = useState('camur');
  const [liteMode, setLiteMode] = useState(true);
  const [claySearch, setClaySearch] = useState('');
  const [clayTypeFilter, setClayTypeFilter] = useState('Tümü');
  const [clayBrandFilter, setClayBrandFilter] = useState('Tümü');
  const [clayFormingFilter, setClayFormingFilter] = useState('Tümü');
  const [clayDetailId, setClayDetailId] = useState(clays[0].id);
  const [glazeIndex, setGlazeIndex] = useState(0);
  const [kilnIndex, setKilnIndex] = useState(3);
  type ProductSpec = { id: number; name: string; clayIndex: number; shape: 'Silindir' | 'Kase / Kupa' | 'Dikdörtgen'; height: number; width: number; diameter: number; wallThickness: number; pieces: number; bodyType: string };
  const makeProduct = (id: number, source?: ProductSpec): ProductSpec => ({ id, name: 'Ürün ' + id, clayIndex: source?.clayIndex ?? 0, shape: source?.shape ?? 'Silindir', height: source?.height ?? 100, width: source?.width ?? 80, diameter: source?.diameter ?? 80, wallThickness: source?.wallThickness ?? 4, pieces: source?.pieces ?? 12, bodyType: source?.bodyType ?? 'Stoneware' });
  const [products, setProducts] = useState<ProductSpec[]>([makeProduct(1)]);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const activeProduct = products[activeProductIndex] || products[0];
  const updateProduct = (patch: Partial<ProductSpec>) => setProducts(prev => prev.map((p,i) => i === activeProductIndex ? { ...p, ...patch } : p));
  const clayWeight = 750;
  const clayIndex = activeProduct.clayIndex;
  const setClayIndex = (n: number) => updateProduct({ clayIndex: n });
  const pieces = activeProduct.pieces;
  const setPieces = (n: number) => updateProduct({ pieces: n });
  const shape = activeProduct.shape;
  const setShape = (n: 'Silindir' | 'Kase / Kupa' | 'Dikdörtgen') => updateProduct({ shape: n });
  const height = activeProduct.height;
  const setHeight = (n: number) => updateProduct({ height: n });
  const width = activeProduct.width;
  const setWidth = (n: number) => updateProduct({ width: n });
  const diameter = activeProduct.diameter;
  const setDiameter = (n: number) => updateProduct({ diameter: n });
  const wallThickness = activeProduct.wallThickness;
  const setWallThickness = (n: number) => updateProduct({ wallThickness: n });
  const bodyType = activeProduct.bodyType;
  const setBodyType = (n: string) => updateProduct({ bodyType: n });
  const addProduct = () => {
    if (products.length >= 3) return;
    const next = makeProduct(products.length + 1, products[activeProductIndex]);
    setProducts(prev => [...prev, next]);
    setActiveProductIndex(products.length);
  };
  const [glazeAmount, setGlazeAmount] = useState(180);
  const [electric, setElectric] = useState(4.5);
  const [hours, setHours] = useState(8);
  const [fill, setFill] = useState(80);
  const [fireCount, setFireCount] = useState(1);
  const [firingTemp, setFiringTemp] = useState(1220);
  const [surface, setSurface] = useState(0.12);
  const [applicationRate, setApplicationRate] = useState(60);
  const [shelfSize, setShelfSize] = useState(400);
  const [shelfGap, setShelfGap] = useState(90);
  const [coatCount, setCoatCount] = useState(2);
  const [waste, setWaste] = useState(8);
  const [salePrice, setSalePrice] = useState(450);
  const [packaging, setPackaging] = useState(18);
  const [commission, setCommission] = useState(0);
  const [stockClay, setStockClay] = useState(10000);
  const [stockGlaze, setStockGlaze] = useState(2000);
  const [logs, setLogs] = useState<{date:string; kiln:string; temp:number; hours:number; pieces:number; cost:number; note:string}[]>([]);
  const [sourceStatus, setSourceStatus] = useState('Kaynaklar hazır');
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantOutput, setAssistantOutput] = useState('');
  const [busy, setBusy] = useState(false);
  const [photoOutput, setPhotoOutput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('seramik-os-state');
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.logs) setLogs(s.logs);
        if (s.stockClay) setStockClay(s.stockClay);
        if (s.stockGlaze) setStockGlaze(s.stockGlaze);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('seramik-os-state', JSON.stringify({ logs, stockClay, stockGlaze }));
  }, [logs, stockClay, stockGlaze]);

  const clay = clays[clayIndex];
  const filteredClays = useMemo(() => clays.filter(x => {
    const q = claySearch.trim().toLocaleLowerCase('tr-TR');
    const matchesSearch = !q || [x.brand, x.code, x.name, x.type, x.color].join(' ').toLocaleLowerCase('tr-TR').includes(q);
    const matchesType = clayTypeFilter === 'Tümü' || x.type.includes(clayTypeFilter);
    const matchesBrand = clayBrandFilter === 'Tümü' || x.brand === clayBrandFilter;
    const matchesForming = clayFormingFilter === 'Tümü' || x.forming === clayFormingFilter;
    return matchesSearch && matchesType && matchesBrand && matchesForming;
  }), [claySearch, clayTypeFilter, clayBrandFilter, clayFormingFilter]);
  const selectedClayDetail = clays.find(x => x.id === clayDetailId) || clay;
  const selectClayFromDatabase = (id: string) => {
    const idx = clays.findIndex(x => x.id === id);
    if (idx >= 0) { setClayIndex(idx); setClayDetailId(id); setTab('camur'); }
  };
  const glaze = glazes[glazeIndex];
  const kiln = kilns[kilnIndex];

  const clayEstimate = useMemo(() => {
    const t = Math.max(1, wallThickness);
    let volumeCm3 = 0;
    if (shape === 'Silindir') {
      const r = Math.max(1, diameter / 2);
      const ri = Math.max(0, r - t);
      const h = Math.max(1, height);
      volumeCm3 = Math.PI * (r * r - ri * ri) * h;
    } else if (shape === 'Kase / Kupa') {
      const r = Math.max(1, diameter / 2);
      const ri = Math.max(0, r - t);
      const h = Math.max(1, height);
      volumeCm3 = Math.PI * (r * r - ri * ri) * h * 0.72;
    } else {
      const w = Math.max(1, width);
      const d = Math.max(1, diameter);
      const h = Math.max(1, height);
      const wi = Math.max(0, w - 2 * t);
      const di = Math.max(0, d - 2 * t);
      const hi = Math.max(0, h - t);
      volumeCm3 = Math.max(0, w * d * h - wi * di * hi);
    }
    const density = bodyType.toLocaleLowerCase('tr-TR').includes('porselen') ? 2.45 : bodyType.toLocaleLowerCase('tr-TR').includes('seramik') ? 2.05 : 2.20;
    const theoretical = volumeCm3 * density;
    const working = theoretical * 1.18;
    return { volumeCm3, theoretical, working, total: working * pieces };
  }, [shape, height, width, diameter, wallThickness, bodyType, pieces]);

  const compatibility = useMemo(() => {
    const low = Math.max(clay.min, glaze.min);
    const high = Math.min(clay.max, glaze.max, kiln.maxTemp);
    const ok = low <= high;
    const target = ok ? Math.round((low + high) / 2 / 5) * 5 : 0;
    return { low, high, ok, target };
  }, [clay, glaze, kiln]);

  const glazeSurface = useMemo(() => {
    const h = Math.max(1, height) / 1000;
    const w = Math.max(1, width) / 1000;
    const d = Math.max(1, diameter) / 1000;
    const t = Math.max(1, wallThickness) / 1000;
    const innerD = Math.max(0.001, d - 2 * t);
    const innerW = Math.max(0.001, w - 2 * t);
    const innerH = Math.max(0.001, h - t);
    let area = 0;
    if (shape === 'Silindir') {
      const outerSide = Math.PI * d * h;
      const innerSide = Math.PI * innerD * innerH;
      const bottom = Math.PI * (d * d - innerD * innerD) / 4 + Math.PI * innerD * innerD / 4;
      const rim = Math.PI * (d + innerD) * t;
      area = outerSide + innerSide + bottom + rim;
    } else if (shape === 'Kase / Kupa') {
      area = (Math.PI * d * h + Math.PI * innerD * innerH + Math.PI * d * d / 4) * 0.82;
    } else {
      const outerSide = 2 * (w + d) * h;
      const innerSide = 2 * (innerW + innerD) * innerH;
      const topBottom = 2 * w * d;
      area = (outerSide + innerSide + topBottom) * 0.72;
    }
    return Math.max(0.001, area);
  }, [shape, height, width, diameter, wallThickness]);

  const glazeCalc = useMemo(() => {
    const grams = Math.max(0, glazeSurface * applicationRate * coatCount * (1 + waste / 100) * pieces);
    const cost = grams / 1000 * glaze.price;
    return { grams, cost, perPiece: grams / Math.max(pieces, 1) };
  }, [glazeSurface, applicationRate, coatCount, waste, pieces, glaze]);

  const costs = useMemo(() => {
    const effectiveClayWeight = clayEstimate.working > 0 ? clayEstimate.working : clayWeight;
    const clayCost = effectiveClayWeight * pieces / 1000 * clay.price;
    const electricity = kiln.power * hours * electric * (0.35 + fill / 150) * fireCount;
    const total = clayCost + electricity + packaging * pieces;
    const unit = total / Math.max(pieces, 1);
    const netSale = salePrice * pieces * (1 - commission / 100);
    return { clayCost, electricity, total, unit, netSale, profit: netSale - total, margin: netSale ? (netSale - total) / netSale * 100 : 0 };
  }, [clayWeight, clayEstimate, clay, kiln, hours, electric, fill, fireCount, packaging, pieces, salePrice, commission]);

  const productLoadPlans = useMemo(() => products.map(p => {
    const productDiameter = Math.max(20, p.diameter);
    const usable = Math.max(20, shelfSize);
    const across = Math.max(1, Math.floor(usable / productDiameter));
    const perShelf = across * across;
    const levelHeight = Math.max(20, p.height) + Math.max(0, shelfGap);
    const shelfLevels = Math.max(1, Math.floor((kiln.height + Math.max(0, shelfGap)) / levelHeight));
    const capacity = perShelf * shelfLevels;
    const requiredLevels = Math.max(1, Math.ceil(p.pieces / perShelf));
    return { id: p.id, name: p.name, pieces: p.pieces, diameter: p.diameter, height: p.height, perShelf, shelfLevels, capacity, requiredLevels };
  }), [products, shelfSize, shelfGap, kiln.height]);

  const shelfCapacity = useMemo(() => {
    const plan = productLoadPlans[activeProductIndex];
    return plan?.perShelf ?? 0;
  }, [productLoadPlans, activeProductIndex]);
  const loadCombinations = useMemo(() => {
    type Placement = { productId:number; productName:string; x:number; y:number; w:number; h:number; rotated:boolean; };
    type ShelfPlan = { level:number; heightUsed:number; placements:Placement[]; utilization:number; };
    const gap = 8;
    const shelfW = Math.max(100, shelfSize);
    const maxItemsPerProduct = 24;
    const items = products.flatMap(p => Array.from({length: Math.min(p.pieces, maxItemsPerProduct)}, (_,i) => ({
      productId:p.id,
      productName:p.name + ' #' + (i+1),
      w:Math.max(20,p.width || p.diameter),
      h:Math.max(20,p.diameter || p.width),
      vertical:Math.max(20,p.height)
    })));
    const variants = [
      {name:'Standart', rotate:true, sort:'area'},
      {name:'Geniş ürün öncelikli', rotate:true, sort:'width'},
      {name:'Yüksek ürün öncelikli', rotate:true, sort:'height'},
      {name:'Döndürme kapalı', rotate:false, sort:'area'}
    ] as const;

    const pack = (variant: typeof variants[number]) => {
      const source=[...items].sort((a,b)=>{
        if(variant.sort==='width') return Math.max(b.w,b.h)-Math.max(a.w,a.h);
        if(variant.sort==='height') return b.vertical-a.vertical;
        return (b.w*b.h)-(a.w*a.h);
      });
      const shelves:ShelfPlan[]=[];
      for(const item of source){
        const options=variant.rotate && item.w!==item.h
          ? [{w:item.w,h:item.h,rotated:false},{w:item.h,h:item.w,rotated:true}]
          : [{w:item.w,h:item.h,rotated:false}];
        let best:{shelf:ShelfPlan; placement:Placement; score:number}|null=null;
        for(const shelf of shelves){
          if(shelf.heightUsed < item.vertical) continue;
          for(const o of options){
            for(let y=gap;y+o.h<=shelfW;y+=gap){
              for(let x=gap;x+o.w<=shelfW;x+=gap){
                const collision=shelf.placements.some(p=>x<p.x+p.w+gap && x+o.w+gap>p.x && y<p.y+p.h+gap && y+o.h+gap>p.y);
                if(collision) continue;
                const score=(shelf.placements.length*100000) - (shelfW*shelfW-(o.w*o.h)) + (shelfW-(x+o.w)) + (shelfW-(y+o.h));
                if(!best || score>best.score) best={shelf,placement:{productId:item.productId,productName:item.productName,x,y,w:o.w,h:o.h,rotated:o.rotated},score};
              }
            }
          }
        }
        if(best) {
          best.shelf.placements.push(best.placement);
          continue;
        }
        const currentHeight = shelves.reduce((m,s)=>Math.max(m,s.heightUsed),0);
        if(currentHeight + item.vertical + gap > kiln.height) continue;
        const newShelf:ShelfPlan={level:shelves.length+1,heightUsed:item.vertical,placements:[],utilization:0};
        for(const o of options){
          if(o.w+gap<=shelfW && o.h+gap<=shelfW){
            newShelf.placements.push({productId:item.productId,productName:item.productName,x:gap,y:gap,w:o.w,h:o.h,rotated:o.rotated});
            break;
          }
        }
        if(newShelf.placements.length) shelves.push(newShelf);
      }
      shelves.forEach(shelf=>{
        const area=shelf.placements.reduce((sum,p)=>sum+p.w*p.h,0);
        shelf.utilization=Math.round(area/(shelfW*shelfW)*100);
      });
      const placedCount=shelves.reduce((n,s)=>n+s.placements.length,0);
      const usedArea=shelves.reduce((n,s)=>n+s.placements.reduce((a,p)=>a+p.w*p.h,0),0);
      const totalShelfArea=Math.max(1,shelves.length*shelfW*shelfW);
      return {name:variant.name,shelves,placedCount,unplaced:items.length-placedCount,utilization:Math.round(usedArea/totalShelfArea*100),totalLevels:shelves.length};
    };
    return variants.map(pack).sort((a,b)=>a.unplaced-b.unplaced || b.utilization-a.utilization);
  }, [products, shelfSize, kiln.height]);

  async function refreshSources() {
    setBusy(true);
    try {
      const r = await api.get('/api/web-data');
      setSourceStatus((r.data?.sources?.length || 0) + ' web kaynağı kontrol edildi • ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    } catch {
      setSourceStatus('Kaynak kontrolü başarısız, mevcut katalog korunuyor');
    } finally { setBusy(false); }
  }

  async function askAssistant() {
    if (!assistantInput.trim()) return;
    setBusy(true);
    try {
      const r = await api.post('/api/assistant', { question: assistantInput, context: { clay: clay.name, glaze: glaze.name, kiln: kiln.name, temp: firingTemp, pieces, costs } });
      setAssistantOutput(r.data?.answer || 'Yanıt alınamadı.');
    } catch { setAssistantOutput('AI yardımcı şu anda yanıt veremedi. Teknik aralıkları ve test plakası gerekliliğini ayrıca kontrol edin.'); }
    finally { setBusy(false); }
  }

  async function analyzePhoto(file: File) {
    setBusy(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const r = await api.post('/api/analyze-photo', { image: base64, mimeType: file.type || 'image/jpeg' });
      setPhotoOutput(r.data?.analysis || 'Fotoğraftan güvenilir ölçüm çıkarılamadı.');
    } catch { setPhotoOutput('Fotoğraf analizi başarısız. Ürün ölçülerini elle girerek hesaplamaya devam edebilirsiniz.'); }
    finally { setBusy(false); }
  }

  function addLog() {
    setLogs([{ date: new Date().toLocaleString('tr-TR'), kiln: kiln.brand + ' ' + kiln.name, temp: firingTemp, hours, pieces, cost: costs.electricity, note: 'Üretim kaydı' }, ...logs]);
  }

  const Field = ({ label, value, set, suffix }: {label:string; value:number; set:(n:number)=>void; suffix:string}) =>
    <label className="field"><span>{label}</span><div><input type="number" min="0" value={value} onChange={e => set(Number(e.target.value))}/><b>{suffix}</b></div></label>;

  return <main>
    <header><div className="logo">◈</div><div className="brandBlock"><div className="eyebrow">SERAMİK OS · ÜRETİM MERKEZİ</div><h1>Çamur • Sır • Fırın • Maliyet</h1><p>{liteMode ? 'Gerekli bilgileri gir, sonucu hemen al.' : 'Atölyenin üretim, maliyet ve pişirim kararlarını tek yerde yönet.'}</p></div><div className="modeSwitch"><button className={liteMode?'active':''} onClick={() => setLiteMode(true)}>LITE</button><button className={!liteMode?'active':''} onClick={() => setLiteMode(false)}>PRO</button></div></header><div className="toolbar"><span>● {sourceStatus}</span>{!liteMode && <button onClick={refreshSources}>{busy ? 'Çalışıyor…' : 'Web kaynaklarını güncelle'}</button>}</div><nav className="tabs">{(liteMode ? [['camur','🧱 Çamur'],['hesap','💰 Maliyet'],['yukleme','🔥 Fırın'],['sir','🎨 Sır']] : [['camur','🧱 Çamur'],['camurdb','📚 Çamur Veritabanı'],['hesap','💰 Maliyet'],['uyum','🔗 Uyumluluk'],['yukleme','🔥 Fırın'],['sir','🎨 Sır'],['kar','💰 Kâr'],['stok','📦 Stok & Kayıt'],['ai','🤖 AI Asistan']]).map(([id,label]) => <button className={tab===id?'active':''} onClick={() => setTab(id)} key={id}>{label}</button>)}</nav>

    {tab === 'camurdb' && <section className="panel wide clayDb"><div className="dbHead"><div><span className="eyebrow">MALZEME KÜTÜPHANESİ · 01</span><h2>Çamur Veritabanı</h2><p>Aranabilir katalog. Kaynağı doğrulanmamış teknik değerleri özellikle boş bırakıyoruz, böylece hesaplayıcı uydurma veriyle çalışmıyor.</p></div><div className="dbCount">{filteredClays.length} / {clays.length}</div></div><div className="dbFilters"><input value={claySearch} onChange={e => setClaySearch(e.target.value)} placeholder="Marka, kod veya çamur ara…"/><select value={clayBrandFilter} onChange={e => setClayBrandFilter(e.target.value)}><option>Tümü</option><option>Witgert</option><option>G&S</option><option>Sio-2</option><option>CLAY</option></select><select value={clayFormingFilter} onChange={e => setClayFormingFilter(e.target.value)}><option>Tümü</option><option>Vakum</option><option>Döküm</option></select><select value={clayTypeFilter} onChange={e => setClayTypeFilter(e.target.value)}><option>Tümü</option><option>Seramik</option><option>Stoneware</option><option>Porselen</option></select></div><div className="clayDbGrid"><div className="clayList">{filteredClays.map(x => <button key={x.id} className={selectedClayDetail.id===x.id?'clayRow selected':'clayRow'} onClick={() => setClayDetailId(x.id)}><span><b>{x.code}</b> · {x.name}</span><small>{x.brand} · {x.forming} · {x.type} · {x.color}</small><em>{x.price.toFixed(2)} TL/kg</em></button>)}</div><div className="clayDetail"><div className="detailTop"><div><span className="eyebrow">{selectedClayDetail.brand} · {selectedClayDetail.code}</span><h2>{selectedClayDetail.name}</h2></div><span className={'confidence ' + selectedClayDetail.confidence.replace(/ /g, '-').toLocaleLowerCase('tr-TR')}>{selectedClayDetail.confidence}</span></div><div className="specGrid"><div><small>Form</small><b>{selectedClayDetail.forming}</b></div><div><small>Tip</small><b>{selectedClayDetail.type}</b></div><div><small>Renk</small><b>{selectedClayDetail.color}</b></div><div><small>Pişirim aralığı</small><b>{selectedClayDetail.min}–{selectedClayDetail.max}°C</b></div><div><small>Önerilen</small><b>{selectedClayDetail.recommended ? selectedClayDetail.recommended + '°C' : 'Doğrulanmalı'}</b></div><div><small>Kuruma çekmesi</small><b>{selectedClayDetail.dryingShrinkage == null ? 'Doğrulanmalı' : selectedClayDetail.dryingShrinkage + '%'}</b></div><div><small>Pişme çekmesi</small><b>{selectedClayDetail.firingShrinkage == null ? 'Doğrulanmalı' : selectedClayDetail.firingShrinkage + '%'}</b></div><div><small>Toplam çekme</small><b>{selectedClayDetail.totalShrinkage == null ? 'Doğrulanmalı' : selectedClayDetail.totalShrinkage + '%'}</b></div><div><small>Su emme</small><b>{selectedClayDetail.absorption == null ? 'Doğrulanmalı' : selectedClayDetail.absorption + '%'}</b></div><div><small>Plastiklik</small><b>{selectedClayDetail.plasticity}</b></div><div><small>Paket</small><b>{selectedClayDetail.packageWeightKg} kg</b></div><div><small>Fiyat</small><b>{selectedClayDetail.price.toFixed(2)} TL/kg</b></div><div><small>Tedarikçi</small><b>{selectedClayDetail.supplier}</b></div></div><p className="detailNote">{selectedClayDetail.notes}</p><div className="detailActions"><a href={selectedClayDetail.sourceUrl} target="_blank" rel="noreferrer">Kaynak sayfasını aç ↗</a><button className="primary" onClick={() => selectClayFromDatabase(selectedClayDetail.id)}>Bu çamuru hesaplayıcıda kullan</button></div><small className="checked">Kaynak kontrolü: {selectedClayDetail.checkedAt} · Teknik veri güveni: {selectedClayDetail.confidence}</small></div></div></section>}

    {tab === 'camur' && <section className="grid clayCalc">
      <div className="panel">
        <h2>Çamur Hesaplama</h2>
        <p className="muted">Ürün geometrisini gir. Sistem yaklaşık yaş çamur ihtiyacını ve çamur maliyetini hesaplasın.</p>
        <div className="claySectionTitle">Çamur Seçimi</div><div className="selectionRow"><select value={clayIndex} onChange={e => { const i = Number(e.target.value); setClayIndex(i); setClayDetailId(clays[i].id); }}>{clays.map((x,i)=><option key={x.id} value={i}>{x.brand} · {x.code} · {x.name}</option>)}</select><button onClick={() => setTab('hesap')}>Maliyete Aktar →</button></div>
        <div className="meta">Seçili çamur: <b>{clay.name}</b> · {clay.price.toFixed(2)} TL/kg</div>
        <div className="meta claySourceLine">Pişirim: <b>{tempRange(clay.min,clay.max)}</b> · {clay.color} · {clay.price.toFixed(2)} TL/kg · <button className="inlineLink" onClick={() => setTab('camurdb')}>Veritabanında aç</button></div>
        {!liteMode && <div className="meta">Çamur: <b>{tempRange(clay.min,clay.max)}</b> · {clay.price.toFixed(2)} TL/kg · {clay.confidence.toLocaleUpperCase('tr-TR')} · kaynak: {clay.source}</div>}




        <div className="productTabs"><div className="productTabButtons">{products.map((p,i) => <button key={p.id} className={activeProductIndex===i?'active':''} onClick={() => setActiveProductIndex(i)}>{p.name}</button>)}{products.length < 3 && <button className="addProduct" onClick={addProduct}>＋ Ürün {products.length + 1}</button>}</div><div className="productHint">Her ürünün ölçüsü, çamuru ve adedi ayrı tutulur. Diğer sekmeler seçili ürünü otomatik kullanır.</div></div>
        <h2>Ürün ölçüsü</h2>
        <div className="fields"><label className="field"><span>Ürün şekli</span><select value={shape} onChange={e => setShape(e.target.value as typeof shape)}><option>Silindir</option><option>Kase / Kupa</option><option>Dikdörtgen</option></select></label><label className="field"><span>Çamur cinsi</span><select value={bodyType} onChange={e => setBodyType(e.target.value)}><option>Seramik</option><option>Stoneware</option><option>Porselen</option></select></label><Field label="Yükseklik" value={height} set={setHeight} suffix="mm"/><Field label="Genişlik" value={width} set={setWidth} suffix="mm"/><Field label="Çap" value={diameter} set={setDiameter} suffix="mm"/><Field label="Et kalınlığı" value={wallThickness} set={setWallThickness} suffix="mm"/><Field label="Ürün adedi" value={pieces} set={setPieces} suffix="adet"/></div>
        <div className="okBox">Tahmini çamur: <b>{Math.round(clayEstimate.working)} g / ürün</b> · parti: <b>{Math.round(clayEstimate.total)} g</b>. Hesapta %18 şekillendirme/fire payı bulunur.</div>
        {!liteMode && <div className="cards"><div><span>Teorik çamur</span><strong>{Math.round(clayEstimate.theoretical)} g</strong></div><div><span>Çalışma paylı</span><strong>{Math.round(clayEstimate.working)} g</strong></div><div><span>Parti</span><strong>{Math.round(clayEstimate.total)} g</strong></div></div>}
        <p className="note">Yaklaşık sonuçtur. Kulp, ayak ve özel detaylar ayrıca çamur/sır miktarını değiştirebilir.</p>
      </div>
      <aside className="result"><span className="eyebrow">TAHMİNİ SONUÇ</span><div className="heroValue">{money(costs.unit)}</div><div className="muted">ürün başı toplam maliyet</div>
        <div className="cards"><div><span>Çamur · {Math.round(clayEstimate.working)} g/ürün</span><strong>{money(costs.clayCost)}</strong></div><div><span>Elektrik</span><strong>{money(costs.electricity)}</strong></div></div>
        <div className="price"><span>Parti maliyeti</span><strong>{money(costs.total)}</strong></div>

        <p className="note">Elektrik tüketimi tahmindir. Gerçek kWh, fırın programı, izolasyon, ortam ve yükleme biçimine göre değişir. Üretici teknik verisi ve test plakası esas alınmalıdır.</p>
      </aside>
    </section>}

    {tab === 'hesap' && <section className="grid">
      <div className="panel">
        <h2>Maliyet Hesaplama</h2><div className="productTabs compact"><div className="productTabButtons">{products.map((p,i) => <button key={p.id} className={activeProductIndex===i?'active':''} onClick={() => setActiveProductIndex(i)}>{p.name}</button>)}</div><div className="productHint">Maliyet hesabı seçili ürünün ölçüleri ve çamuruyla çalışır.</div></div>
        <div className="costSelectors"><label className="field"><span>Çamur</span><select value={clayIndex} onChange={e => setClayIndex(Number(e.target.value))}>{clays.map((x,i)=><option key={x.id} value={i}>{x.code} · {x.name}</option>)}</select></label><label className="field"><span>Fırın</span><select value={kilnIndex} onChange={e => setKilnIndex(Number(e.target.value))}>{kilns.map((x,i)=><option key={x.name} value={i}>{x.brand} {x.name}</option>)}</select></label></div>
        <div className="meta">Çamur: {clay.name} · Fırın: {kiln.name}</div>
        <h2>Üretim</h2>
        <div className="fields"><Field label="Ürün adedi" value={pieces} set={setPieces} suffix="adet"/><Field label="Fırın doluluğu" value={fill} set={setFill} suffix="%"/></div>
        <h2>Pişirim</h2>
        <div className="fields"><Field label="Süre" value={hours} set={setHours} suffix="saat"/><Field label="Elektrik" value={electric} set={setElectric} suffix="₺/kWh"/><Field label="Pişirim" value={fireCount} set={setFireCount} suffix="kez"/><Field label="Sıcaklık" value={firingTemp} set={setFiringTemp} suffix="°C"/></div>
        <div className="infoBox">ⓘ Sır maliyeti bu hesaplamaya dahil değildir. Sır tüketimi ve sır maliyetini <b>Sır Tüketimi</b> sekmesinde ayrıca hesaplayabilirsiniz.</div>
      </div>
      <aside className="result costResult"><span className="eyebrow">TAHMİNİ SONUÇ</span><div className="heroValue">{money(costs.unit)}</div><div className="muted">ürün başı çamur + pişirim maliyeti</div><div className="cards"><div><span>Çamur</span><strong>{money(costs.clayCost)}</strong></div><div><span>Elektrik</span><strong>{money(costs.electricity)}</strong></div></div><div className="price"><span>Parti maliyeti</span><strong>{money(costs.total)}</strong></div><p className="note">Ambalaj maliyeti varsa parti hesabına ayrıca eklenir. Sır maliyeti ayrı modülde hesaplanır.</p></aside>
    </section>}

    {tab === 'uyum' && <section className="panel wide"><div className="productTabs compact"><div className="productTabButtons">{products.map((p,i) => <button key={p.id} className={activeProductIndex===i?'active':''} onClick={() => setActiveProductIndex(i)}>{p.name}</button>)}</div></div><h2>Akıllı Çamur + Sır + Fırın Uyumluluğu</h2><div className={compatibility.ok?'bigOk':'bigWarn'}>{compatibility.ok?'UYUMLU ARALIK':'UYUMSUZ ARALIK'}</div><div className="compatGrid"><div><small>Çamur</small><b>{tempRange(clay.min,clay.max)}</b></div><div><small>Sır</small><b>{tempRange(glaze.min,glaze.max)}</b></div><div><small>Fırın</small><b>{kiln.maxTemp}°C</b></div><div><small>Ortak çalışma</small><b>{compatibility.ok ? tempRange(compatibility.low,compatibility.high) : 'Yok'}</b></div></div><p className="note">Bu motor yalnızca verilen teknik aralıkların kesişimini kontrol eder. Termal genleşme, atmosfer, uygulama kalınlığı ve koni sonucu ayrıca test edilmelidir.</p></section>}

    {tab === 'yukleme' && <section className="panel wide loadPlanner"><div className="productTabs compact"><div className="productTabButtons">{products.map((p,i) => <button key={p.id} className={activeProductIndex===i?'active':''} onClick={() => setActiveProductIndex(i)}>{p.name}</button>)}</div><div className="productHint">Seçili ürünün ölçüleri aşağıdaki fırın hesabına aktarılır.</div></div><span className="eyebrow">FIRIN YÜKLEME</span><h2>Raf ölçüleri</h2><p className="muted">Ürün ölçüleri Çamur sekmesinden otomatik gelir.</p><div className="fields"><Field label="Raf ölçüsü" value={shelfSize} set={setShelfSize} suffix="mm"/><Field label="Raf aralığı" value={shelfGap} set={setShelfGap} suffix="mm"/></div><div className="dimensionSource"><span>Çamur sekmesinden gelen ürün</span><b>{shape} · Çap {diameter} mm · Yükseklik {height} mm · Genişlik {width} mm</b></div><div className="loadSummary"><div><span>Raf başına yaklaşık</span><b>{shelfCapacity} ürün</b></div><div><span>Ürün çapı</span><b>{diameter} mm</b></div><div><span>Raf aralığı</span><b>{shelfGap} mm</b></div><div><span>Fırın iç yüksekliği</span><b>{kiln.height} mm</b></div></div>
        <div className="loadTable"><div className="loadTableHead"><span>Ürün</span><span>Adet</span><span>Raf / seviye</span><span>Teorik kapasite</span></div>{productLoadPlans.map(p => <div className="loadTableRow" key={p.id}><b>{p.name}</b><span>{p.pieces}</span><span>{p.perShelf} / {p.requiredLevels}</span><span>{p.capacity}</span></div>)}</div>
        <div className="loadTotal"><span>Aynı pişirimde planlanan toplam</span><b>{products.reduce((sum,p) => sum + p.pieces, 0)} ürün</b></div>
        <div className="combinationBox"><div className="combinationHead"><div><span className="eyebrow">OTOMATİK YERLEŞTİRME</span><h3>Farklı kombinasyonlar</h3><p className="muted">Ürün ölçülerini birlikte değerlendirerek raf doluluğunu artıran alternatif yerleşimler oluşturur.</p></div></div>
        <div className="combinationList">{loadCombinations.map((x,i) => <div className={i===0?'combinationRow recommended':'combinationRow'} key={x.name}><div><b>{x.name}</b>{i===0 && <span className="comboBadge">En verimli</span>}<small>{x.placed.length} ürün yerleşti · {x.unplaced} ürün dışarıda · {x.bounds.w} × {x.bounds.h} mm kullanım alanı</small></div><strong>%{x.utilization}</strong><span>{x.placed.length ? x.placed.slice(0,4).map(p => p.productName).join(' · ') : 'Yerleşim yok'}</span></div>)}</div>
        <div className="loadMap"><div className="loadMapTitle">2D raf yerleşimi · en verimli kombinasyon</div><div className="rackMap">{loadCombinations[0]?.placed.map(p => <div key={p.productName} className="rackItem" style={{left:(p.x/shelfSize*100)+'%',top:(p.y/kiln.height*100)+'%',width:(p.w/shelfSize*100)+'%',height:(p.h/kiln.height*100)+'%'}} title={p.productName}>{p.productName.replace(/ #\d+$/,'')}</div>)}</div></div></div>
        <p className="note">Bu algoritma farklı ölçüleri aynı raf üzerinde kombinasyon olarak dener ve teorik doluluk oranını karşılaştırır. Gerçek yüklemede ürünler arası güvenlik boşluğu, raf kenarı, ısı dolaşımı ve ürünün gerçek ayak/çap ölçüsü ayrıca kontrol edilmelidir.</p></section>}

    {tab === 'sir' && <section className="glazeCalc"><div className="productTabs compact"><div className="productTabButtons">{products.map((p,i) => <button key={p.id} className={activeProductIndex===i?'active':''} onClick={() => setActiveProductIndex(i)}>{p.name}</button>)}</div><div className="productHint">Sır yüzeyi ve tüketimi seçili ürünün ölçülerinden hesaplanır.</div></div><div className="glazeHead"><div><span className="eyebrow">SIR TÜKETİMİ</span><h2>Sır miktarını kolayca hesaplayın</h2><p className="muted">Yüzey alanı Çamur sekmesindeki ürün ölçülerinden otomatik hesaplanır.</p></div><span className="glazeIcon">◇</span></div><div className="glazeGrid"><div className="glazeInputs"><div className="glazeCard"><h3>Sır Seçimi</h3><label className="field"><span>Marka / seri</span><select value={glazeIndex} onChange={e => setGlazeIndex(Number(e.target.value))}>{glazes.map((x,i)=><option key={x.code} value={i}>{x.brand} · {x.code} · {x.name}</option>)}</select></label><div className="glazeMeta"><span>Uygulama aralığı</span><b>{tempRange(glaze.min,glaze.max)}</b><span>Yüzey</span><b>{glaze.finish}</b><span>Fiyat</span><b>{glaze.price > 0 ? glaze.price.toFixed(2) + ' TL/kg' : 'Fiyat girilmeli'}</b></div></div><div className="glazeCard"><h3>Uygulama Bilgileri</h3><div className="fields"><label className="field"><span>Yüzey alanı / ürün</span><div><input type="number" value={glazeSurface.toFixed(3)} readOnly/><b>m²</b></div></label><Field label="Kat sayısı" value={coatCount} set={setCoatCount} suffix="kat"/><Field label="Fire / atık" value={waste} set={setWaste} suffix="%"/><Field label="Ürün adedi" value={pieces} set={setPieces} suffix="adet"/></div><div className="dimensionSource"><span>Çamur sekmesinden gelen ölçüler</span><b>{shape} · En {width} mm · Boy {height} mm · Çap {diameter} mm · Et {wallThickness} mm</b></div></div></div><aside className="glazeResult"><div className="resultHeader"><span className="eyebrow">SONUÇ</span><span className="resultIcon">◇</span></div><div className="resultRows"><div><span>Yüzey / ürün</span><b>{(glazeSurface * 10000).toFixed(0)} cm²</b></div><div className="resultHighlight"><span>Sır / ürün</span><b>{glazeCalc.perPiece.toFixed(1)} g</b></div><div><span>Toplam sır · {pieces} adet</span><b>{Math.round(glazeCalc.grams).toLocaleString('tr-TR')} g</b></div><div><span>Toplam</span><b>{(glazeCalc.grams / 1000).toFixed(2)} kg</b></div><div><span>Sır maliyeti</span><b>{glaze.price > 0 ? money(glazeCalc.cost) : 'Fiyat girilmeli'}</b></div></div><div className="glazeInfo">ⓘ Hesap, ürünün dış ve iç yüzeyleri ile et kalınlığına göre yaklaşık yapılır. Kulp, ayak ve özel detaylar ayrıca fark yaratabilir.</div><button className="transferBtn" onClick={() => setTab('camur')}>▣ Çamur ölçülerine dön <span>→</span></button></aside></div></section>}

    {tab === 'kar' && <section className="panel wide"><h2>Kârlılık ve Fiyatlandırma</h2><div className="fields"><Field label="Satış fiyatı" value={salePrice} set={setSalePrice} suffix="₺/ürün"/><Field label="Ambalaj" value={packaging} set={setPackaging} suffix="₺/ürün"/><Field label="Komisyon" value={commission} set={setCommission} suffix="%"/></div><div className="profitHero"><div><small>Ürün maliyeti</small><b>{money(costs.unit)}</b></div><div><small>Net satış / ürün</small><b>{money(salePrice*(1-commission/100))}</b></div><div><small>Tahmini kâr / ürün</small><b>{money(costs.profit/Math.max(pieces,1))}</b></div><div><small>Kâr marjı</small><b>{costs.margin.toFixed(1)}%</b></div></div></section>}

    {tab === 'stok' && <section className="panel wide"><h2>Stok ve Pişirim Günlüğü</h2><div className="fields"><Field label="Çamur stoğu" value={stockClay} set={setStockClay} suffix="g"/><Field label="Sır stoğu" value={stockGlaze} set={setStockGlaze} suffix="g"/></div><button className="primary" onClick={()=>{setStockClay(Math.max(0,stockClay-clayWeight));setStockGlaze(Math.max(0,stockGlaze-glazeCalc.grams));addLog();}}>Stoktan Düş ve Günlüğe Ekle</button><div className="logList">{logs.slice(0,8).map((l,i)=><div className="log" key={i}><b>{l.date}</b><span>{l.kiln} · {l.temp}°C · {l.pieces} ürün</span><strong>{money(l.cost)}</strong></div>)}</div></section>}

    {tab === 'ai' && <section className="panel wide"><h2>AI Seramik Asistanı</h2><p className="muted">Doğal dille malzeme, sıcaklık, maliyet ve üretim senaryosu sor.</p><textarea value={assistantInput} onChange={e=>setAssistantInput(e.target.value)} placeholder="Örn: 30 kupa, GE221, mat sır ve 1250°C ile yaklaşık maliyet ve riskleri çıkar."/><button className="primary" onClick={askAssistant}>{busy?'Yanıt hazırlanıyor…':'Analiz et'}</button>{assistantOutput && <div className="answer">{assistantOutput}</div>}<h3>Fotoğraftan ürün analizi</h3><input type="file" accept="image/*" onChange={e=>e.target.files?.[0] && analyzePhoto(e.target.files[0])}/>{photoOutput && <div className="answer">{photoOutput}</div>}<p className="note">Fotoğraf analizi yaklaşık yüzey/ölçü ve ürün tipi çıkarımı içindir, hassas ölçüm yerine geçmez.</p></section>}

    <footer>Teknik değerler kaynaklarıyla birlikte tutulur. Geometrik ve sır tüketimi sonuçları yaklaşık üretim tahminidir; gerçek uygulama ölçümüyle kalibre edilmelidir.</footer>
  </main>;
}
export default App;