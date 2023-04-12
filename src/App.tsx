import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createUserFormSchema = z.object({
  email: z
    .string()
    .nonempty("E-mail é obrigatório")
    .email("E-mail inválido")
    .toLowerCase(),
  password: z.string().min(5, "A senha deve ter pelo menos 5 caracteres"),
  name: z.string().transform((name) => {
    if (name.length == 0) return;

    return name
      .trim()
      .split(" ")
      .map((word) => {
        return word[0].toUpperCase().concat(word.substring(1));
      })
      .join(" ");
  }),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty("Is required"),
        knowledge: z.coerce.number().min(1).max(100),
      })
    )
    .min(1, "Insira pelo menos uma tecnologia"),
});

type createUserFormProps = z.infer<typeof createUserFormSchema>;

function App() {
  const [output, setOutput] = useState<string>();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<createUserFormProps>({
    resolver: zodResolver(createUserFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "techs",
    control,
  });

  const addNewTech = () => {
    append({ title: "", knowledge: 0 });
  };

  const authUser = (data: any) => {
    setOutput(JSON.stringify(data, null, 2));
  };

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex flex-col items-center justify-center ">
      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(authUser)}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Name</label>
          <input
            className="border border-zinc-200 rounded h-10 text-black p-2"
            type="email"
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            className="border border-zinc-200 rounded h-10 text-black p-2"
            type="email"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input
            className="border border-zinc-200 rounded h-10 text-black p-2"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="techs" className="flex justify-between">
            Tecnologies
            <button onClick={addNewTech} className="text-emerald-500 text-sm">
              Add Tech
            </button>
          </label>

          {fields?.map((field, index) => {
            return (
              <div key={field.id} className="flex gap-5">
                <input
                  className="flex-1 border border-zinc-200 rounded h-10 text-black p-2"
                  type="text"
                  {...register(`techs.${index}.title`)}
                />
                <input
                  className="w-16 border border-zinc-200 rounded h-10 text-black p-2"
                  type="number"
                  {...register(`techs.${index}.knowledge`)}
                />
                <span className="text-red-500 text-sm">
                  {errors.techs?.[index] &&
                    errors.techs?.[index]?.knowledge?.message}
                </span>
              </div>
            );
          })}
        </div>
        <span className="text-red-500 text-sm">
          {errors.techs && errors.techs.message}
        </span>

        <button
          type="submit"
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600"
        >
          Sign In
        </button>
        <div className="flex flex-col gap-4"></div>
      </form>
      <pre>{output}</pre>
    </main>
  );
}

export default App;
