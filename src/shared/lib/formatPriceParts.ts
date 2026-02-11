export default function formatPriceParts(value: number) {
  const parts = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).formatToParts(value);

  const rub: string[] = [];
  const kop: string[] = [];

  parts.forEach((p) => {
    if (p.type === 'fraction') kop.push(p.value);
    else rub.push(p.value);
  });

  return {
    rub: rub.join('').replace(/[,.]$/, ''),
    kop: kop.join(''),
  };
}
