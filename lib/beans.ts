export type Process = "Natural" | "Honey" | "Washed" | "Wine";

export type Bean = {
  id: string;
  name: string;
  village: string;
  altitude: number; // meter di atas permukaan laut
  process: Process;
  notes: string;
  price: number; // rupiah
  weight: number; // gram
  thisWeek: boolean; // disangrai Selasa ini
};

export const PROCESSES: Process[] = ["Natural", "Honey", "Washed", "Wine"];

export const BEANS: Bean[] = [
  {
    id: "srimulyo-natural",
    name: "Srimulyo",
    village: "Kebun Pak Sarwo",
    altitude: 820,
    process: "Natural",
    notes: "Cokelat hitam, nangka matang, sedikit cengkih",
    price: 92000,
    weight: 200,
    thisWeek: true,
  },
  {
    id: "sumbersuko-honey",
    name: "Sumbersuko",
    village: "Kelompok Tani Margo Rukun",
    altitude: 760,
    process: "Honey",
    notes: "Gula aren, kacang mete, kayu manis",
    price: 88000,
    weight: 200,
    thisWeek: true,
  },
  {
    id: "baturetno-washed",
    name: "Baturetno",
    village: "Kebun Bu Lastri",
    altitude: 680,
    process: "Washed",
    notes: "Kakao, tembakau manis, akhir yang bersih",
    price: 78000,
    weight: 200,
    thisWeek: true,
  },
  {
    id: "lereng-wine",
    name: "Lereng Wine",
    village: "Kebun Pak Sarwo",
    altitude: 880,
    process: "Wine",
    notes: "Tape ketan, ceri hitam, anggur merah",
    price: 110000,
    weight: 200,
    thisWeek: false,
  },
  {
    id: "tirtoyudo-natural",
    name: "Tirtoyudo",
    village: "Kelompok Tani Sido Makmur",
    altitude: 900,
    process: "Natural",
    notes: "Plum, cokelat susu, manis yang panjang",
    price: 95000,
    weight: 200,
    thisWeek: false,
  },
  {
    id: "campuran-rumah",
    name: "Campuran Rumah",
    village: "Srimulyo dan Baturetno",
    altitude: 750,
    process: "Washed",
    notes: "Dibuat untuk kopi susu: tebal, cokelat, tidak asam",
    price: 70000,
    weight: 250,
    thisWeek: false,
  },
];

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getBean(id: string) {
  return BEANS.find((bean) => bean.id === id);
}
