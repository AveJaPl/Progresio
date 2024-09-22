interface IParameters {
  id: string;
}

export default function Parameters({ params }: {params: IParameters}) {
    console.log(params.id);
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold">Witaj w Aurora</h1>
      <p className="text-lg mt-4">Parametr o id: {params.id}</p>
    </div>
  );
}
