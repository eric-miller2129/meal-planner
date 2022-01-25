import axios from 'axios';
import { ActionFunction, Form, LoaderFunction, redirect, json, useLoaderData } from 'remix';
import { Nutrition } from '~/utils/models/Nutrition';
import recipeService from '~/utils/recipe.service';
import { commitSession, getSession } from '~/utils/sessions';

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const body = await request.formData();

  // const { data } = await axios.post(`${ process.env.API_URL }/`, { url: body.get('url') });
  const nutrition = await recipeService.getNutrition(body.get('url') as string);
  console.log(Object.entries(nutrition));
  session.flash(
    'data',
    Object.entries(nutrition),
  );

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    }
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  const data = session.get('data') || null;

  return json(
    { data },
    {
      headers: {
        // only necessary with cookieSessionStorage
        "Set-Cookie": await commitSession(session)
      }
    }
  )
};

export default function Index() {
  const { data } = useLoaderData();
  // console.log(Object.entries(data));
  console.log(data);
  return (
    <>
      <h1>Nutrition Thing</h1>
      <Form method="post">
        <div>
          <label htmlFor="website">Recipe Url:</label>
          <input type="text" id="website" name="url" />
        </div>
        <div>
          <button type="submit">Get Nutrition</button>
        </div>
      </Form>
      {data &&
        <>
          <h2>Deets:</h2>
          <ul>
            {
              data.map((n: any) => <li key={n[0]}><strong>{n[0]}: </strong>{n[1].value}</li>)
            }
          </ul>
        </>
      }
    </>
  );
}
