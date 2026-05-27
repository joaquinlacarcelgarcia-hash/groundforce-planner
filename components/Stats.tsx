type Props = {
  horas: number;
  nocturnas: number;
  dias: number;
  festivos: number;
  ocupacion: number;
};

export default function Stats({
  horas,
  nocturnas,
  dias,
  festivos,
  ocupacion,
}: Props) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-2xl">

      <h2 className="text-2xl font-bold mb-5">
        Estadísticas
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span>Horas trabajadas</span>
          <span className="font-bold">
            {horas}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Horas nocturnas</span>
          <span className="font-bold">
            {nocturnas}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Días trabajados</span>
          <span className="font-bold">
            {dias}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Festivos</span>
          <span className="font-bold">
            {festivos}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Grado ocupación</span>

          <span className="font-bold text-blue-700">
            {ocupacion}%
          </span>
        </div>

      </div>

    </div>
  );
}