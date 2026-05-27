type Props = {
  errores: string[];
};

export default function Verificador({
  errores,
}: Props) {
  return (
    <div className="rounded-3xl bg-red-50 border border-red-200 p-5 shadow-2xl">

      <h2 className="text-2xl font-bold text-red-700 mb-5">
        Verificador
      </h2>

      {errores.length === 0 ? (
        <div className="rounded-2xl bg-green-100 p-3 text-green-700 font-semibold">
          No se detectan incidencias
        </div>
      ) : (
        <div className="space-y-3">

          {errores.map(
            (
              error,
              index
            ) => (
              <div
                key={index}
                className="rounded-2xl bg-red-100 p-3 text-red-700 font-semibold"
              >
                ⚠️ {error}
              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}