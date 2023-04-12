import { useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from './Components/Form';

const createUserFormSchema = z.object({
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
  email: z
  .string()
  .nonempty("E-mail é obrigatório")
  .email("E-mail inválido")
  .toLowerCase(),

  password: z.string().min(5, "A senha deve ter pelo menos 5 caracteres"),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty("Você precisa inserir um nome"),
      })
    )
    .min(1, "Insira pelo menos uma tecnologia"),
});

type createUserFormProps = z.infer<typeof createUserFormSchema>;

function App() {
  const [output, setOutput] = useState<string>();

  const createUserForm = useForm<createUserFormProps>({
    resolver: zodResolver(createUserFormSchema),
  }); 

  
  const { 
    handleSubmit, 
    watch,
    control,
  } = createUserForm;
  
  const { fields, append, remove } = useFieldArray({
    name: "techs",
    control,
  });

  const addNewTech = () => {
    append({ title: ""});
  };

  const authUser = (data: any) => {
    setOutput(JSON.stringify(data, null, 2));
  };

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex flex-col items-center justify-center ">

      <h1 className="text uppercase  text-white text-5xl m-10">Simple Form using useForm and Zod</h1>
      <FormProvider {...createUserForm}>
        <form
          noValidate
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(authUser)}
        >
          <Form.Field>
            <Form.Label htmlFor="name">Name</Form.Label>
            <Form.Input type="text" name="name" />
            <Form.ErrorMessage field="name" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="name">Email</Form.Label>
            <Form.Input type="email" name="email" />
            <Form.ErrorMessage field="email" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Input type="password" name="password" />
            <Form.ErrorMessage field="password" />
          </Form.Field>


          <Form.Field>
            <Form.Label>
              Tecnologias

              <button 
                type="button" 
                onClick={addNewTech}
                className="text-emerald-500 font-semibold text-xs flex items-center gap-1"
              >
                Adicionar nova
              </button>
            </Form.Label>
            <Form.ErrorMessage field="techs" />

            {fields.map((field, index) => {
              const fieldName = `techs.${index}.title`

              return (
                <Form.Field key={field.id}>
                  <div className="flex gap-2 items-center">
                    <Form.Input type={fieldName} name={fieldName} />
                    <button 
                      type="button" 
                      onClick={() => remove(index)}
                      className="text-red-500"
                    >
                    Apagar
                    </button>
                  </div>
                  <Form.ErrorMessage field={fieldName} />
                </Form.Field>
              )
            })}
          </Form.Field>
        

          <button
            type="submit"
            className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600"
          >
            Sign In
          </button>
          <div className="flex flex-col gap-4"></div>
        </form>
      </FormProvider>

      <pre>{output}</pre>

    </main>
  );
}

export default App;
