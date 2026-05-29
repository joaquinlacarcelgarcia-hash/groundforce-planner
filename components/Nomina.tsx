type Props = {
  salarioBase: number;
  plusNocturnidad: number;
  plusFestivos: number;
  plusTransporte: number;
  bruto: number;
  irpf: number;
  neto: number;
};

export default function Nomina({
  salarioBase,
  plusNocturnidad,
  plusFestivos,
  plusTransporte,
  bruto,
  irpf,
  neto,
}: Props) {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-2xl">

      <h2 className="mb-5 text-2xl font-bold text-emerald-700">
        Nómina estimada
      </h2>

      <div className="space-y-3">

        <div className="flex justify-between">
          <span>Salario base</span>

          <span>
            {salarioBase.toFixed(2)} €
          </span>
        </div>

        <div className="flex justify-between">
          <span>Nocturnidad</span>

          <span>
            {plusNocturnidad.toFixed(2)} €
          </span>
        </div>

        <div className="flex justify-between">
          <span>Festivos</span>

          <span>
            {plusFestivos.toFixed(2)} €
          </span>
        </div>

        <div className="flex justify-between">
          <span>Plus transporte</span>

          <span>
            {plusTransporte.toFixed(2)} €
          </span>
        </div>

        <div className="flex justify-between">
          <span>IRPF</span>

          <span>
            {irpf.toFixed(2)} €
          </span>
        </div>
<div className="flex items-center justify-between">

  <span className="text-slate-600">
    Bruto
  </span>

  <span className="font-bold">
    {bruto.toFixed(2)} €
  </span>

</div>
<div className="flex justify-between border-t pt-4 text-xl font-black">

          <span>Neto estimado</span>

          <span className="text-emerald-700">
            {neto.toFixed(2)} €
          </span>

        </div>

      </div>

    </div>
  );
}